import { API_URL } from '../config';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, LogOut, Plus, Trash2, Upload, ShoppingBag, ArrowLeft, Menu, X, Tag, Star } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

export const PRODUCT_CATEGORIES = [
  'Football Jerseys',
  'Rugby Shirts',
  'T-Shirts',
  'Polo Shirts',
  'Hoodies & Jackets',
  'Shorts & Bottoms',
  'Sports Shoes',
  'Accessories'
];

export const AVAILABLE_SIZES = ['Small', 'Medium', 'Large', 'XL'];

const AdminDashboard = ({ adminToken, setAdminToken, products, fetchProducts, isSubAdmin, permissions = [] }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [newProduct, setNewProduct] = useState({
    title: '',
    actualPrice: '',
    price: '',
    category: 'Football Jerseys',
    sizes: ['Small', 'Medium', 'Large', 'XL'],
    sizePrices: {
      Small: { price: '', actualPrice: '' },
      Medium: { price: '', actualPrice: '' },
      Large: { price: '', actualPrice: '' },
      XL: { price: '', actualPrice: '' }
    },
    isFeatured: false,
    images: [''],
    description: ''
  });
  const navigate = useNavigate();
  const fileInputRefs = useRef({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const orderCountRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!adminToken) {
      navigate(isSubAdmin ? '/admin' : '/super-admin');
      return;
    }

    let intervalId;
    
    if (!isSubAdmin) {
      if (document.visibilityState === 'visible') fetchOrdersSilent();
      intervalId = setInterval(() => {
        if (document.visibilityState === 'visible') fetchOrdersSilent();
      }, 120000);
    } else {
      const checkSession = async () => {
        if (document.visibilityState !== 'visible') return;
        try {
          const r = await fetch(`${API_URL}/sub-admin/verify`, {
            headers: { Authorization: 'Bearer ' + adminToken }
          });
          if (!r.ok) {
            sessionStorage.removeItem('subAdminToken');
            sessionStorage.removeItem('subAdminPermissions');
            setAdminToken(null);
            setShowLogoutModal(true);
            setTimeout(() => navigate('/admin'), 3000);
            return;
          }
        } catch {}
      };
      checkSession();
      intervalId = setInterval(checkSession, 120000);
    }
    
    intervalRef.current = intervalId;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!isSubAdmin) fetchOrdersSilent();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [adminToken, navigate, isSubAdmin]);

  const fetchOrdersSilent = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`, { headers: { Authorization: 'Bearer ' + adminToken } });
      if (res.ok) {
        const data = await res.json();
        if (orderCountRef.current !== null && data.length > orderCountRef.current) {
          setNewOrderAlert(true);
          try { new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAA...').play(); } catch {}
        }
        orderCountRef.current = data.length;
      }
    } catch (err) { console.error(err); }
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    navigate('/super-admin');
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`${API_URL}/products/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert('Delete failed: ' + (err.message || res.status));
          return;
        }
        fetchProducts(true);
      } catch (err) {
        console.error('Failed to delete product', err);
        alert('Network error: Could not delete product.');
      }
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      const updatedStatus = !product.isFeatured;
      const res = await fetch(`${API_URL}/products/${product.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ ...product, isFeatured: updatedStatus })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Failed to update featured status: ' + (err.message || res.status));
        return;
      }
      fetchProducts(true);
    } catch (err) {
      console.error('Failed to toggle featured status', err);
      alert('Network error: Could not update featured status.');
    }
  };

  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const cleanedProduct = {
        ...editingProduct,
        isFeatured: Boolean(editingProduct.isFeatured),
        category: editingProduct.category || 'Football Jerseys',
        sizes: editingProduct.sizes && editingProduct.sizes.length > 0 ? editingProduct.sizes : AVAILABLE_SIZES,
        sizePrices: editingProduct.sizePrices || {},
        images: editingProduct.images.filter(img => img.trim() !== '')
      };

      const res = await fetch(`${API_URL}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(cleanedProduct)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Update failed: ' + (err.message || res.status));
        return;
      }
      setEditingProduct(null);
      fetchProducts(true);
    } catch (err) {
      console.error('Failed to update product', err);
      alert('Network error: Could not update product.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const cleanedProduct = {
        ...newProduct,
        isFeatured: Boolean(newProduct.isFeatured),
        category: newProduct.category || 'Football Jerseys',
        sizes: newProduct.sizes && newProduct.sizes.length > 0 ? newProduct.sizes : AVAILABLE_SIZES,
        sizePrices: newProduct.sizePrices || {},
        images: newProduct.images.filter(img => img.trim() !== '')
      };

      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(cleanedProduct)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Add failed: ' + (err.message || res.status));
        return;
      }
      setAddingProduct(false);
      setNewProduct({
        title: '',
        actualPrice: '',
        price: '',
        category: 'Football Jerseys',
        isFeatured: false,
        sizes: ['Small', 'Medium', 'Large', 'XL'],
        sizePrices: {
          Small: { price: '', actualPrice: '' },
          Medium: { price: '', actualPrice: '' },
          Large: { price: '', actualPrice: '' },
          XL: { price: '', actualPrice: '' }
        },
        images: [''],
        description: ''
      });
      fetchProducts(true);
    } catch (err) {
      console.error('Failed to add product', err);
      alert('Network error: Could not add product.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSizePriceChange = (size, field, value, isEditing) => {
    if (isEditing) {
      setEditingProduct(prev => ({
        ...prev,
        sizePrices: {
          ...(prev.sizePrices || {}),
          [size]: {
            ...((prev.sizePrices && prev.sizePrices[size]) || {}),
            [field]: value !== '' ? Number(value) : ''
          }
        }
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        sizePrices: {
          ...(prev.sizePrices || {}),
          [size]: {
            ...((prev.sizePrices && prev.sizePrices[size]) || {}),
            [field]: value !== '' ? Number(value) : ''
          }
        }
      }));
    }
  };

  const handleImageChange = (index, value, isEditing) => {
    if (isEditing) {
      const updatedImages = [...editingProduct.images];
      updatedImages[index] = value;
      setEditingProduct({ ...editingProduct, images: updatedImages });
    } else {
      const updatedImages = [...newProduct.images];
      updatedImages[index] = value;
      setNewProduct({ ...newProduct, images: updatedImages });
    }
  };

  const addImageField = (isEditing) => {
    if (isEditing) {
      setEditingProduct({ ...editingProduct, images: [...editingProduct.images, ''] });
    } else {
      setNewProduct({ ...newProduct, images: [...newProduct.images, ''] });
    }
  };

  const removeImageField = (index, isEditing) => {
    if (isEditing) {
      const updatedImages = editingProduct.images.filter((_, i) => i !== index);
      setEditingProduct({ ...editingProduct, images: updatedImages });
    } else {
      const updatedImages = newProduct.images.filter((_, i) => i !== index);
      setNewProduct({ ...newProduct, images: updatedImages });
    }
  };

  const handleFileUpload = (e, index, isEditing) => {
    const file = e.target.files[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(blobUrl);
        
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        handleImageChange(index, compressedBase64, isEditing);
      };
      img.src = blobUrl;
    }
  };

  const triggerFileInput = (index, isEditing) => {
    const key = `${isEditing ? 'edit' : 'add'}-${index}`;
    if (fileInputRefs.current[key]) {
      fileInputRefs.current[key].click();
    }
  };

  if (!adminToken) return null;
  if (isSubAdmin && !permissions.includes('products')) return (
    <div className="glass-panel" style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h2>You do not have permission to view products.</h2>
    </div>
  );

  return (
    <div className="glass-panel admin-layout" style={{ borderRadius: '0', padding: 0, boxSizing: 'border-box' }}>
      
      {/* Mobile Menu Button */}
      <button 
        className="admin-menu-btn" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{
          display: isMobile ? 'flex' : 'none',
          position: 'fixed',
          top: '18px',
          left: '18px',
          zIndex: 1100,
          background: 'rgba(30, 30, 50, 0.95)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Custom Logout Modal */}
      {showLogoutModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(30,30,50,0.98), rgba(20,20,40,0.98))', border: '1px solid rgba(255,71,87,0.4)', borderRadius: '20px', padding: '50px 60px', textAlign: 'center', maxWidth: '420px', boxShadow: '0 25px 80px rgba(255,71,87,0.25)' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,71,87,0.15)', border: '2px solid rgba(255,71,87,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' }}>🚫</div>
            <h2 style={{ margin: '0 0 12px', fontSize: '22px', fontWeight: '700', color: '#ff4757' }}>Access Revoked</h2>
            <p style={{ margin: '0 0 8px', color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: '1.6' }}>Your admin account has been removed by the Super Admin.</p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Redirecting to login page...</p>
            <div style={{ marginTop: '24px', height: '4px', borderRadius: '2px', background: 'rgba(255,71,87,0.2)', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#ff4757', borderRadius: '2px', animation: 'slideProgress 3s linear forwards' }} />
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes slideProgress { from { width: 0% } to { width: 100% } }`}</style>
      
      {/* Sidebar */}
      <AdminSidebar
        activePage="products"
        isSubAdmin={isSubAdmin}
        permissions={permissions}
        adminToken={adminToken}
        setAdminToken={setAdminToken}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="admin-main-content" style={{ flex: 1, padding: isMobile ? '20px 12px' : '40px', boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '30px', gap: isMobile ? '12px' : '0' }}>
          <div>
            <h1 className="section-title" style={{ margin: 0, fontSize: isMobile ? '22px' : '28px' }}>
              Products <span style={{ color: 'var(--primary)' }}>Management</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>
              Manage sportswear catalog, pricing, categories and product inventory.
            </p>
          </div>
          <button 
            onClick={() => setAddingProduct(true)}
            className="btn-primary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: isMobile ? '8px 14px' : '12px 20px',
              fontSize: isMobile ? '13px' : '15px',
              alignSelf: isMobile ? 'stretch' : 'auto',
              justifyContent: 'center'
            }}
          >
            <Plus size={isMobile ? 16 : 20} /> Add New Product
          </button>
        </div>

        {/* Product Table */}
        <div className="glass" style={{ borderRadius: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: isMobile ? '450px' : 'auto' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: isMobile ? '8px 10px' : '15px', fontSize: isMobile ? '12px' : '14px', width: '60px' }}>Image</th>
                <th style={{ padding: isMobile ? '8px 10px' : '15px', fontSize: isMobile ? '12px' : '14px' }}>Product Details</th>
                <th style={{ padding: isMobile ? '8px 10px' : '15px', fontSize: isMobile ? '12px' : '14px' }}>Category</th>
                <th style={{ padding: isMobile ? '8px 10px' : '15px', fontSize: isMobile ? '12px' : '14px' }}>Price</th>
                <th style={{ padding: isMobile ? '8px 10px' : '15px', fontSize: isMobile ? '12px' : '14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const actual = product.actualPrice || 1500;
                const discount = Math.round(((actual - product.price) / actual) * 100);
                const mainImage = (product.images && product.images.length > 0) ? product.images[0] : (product.image || '');
                const category = product.category || 'Football Jerseys';
                
                return (
                <tr key={product.id} style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <td style={{ padding: isMobile ? '8px 10px' : '15px' }}>
                    <img src={mainImage} alt={product.title} style={{ width: isMobile ? '40px' : '50px', height: isMobile ? '40px' : '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)' }} />
                  </td>
                  <td style={{ padding: isMobile ? '8px 10px' : '15px', maxWidth: isMobile ? '140px' : '260px' }}>
                    <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: isMobile ? '12px' : '14px' }}>{product.title}</div>
                    {!isMobile && <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.description}</div>}
                    <div style={{ marginTop: '5px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product)}
                        title={product.isFeatured ? 'Click to unfeature from homepage' : 'Click to feature on homepage'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: product.isFeatured ? 'rgba(245, 166, 35, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          color: product.isFeatured ? 'var(--primary)' : 'var(--text-muted)',
                          border: product.isFeatured ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.15)',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: isMobile ? '10px' : '11px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Star size={11} fill={product.isFeatured ? 'var(--primary)' : 'transparent'} color={product.isFeatured ? 'var(--primary)' : 'var(--text-muted)'} />
                        {product.isFeatured ? 'Featured on Home' : 'Feature on Home'}
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: isMobile ? '8px 10px' : '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(245, 166, 35, 0.12)', 
                        color: 'var(--primary)', 
                        border: '1px solid rgba(245, 166, 35, 0.3)', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: isMobile ? '10px' : '11.5px', 
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        width: 'fit-content'
                      }}>
                        <Tag size={11} /> {category}
                      </span>
                      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                        {(product.sizes && product.sizes.length > 0 ? product.sizes : AVAILABLE_SIZES).map(s => (
                          <span key={s} style={{ fontSize: '10px', background: 'rgba(255,255,255,0.08)', color: 'white', padding: '1px 5px', borderRadius: '4px' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: isMobile ? '8px 10px' : '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 'bold', fontSize: isMobile ? '12px' : '14px' }}>${product.price}</span>
                      {!isMobile && discount > 0 && (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>${actual}</span>
                      )}
                      {!isMobile && discount > 0 && (
                        <span style={{ background: 'rgba(245, 166, 35, 0.2)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{discount}% OFF</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: isMobile ? '8px 10px' : '15px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '6px', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <button onClick={() => setEditingProduct({
                        ...product, 
                        isFeatured: Boolean(product.isFeatured),
                        actualPrice: product.actualPrice || 45, 
                        category: product.category || 'Football Jerseys',
                        sizes: (product.sizes && product.sizes.length > 0) ? product.sizes : AVAILABLE_SIZES,
                        sizePrices: product.sizePrices || {},
                        description: product.description || 'Premium custom sublimation sportswear made with high-performance breathable fabrics from Pakistan.',
                        images: (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : ['']),
                      })} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: isMobile ? '4px 8px' : '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: isMobile ? '11px' : '13px', whiteSpace: 'nowrap' }}>Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)} style={{ background: 'rgba(255, 71, 87, 0.2)', color: '#ff4757', border: 'none', padding: isMobile ? '4px 8px' : '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: isMobile ? '11px' : '13px', whiteSpace: 'nowrap' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              )})}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No products available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ width: '100vw', height: '100vh', borderRadius: '0', padding: isMobile ? '20px 15px' : '40px', boxSizing: 'border-box', overflowY: 'auto' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isMobile ? '16px' : '30px' }}>
                <button type="button" onClick={() => setEditingProduct(null)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <ArrowLeft size={isMobile ? 22 : 28} />
                </button>
                <h2 style={{ fontSize: isMobile ? '18px' : '28px', margin: 0 }}>Edit Product</h2>
              </div>
              <form onSubmit={handleSaveEditProduct} style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: isMobile ? '13px' : '14px' }}>Title</label>
                  <input type="text" required value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} style={{ width: '100%', padding: isMobile ? '8px 10px' : '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: isMobile ? '13px' : '14px' }} />
                </div>

                {/* Category Dropdown */}
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: isMobile ? '13px' : '14px' }}>Category</label>
                  <select
                    value={editingProduct.category || 'Football Jerseys'}
                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                    style={{ width: '100%', padding: isMobile ? '8px 10px' : '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#111', color: 'white', fontSize: isMobile ? '13px' : '14px', outline: 'none', cursor: 'pointer' }}
                  >
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat} style={{ background: '#111', color: '#fff' }}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Homepage Featured Toggle */}
                <div 
                  onClick={() => setEditingProduct(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isMobile ? '10px 12px' : '12px 16px',
                    borderRadius: '8px',
                    border: editingProduct.isFeatured ? '1px solid rgba(245, 166, 35, 0.5)' : '1px solid rgba(255, 255, 255, 0.15)',
                    background: editingProduct.isFeatured ? 'rgba(245, 166, 35, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Star size={18} fill={editingProduct.isFeatured ? 'var(--primary)' : 'transparent'} color={editingProduct.isFeatured ? 'var(--primary)' : 'white'} />
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: isMobile ? '13px' : '14px', color: editingProduct.isFeatured ? 'var(--primary)' : 'white' }}>
                        Show in Homepage "Featured Products"
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        When enabled, this product will be shown in the Featured Products section on the homepage.
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isFeatured)}
                    onChange={e => {
                      e.stopPropagation();
                      setEditingProduct(prev => ({ ...prev, isFeatured: e.target.checked }));
                    }}
                    style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                  />
                </div>

                {/* Available Sizes & Per-Size Pricing */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: isMobile ? '13px' : '14px', margin: 0 }}>
                      Available Sizes & Pricing
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Set individual price per size (optional)
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '10px' }}>
                    {AVAILABLE_SIZES.map(size => {
                      const isChecked = (editingProduct.sizes || AVAILABLE_SIZES).includes(size);
                      const sPrice = editingProduct.sizePrices?.[size]?.price ?? '';
                      const sActual = editingProduct.sizePrices?.[size]?.actualPrice ?? '';
                      return (
                        <div 
                          key={size}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: isChecked ? '1px solid rgba(245,166,35,0.4)' : '1px solid rgba(255,255,255,0.1)',
                            background: isChecked ? 'rgba(245,166,35,0.06)' : 'rgba(255,255,255,0.02)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isChecked ? '8px' : '0' }}>
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', color: isChecked ? 'var(--primary)' : 'white' }}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={e => {
                                  const current = editingProduct.sizes || AVAILABLE_SIZES;
                                  const updated = e.target.checked
                                    ? [...current, size]
                                    : current.filter(s => s !== size);
                                  setEditingProduct({ ...editingProduct, sizes: updated });
                                }}
                                style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '15px', height: '15px' }}
                              />
                              <span>{size}</span>
                            </label>
                            <span style={{ fontSize: '11px', color: isChecked ? '#31cd6a' : 'var(--text-muted)' }}>
                              {isChecked ? 'Available' : 'Disabled'}
                            </span>
                          </div>
                          {isChecked && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Price ($)</label>
                                <input
                                  type="number"
                                  placeholder={editingProduct.price ? `Default: $${editingProduct.price}` : 'Price'}
                                  value={sPrice}
                                  onChange={e => handleSizePriceChange(size, 'price', e.target.value, true)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '12px' }}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Actual ($)</label>
                                <input
                                  type="number"
                                  placeholder={editingProduct.actualPrice ? `Default: $${editingProduct.actualPrice}` : 'Actual'}
                                  value={sActual}
                                  onChange={e => handleSizePriceChange(size, 'actualPrice', e.target.value, true)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '12px' }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Price Row: Left = Actual Price, Right = Discount Price */}
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '10px' : '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: isMobile ? '13px' : '14px' }}>Actual Price ($)</label>
                    <input type="number" required value={editingProduct.actualPrice} onChange={e => setEditingProduct({...editingProduct, actualPrice: e.target.value ? parseInt(e.target.value) : ''})} style={{ width: '100%', padding: isMobile ? '8px 10px' : '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: isMobile ? '13px' : '14px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: isMobile ? '13px' : '14px' }}>Discount Price ($)</label>
                    <input type="number" required value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value ? parseInt(e.target.value) : ''})} style={{ width: '100%', padding: isMobile ? '8px 10px' : '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: isMobile ? '13px' : '14px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: isMobile ? '13px' : '14px' }}>Images (First is Main Image)</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {editingProduct.images.map((img, idx) => (
                      img ? <img key={idx} src={img} alt="preview" style={{ width: isMobile ? '60px' : '100px', height: isMobile ? '60px' : '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.2)' }} onError={(e) => e.target.style.display = 'none'} /> : null
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {editingProduct.images.map((img, index) => (
                      <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button type="button" onClick={() => triggerFileInput(index, true)} style={{ background: 'var(--primary)', color: 'black', border: 'none', padding: isMobile ? '8px 10px' : '12px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: isMobile ? '12px' : '14px' }}>
                          <Upload size={isMobile ? 14 : 18} /> {isMobile ? '' : 'Import'}
                        </button>
                        <input 
                          type="file" 
                          accept="image/*" 
                          ref={el => fileInputRefs.current[`edit-${index}`] = el}
                          onChange={e => handleFileUpload(e, index, true)} 
                          style={{ display: 'none' }} 
                        />
                        <input 
                          type="text" 
                          placeholder={`Image URL ${index + 1}`} 
                          value={img} 
                          required={index === 0}
                          onChange={e => handleImageChange(index, e.target.value, true)} 
                          style={{ flex: 1, padding: isMobile ? '8px 10px' : '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: isMobile ? '12px' : '14px' }} 
                        />
                        {editingProduct.images.length > 1 && (
                          <button type="button" onClick={() => removeImageField(index, true)} style={{ background: 'rgba(255, 71, 87, 0.2)', color: '#ff4757', border: 'none', padding: isMobile ? '8px' : '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Trash2 size={isMobile ? 16 : 20} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => addImageField(true)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px dashed rgba(255,255,255,0.3)', padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '5px' }}>
                      <Plus size={20} /> Add Another Image
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: isMobile ? '13px' : '14px' }}>Description</label>
                  <textarea required rows={isMobile ? "4" : "6"} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} style={{ width: '100%', padding: isMobile ? '8px 10px' : '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', resize: 'vertical', fontSize: isMobile ? '13px' : '14px', boxSizing: 'border-box' }} />
                </div>
                
                <div style={{ display: 'flex', gap: isMobile ? '10px' : '15px', marginTop: isMobile ? '10px' : '20px' }}>
                  <button type="submit" disabled={isSaving} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: isMobile ? '10px' : '15px', fontSize: isMobile ? '14px' : '16px', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Saving...' : 'Save'}</button>
                  <button type="button" disabled={isSaving} onClick={() => setEditingProduct(null)} className="btn-outline" style={{ flex: 1, justifyContent: 'center', padding: isMobile ? '10px' : '15px', fontSize: isMobile ? '14px' : '16px', opacity: isSaving ? 0.7 : 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {addingProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ width: '100vw', height: '100vh', borderRadius: '0', padding: isMobile ? '20px 15px' : '40px', boxSizing: 'border-box', overflowY: 'auto' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: isMobile ? '16px' : '30px' }}>
                <button type="button" onClick={() => setAddingProduct(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <ArrowLeft size={isMobile ? 22 : 28} />
                </button>
                <h2 style={{ fontSize: isMobile ? '20px' : '28px', margin: 0 }}>Add New Product</h2>
              </div>
              <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Title</label>
                  <input type="text" placeholder="e.g. Sublimation Soccer Jersey Kit" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>

                {/* Category Dropdown */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Category</label>
                  <select
                    value={newProduct.category || 'Football Jerseys'}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#111', color: 'white', outline: 'none', cursor: 'pointer' }}
                  >
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat} style={{ background: '#111', color: '#fff' }}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Homepage Featured Toggle */}
                <div 
                  onClick={() => setNewProduct(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isMobile ? '10px 12px' : '12px 16px',
                    borderRadius: '8px',
                    border: newProduct.isFeatured ? '1px solid rgba(245, 166, 35, 0.5)' : '1px solid rgba(255, 255, 255, 0.15)',
                    background: newProduct.isFeatured ? 'rgba(245, 166, 35, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Star size={18} fill={newProduct.isFeatured ? 'var(--primary)' : 'transparent'} color={newProduct.isFeatured ? 'var(--primary)' : 'white'} />
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: isMobile ? '13px' : '14px', color: newProduct.isFeatured ? 'var(--primary)' : 'white' }}>
                        Show in Homepage "Featured Products"
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        When enabled, this product will be shown in the Featured Products section on the homepage.
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(newProduct.isFeatured)}
                    onChange={e => {
                      e.stopPropagation();
                      setNewProduct(prev => ({ ...prev, isFeatured: e.target.checked }));
                    }}
                    style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                  />
                </div>

                {/* Available Sizes & Per-Size Pricing */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: isMobile ? '13px' : '14px', margin: 0 }}>
                      Available Sizes & Pricing
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Set individual price per size (optional)
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '10px' }}>
                    {AVAILABLE_SIZES.map(size => {
                      const isChecked = (newProduct.sizes || AVAILABLE_SIZES).includes(size);
                      const sPrice = newProduct.sizePrices?.[size]?.price ?? '';
                      const sActual = newProduct.sizePrices?.[size]?.actualPrice ?? '';
                      return (
                        <div 
                          key={size}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: isChecked ? '1px solid rgba(245,166,35,0.4)' : '1px solid rgba(255,255,255,0.1)',
                            background: isChecked ? 'rgba(245,166,35,0.06)' : 'rgba(255,255,255,0.02)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isChecked ? '8px' : '0' }}>
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', color: isChecked ? 'var(--primary)' : 'white' }}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={e => {
                                  const current = newProduct.sizes || AVAILABLE_SIZES;
                                  const updated = e.target.checked
                                    ? [...current, size]
                                    : current.filter(s => s !== size);
                                  setNewProduct({ ...newProduct, sizes: updated });
                                }}
                                style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '15px', height: '15px' }}
                              />
                              <span>{size}</span>
                            </label>
                            <span style={{ fontSize: '11px', color: isChecked ? '#31cd6a' : 'var(--text-muted)' }}>
                              {isChecked ? 'Available' : 'Disabled'}
                            </span>
                          </div>
                          {isChecked && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Price ($)</label>
                                <input
                                  type="number"
                                  placeholder={newProduct.price ? `Default: $${newProduct.price}` : 'Price'}
                                  value={sPrice}
                                  onChange={e => handleSizePriceChange(size, 'price', e.target.value, false)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '12px' }}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Actual ($)</label>
                                <input
                                  type="number"
                                  placeholder={newProduct.actualPrice ? `Default: $${newProduct.actualPrice}` : 'Actual'}
                                  value={sActual}
                                  onChange={e => handleSizePriceChange(size, 'actualPrice', e.target.value, false)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '12px' }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Price Row: Left = Actual Price, Right = Discount Price */}
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Actual Price ($)</label>
                    <input type="number" placeholder="Original price e.g. 45" required value={newProduct.actualPrice} onChange={e => setNewProduct({...newProduct, actualPrice: e.target.value ? parseInt(e.target.value) : ''})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Discount Price ($)</label>
                    <input type="number" placeholder="Selling price e.g. 30" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value ? parseInt(e.target.value) : ''})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Images (First is Main Image)</label>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
                    {newProduct.images.map((img, idx) => (
                      img ? <img key={idx} src={img} alt="preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.2)' }} onError={(e) => e.target.style.display = 'none'} /> : null
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {newProduct.images.map((img, index) => (
                      <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button type="button" onClick={() => triggerFileInput(index, false)} style={{ background: 'var(--primary)', color: 'black', border: 'none', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                          <Upload size={18} /> Import
                        </button>
                        <input 
                          type="file" 
                          accept="image/*" 
                          ref={el => fileInputRefs.current[`add-${index}`] = el}
                          onChange={e => handleFileUpload(e, index, false)} 
                          style={{ display: 'none' }} 
                        />
                        <input 
                          type="text" 
                          placeholder={`Or enter Image URL ${index + 1}`} 
                          value={img} 
                          required={index === 0}
                          onChange={e => handleImageChange(index, e.target.value, false)} 
                          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} 
                        />
                        {newProduct.images.length > 1 && (
                          <button type="button" onClick={() => removeImageField(index, false)} style={{ background: 'rgba(255, 71, 87, 0.2)', color: '#ff4757', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => addImageField(false)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px dashed rgba(255,255,255,0.3)', padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '5px' }}>
                      <Plus size={20} /> Add Another Image
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description</label>
                  <textarea 
                    required 
                    rows="6" 
                    placeholder="Describe sportswear fabric, sublimation design, sizes, and customization details..." 
                    value={newProduct.description} 
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})} 
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', resize: 'vertical' }} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                  <button type="submit" disabled={isSaving} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '15px', fontSize: '16px', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Adding...' : 'Add Product'}</button>
                  <button type="button" disabled={isSaving} onClick={() => setAddingProduct(false)} className="btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '15px', fontSize: '16px', opacity: isSaving ? 0.7 : 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;