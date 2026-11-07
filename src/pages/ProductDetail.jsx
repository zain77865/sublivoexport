import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductReviews from '../components/ProductReviews';

const ProductDetail = ({ products, isLoading, handleAddToCart }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const product = products.find(p => p._id === id || p.id === id || p.id === parseInt(id));

  const currentId = product ? (product._id || product.id) : null;
  const relatedProducts = products
    .filter(p => (p._id !== currentId && p.id !== currentId && p.id !== parseInt(currentId)))
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="glass-panel" style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="glass-panel" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <h2 style={{ color: 'white' }}>Product not found</h2>
        <button className="btn-primary" onClick={() => navigate('/shop')}>Back to Shop</button>
      </div>
    );
  }

  return (
    <div className="glass-panel product-detail-glass-panel" style={{ width: '100%', minHeight: '100vh', borderRadius: '0', boxSizing: 'border-box', overflowY: 'auto' }}>
      <div className="product-detail-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <button
          onClick={() => navigate(-1)}
          className="product-detail-back-btn"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            flexShrink: 0,
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <ChevronLeft className="product-detail-back-icon" size={22} />
        </button>
        <h1 className="section-title product-detail-main-title" style={{ margin: 0 }}>Product Detail</h1>
      </div>

      <ProductCard product={product} isDetailView={true} noBackground={true} onAddToCart={handleAddToCart} showQuantitySelector={true} />

      <div className="product-detail-desc" style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px' }}>
        <h3 className="section-title product-detail-desc-title" style={{ marginBottom: '20px', fontSize: '24px' }}>Description</h3>
        <p className="product-detail-desc-text" style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px', whiteSpace: 'pre-wrap' }}>
          {product.description || 'Premium quality sportswear manufactured directly by SublivoExport in Pakistan. Engineered with breathable, sweat-wicking fabrics and high-definition sublimation printing that never fades.'}
        </p>
      </div>

      <ProductReviews productId={product.id || product._id} />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="product-detail-related">
          <div className="related-header-row">
            <div>
              <p className="related-eyebrow">
                You May Also Like
              </p>
              <h3 className="section-title related-main-title">
                Related Products
              </h3>
            </div>
            <button 
              onClick={() => { navigate('/shop'); window.scrollTo(0, 0); }} 
              className="btn-outline related-view-all-btn"
            >
              View All Products →
            </button>
          </div>

          <div className="related-products-grid">
            {relatedProducts.map((relProduct) => (
              <ProductCard 
                key={relProduct._id || relProduct.id} 
                product={relProduct} 
                onAddToCart={handleAddToCart} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
