import React, { useState } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight, MessageCircle, ArrowRight, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onMoreDetailClick, isDetailView, noBackground, onAddToCart, showQuantitySelector = false }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const allPossibleSizes = ['Small', 'Medium', 'Large', 'XL'];
  const availableSizes = (product.sizes && product.sizes.length > 0)
    ? product.sizes
    : allPossibleSizes;
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || 'Medium');

  const images = (product.images && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : ['']);
  const video = product.video || null;
  const totalMedia = images.length + (video ? 1 : 0);

  // Dynamic pricing based on selected size or product base prices
  const sizePricing = product.sizePrices?.[selectedSize];
  const currentPrice = (sizePricing && sizePricing.price !== '' && sizePricing.price !== undefined)
    ? Number(sizePricing.price)
    : (Number(product.price) || 0);

  const currentActualPrice = (sizePricing && sizePricing.actualPrice !== '' && sizePricing.actualPrice !== undefined)
    ? Number(sizePricing.actualPrice)
    : (Number(product.actualPrice) || currentPrice);

  const discountPercentage = currentActualPrice > currentPrice
    ? Math.round(((currentActualPrice - currentPrice) / currentActualPrice) * 100)
    : 0;

  const handleWhatsAppChat = (e) => {
    if (e) e.stopPropagation();
    const productUrl = `${window.location.origin}/product/${product._id || product.id}`;
    const msg = `Hi SublivoExport, I want to inquire about this product:\n*${product.title}*\nPrice: $${currentPrice}\nLink: ${productUrl}\nCan you provide more information?`;
    window.open(`https://wa.me/923204615100?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAddToCart = (e) => {
    if (e) e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({
        id: product.id || product._id,
        title: product.title,
        price: currentPrice,
        actualPrice: currentActualPrice,
        image: images[0],
        size: isDetailView ? selectedSize : undefined,
        quantity: isDetailView ? quantity : 1,
      });
    }
  };

  const handlePrevMedia = () => setActiveMediaIndex((prev) => (prev - 1 + totalMedia) % totalMedia);
  const handleNextMedia = () => setActiveMediaIndex((prev) => (prev + 1) % totalMedia);
  const isVideoActive = video && activeMediaIndex === images.length;

  /* ══════════════════════════════════════
     HOME / SHOP — Simple image-only card
     ══════════════════════════════════════ */
  if (!isDetailView && !noBackground) {
    return (
      <div
        className="product-card-simple"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => navigate(`/product/${product._id || product.id}`)}
        style={{
          borderColor: hovered ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
        }}
      >
        {/* Image — no zoom, no translate */}
        <img
          src={images[0]}
          alt={product.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Discount badge */}
        {discountPercentage > 0 && (
          <div className="product-discount-badge">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Cart button at bottom right corner */}
        <button
          onClick={handleAddToCart}
          title="Add to Cart"
          className="product-card-cart-btn"
        >
          <ShoppingCart size={14} />
        </button>
      </div>
    );
  }

  /* ══════════════════════════════════════
     DETAIL PAGE — Full product card
     ══════════════════════════════════════ */
  return (
    <div className={noBackground ? 'product-details' : 'product-details glass-panel'}>

      {/* Thumbnails */}
      <div className="product-thumbnails" style={{ display: 'flex', gap: '10px' }}>
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            onClick={() => setActiveMediaIndex(idx)}
            style={{
              width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer',
              border: activeMediaIndex === idx ? '2px solid var(--primary)' : '2px solid transparent',
            }}
            alt={`${product.title} - Preview ${idx + 1}`}
          />
        ))}
        {video && (
          <div
            onClick={() => setActiveMediaIndex(images.length)}
            className="glass"
            style={{
              width: '50px', height: '50px', borderRadius: '8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: isVideoActive ? '2px solid var(--primary)' : '2px solid transparent',
            }}
          >
            <PlayCircle size={24} color="var(--primary)" />
          </div>
        )}
      </div>

      {/* Main media */}
      <div className="product-details-img-container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {totalMedia > 1 && (
          <button onClick={handlePrevMedia} className="glass hover-scale product-arrow-btn" style={{ position: 'absolute', left: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', padding: '8px', color: 'white', cursor: 'pointer', display: 'flex', zIndex: 2 }}>
            <ChevronLeft className="product-arrow-icon" size={24} />
          </button>
        )}

        {isVideoActive ? (
          <video src={video} controls autoPlay loop className="product-details-img"
            style={{ borderRadius: '16px', position: 'relative', zIndex: 1, maxHeight: '400px', width: '100%', objectFit: 'contain' }}
          />
        ) : (
          <img src={images[activeMediaIndex]} id="product-details" alt={product.title}
            className="product-details-img"
            style={{ borderRadius: '16px', position: 'relative', zIndex: 1 }}
          />
        )}

        {totalMedia > 1 && (
          <button onClick={handleNextMedia} className="glass hover-scale product-arrow-btn" style={{ position: 'absolute', right: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', padding: '8px', color: 'white', cursor: 'pointer', display: 'flex', zIndex: 2 }}>
            <ChevronRight className="product-arrow-icon" size={24} />
          </button>
        )}
      </div>

      {/* Product info */}
      <div className="product-details-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="product-details-badge-row" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '15px' }}>
          <button onClick={handleWhatsAppChat} className="hero-tag glass hover-scale"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#fff', borderColor: 'rgba(255,255,255,0.2)', margin: 0, cursor: 'pointer', background: 'rgba(255,255,255,0.1)' }}>
            <MessageCircle size={14} /> Chat now
          </button>
        </div>

        <h2 className="product-details-title">{product.title}</h2>

        {/* Price & Quantity Container */}
        <div className="product-details-price-container" style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '14px 0 16px' }}>
          <div className="product-quantity-selector glass" style={{ display: 'flex', alignItems: 'center', padding: '0 15px', borderRadius: '30px', height: '40px' }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>-</button>
            <span style={{ margin: '0 15px', fontWeight: 'bold' }}>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>+</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h3 className="product-details-price" style={{ lineHeight: 1, margin: 0 }}>${currentPrice * quantity}</h3>
            {discountPercentage > 0 && (
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <span className="product-details-old-price" style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>${currentActualPrice * quantity}</span>
                <span className="product-details-discount glass" style={{ position: 'absolute', top: '-18px', left: '70%', marginLeft: '5px', padding: '2px 6px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '10px', whiteSpace: 'nowrap' }}>{discountPercentage}% OFF</span>
              </div>
            )}
          </div>
        </div>

        {/* Available Sizes Section */}
        {isDetailView && (
          <div className="product-available-sizes-wrapper" style={{ margin: '6px 0 18px' }}>
            <div className="sizes-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="sizes-title-label" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Available Sizes
              </span>
              <span className="sizes-selected-label" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Selected: <strong style={{ color: 'white' }}>{selectedSize}</strong>
              </span>
            </div>
            <div className="sizes-pills-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {allPossibleSizes.map((size) => {
                const isAvailable = availableSizes.includes(size);
                const isSelected = selectedSize === size;
                const specificPrice = product.sizePrices?.[size]?.price;
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => {
                      if (isAvailable) setSelectedSize(size);
                    }}
                    className={`size-pill-btn ${isSelected ? 'active' : ''}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: isSelected 
                        ? '1.5px solid var(--primary)' 
                        : isAvailable 
                          ? '1px solid rgba(255,255,255,0.2)' 
                          : '1px solid rgba(255,255,255,0.06)',
                      background: isSelected 
                        ? 'rgba(245,166,35,0.18)' 
                        : isAvailable 
                          ? 'rgba(255,255,255,0.04)' 
                          : 'rgba(255,255,255,0.02)',
                      color: isSelected ? 'var(--primary)' : isAvailable ? 'white' : 'rgba(255,255,255,0.25)',
                      cursor: isAvailable ? 'pointer' : 'not-allowed',
                      fontSize: '13px',
                      fontWeight: isSelected ? '700' : '500',
                      opacity: isAvailable ? 1 : 0.45,
                      transition: 'all 0.2s ease',
                      userSelect: 'none',
                      outline: 'none',
                      boxShadow: isSelected ? '0 0 10px rgba(245,166,35,0.25)' : 'none'
                    }}
                  >
                    <span className="size-pill-name">{size}</span>
                    {specificPrice && (
                      <span className="size-pill-price" style={{ fontSize: '11px', opacity: 0.85, fontWeight: '600' }}>
                        (${specificPrice})
                      </span>
                    )}
                    {!isAvailable && (
                      <span className="size-pill-out" style={{ fontSize: '10px', color: '#ff6b6b' }}>
                        (Out)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons directly AFTER Available Sizes on all devices */}
        <div className="product-actions" style={{ display: 'contents' }}>
          <div className="product-actions-buttons" style={{ display: 'flex', gap: '15px', width: '100%', marginTop: '10px' }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#31cd6aff', color: 'white', borderColor: '#22c55e' }}
              onClick={() => navigate(`/checkout/${product._id || product.id}`, { state: { quantity, size: selectedSize, price: currentPrice, actualPrice: currentActualPrice } })}>
              Buy Sample
            </button>
            <button onClick={handleAddToCart} className="btn-outline" style={{ flex: 1, justifyContent: 'center', background: 'transparent' }}>
              <ShoppingCart size={18} /> Add to Cart
            </button>
          </div>
          {!isDetailView && (
            <div onClick={() => navigate(`/product/${product._id || product.id}`)} className="more-detail-btn hover-text-primary" style={{ cursor: 'pointer' }}>
              <span>More Detail</span>
              <ArrowRight size={16} className="text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
