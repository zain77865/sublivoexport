import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ShoppingBag } from 'lucide-react';

const Checkout = ({ products = [], cartItems = [], setCartItems }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize checkout items from:
  // 1. location.state?.items (from CartSidebar)
  // 2. Direct buy of single product (location.state with size/quantity or URL id)
  // 3. Fallback to cartItems
  const [items, setItems] = useState(() => {
    if (location.state?.items && Array.isArray(location.state.items) && location.state.items.length > 0) {
      return location.state.items;
    }
    if (id) {
      const p = products.find(prod => (prod._id || prod.id) === id);
      if (p) {
        const sz = location.state?.size || (p.sizes && p.sizes[0]) || '';
        const pr = location.state?.price || (sz && p.sizePrices?.[sz]?.price) || p.price;
        const q = location.state?.quantity || 1;
        const img = p.images?.[0] || p.image || '';
        return [{
          id: p._id || p.id,
          title: p.title,
          price: pr,
          image: img,
          size: sz,
          quantity: q
        }];
      }
    }
    if (cartItems && cartItems.length > 0) {
      return cartItems;
    }
    return [];
  });

  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', city: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset loading whenever page mounts, is focused, or restored via back button (bfcache)
  useEffect(() => {
    setLoading(false);

    const handleResetLoading = () => {
      setLoading(false);
    };

    window.addEventListener('pageshow', handleResetLoading);
    window.addEventListener('focus', handleResetLoading);

    return () => {
      window.removeEventListener('pageshow', handleResetLoading);
      window.removeEventListener('focus', handleResetLoading);
    };
  }, []);

  if (!items || items.length === 0) {
    return (
      <div className="glass-panel" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', textAlign: 'center', padding: '20px', boxSizing: 'border-box' }}>
        <ShoppingBag size={54} color="var(--primary)" style={{ opacity: 0.8 }} />
        <h2 style={{ color: 'white', margin: 0 }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', margin: 0, maxWidth: '300px' }}>Please add products to your cart before proceeding to checkout.</p>
        <button className="btn-primary" onClick={() => navigate('/shop')}>Explore Products</button>
      </div>
    );
  }

  const handleUpdateItemQuantity = (index, newQty) => {
    if (newQty < 1) return;
    setItems(prev => prev.map((item, i) => i === index ? { ...item, quantity: newQty } : item));
  };

  const total = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity), 0);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.phone.trim() || form.phone.trim().length < 7) errs.phone = 'Valid phone number is required';
    if (!form.country.trim()) errs.country = 'Country is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.address.trim()) errs.address = 'Address is required';
    return errs;
  };

  const handleProceed = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    let createdOrderId = '';
    const startTime = Date.now();

    try {
      const firstItem = items[0];
      const summaryTitle = items.length === 1
        ? `${firstItem.title}${firstItem.size ? ` (${firstItem.size})` : ''}`
        : items.map(it => `${it.title}${it.size ? ` [${it.size}]` : ''} x${it.quantity}`).join(', ');

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customer: { name: form.name, email: form.email, phone: form.phone, country: form.country, city: form.city, address: form.address }, 
          product: { 
            id: firstItem.id, 
            title: summaryTitle, 
            price: firstItem.price, 
            image: firstItem.image, 
            size: firstItem.size || '' 
          },
          items: items.map(it => ({
            id: it.id,
            title: it.title,
            size: it.size || '',
            quantity: it.quantity,
            price: it.price,
            image: it.image
          })),
          quantity: totalQuantity, 
          totalAmount: total 
        })
      });
      if (res.ok) {
        const data = await res.json();
        createdOrderId = data.orderId || '';
      }
    } catch (err) { 
      console.error(err); 
    }

    // Clear cart if user checked out
    if (setCartItems) {
      setCartItems([]);
      localStorage.removeItem('cartItems');
    }

    // Keep "Placing..." visible smoothly for ~700ms so user clearly sees feedback before redirect
    const elapsed = Date.now() - startTime;
    const remainingDelay = Math.max(0, 700 - elapsed);

    setTimeout(() => {
      // Format WhatsApp message listing all products, sizes, quantities, and prices
      const itemsListText = items.map((it, i) => {
        return `${i + 1}. *${it.title}*\n` +
               (it.size ? `   📏 *Size:* ${it.size}\n` : '') +
               `   🔢 *Quantity:* ${it.quantity}\n` +
               `   💵 *Price:* $${it.price * it.quantity} ($${it.price}/each)`;
      }).join('\n\n');

      const waMsg = 
        `🛍️ *NEW ORDER - SUBLIVOEXPORT*\n` +
        (createdOrderId ? `📋 *Order ID:* ${createdOrderId}\n` : '') +
        `--------------------------\n` +
        `👤 *Customer Name:* ${form.name}\n` +
        `📧 *Email:* ${form.email}\n` +
        `📱 *Phone:* ${form.phone}\n` +
        `🌍 *Country:* ${form.country}\n` +
        `🏙️ *City:* ${form.city}\n` +
        `📍 *Address:* ${form.address}\n` +
        `--------------------------\n` +
        `📦 *ORDERED ITEMS (${items.length}):*\n\n` +
        itemsListText + '\n' +
        `--------------------------\n` +
        `🔢 *Total Items:* ${totalQuantity}\n` +
        `💰 *Total Amount:* $${total}\n` +
        `--------------------------\n` +
        `Hello SublivoExport, I have submitted my order details on your website. Please confirm my order. Thank you!`;

      const waUrl = `https://wa.me/923204615100?text=${encodeURIComponent(waMsg)}`;
      
      // Reset loading so if user presses browser back, button is instantly ready
      setLoading(false);
      window.location.href = waUrl;
    }, remainingDelay);
  };

  return (
    <div className="glass-panel checkout-page-container" style={{ width: '100%', minHeight: '100vh', borderRadius: '0', padding: '0', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div className="checkout-header" style={{ padding: '25px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.03)' }}>
        <button className="checkout-back-btn" onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
          <ChevronLeft className="checkout-back-icon" size={20} />
        </button>
        <ShoppingBag className="checkout-header-bag-icon" size={22} color="var(--primary)" />
        <h1 className="checkout-header-title" style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>Checkout</h1>
      </div>

      <div className="checkout-body" style={{ flex: 1, display: 'flex', flexWrap: 'wrap', overflowY: 'auto' }}>
        <div className="checkout-left">
          <h2 className="checkout-section-title" style={{ margin: '0 0 30px 0', fontSize: '20px' }}>Customer Information</h2>
          <div className="checkout-form-fields" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {[
              { label: 'Full Name', key: 'name', type: 'text', ph: 'Enter your full name' },
              { label: 'Email Address', key: 'email', type: 'email', ph: 'you@example.com' },
              { label: 'Phone Number', key: 'phone', type: 'tel', ph: '+1 234 567 8900' },
              { label: 'Country', key: 'country', type: 'text', ph: 'Enter your country' },
              { label: 'City', key: 'city', type: 'text', ph: 'Enter your city' }
            ].map(f => (
              <div key={f.key} className="checkout-form-group">
                <label className="checkout-form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>{f.label}</label>
                <input 
                  type={f.type} 
                  placeholder={f.ph} 
                  value={form[f.key]} 
                  onChange={e => { setForm(v => ({ ...v, [f.key]: e.target.value })); setErrors(er => ({ ...er, [f.key]: '' })); }} 
                  className="checkout-form-input"
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', border: errors[f.key] ? '1px solid #ff4757' : '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none', fontSize: '15px', boxSizing: 'border-box' }} 
                />
                {errors[f.key] && <p className="checkout-error-text" style={{ color: '#ff4757', fontSize: '12px', margin: '5px 0 0' }}>{errors[f.key]}</p>}
              </div>
            ))}
            <div className="checkout-form-group">
              <label className="checkout-form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Complete Address</label>
              <textarea rows={3} placeholder="Address" value={form.address} onChange={e => { setForm(v=>({...v,address:e.target.value})); setErrors(er=>({...er,address:''})); }} className="checkout-form-textarea" style={{ width:'100%',padding:'13px 16px',borderRadius:'10px',border:errors.address?'1px solid #ff4757':'1px solid rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.05)',color:'white',outline:'none',fontSize:'15px',resize:'vertical',boxSizing:'border-box' }} />
              {errors.address && <p className="checkout-error-text" style={{ color:'#ff4757',fontSize:'12px',margin:'5px 0 0' }}>{errors.address}</p>}
            </div>
          </div>
        </div>

        <div className="checkout-right">
          <h2 className="checkout-section-title" style={{ margin: '0 0 20px 0', fontSize: '20px' }}>
            Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {items.map((item, idx) => (
              <div key={idx} className="glass checkout-product-card" style={{ borderRadius:'12px',overflow:'hidden',display:'flex',gap:'14px',padding:'12px',alignItems:'center' }}>
                {item.image && (
                  <img src={item.image} alt={item.title} className="checkout-product-img" style={{ width:'64px',height:'64px',borderRadius:'8px',objectFit:'cover',flexShrink:0 }} />
                )}
                <div className="checkout-product-details" style={{ flex: 1, minWidth: 0, padding: 0 }}>
                  <h3 className="checkout-product-title" style={{ margin:'0 0 4px',fontSize:'14px',fontWeight:'700',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>
                    {item.title}
                  </h3>
                  {item.size && (
                    <div className="checkout-size-wrapper" style={{ marginBottom: '6px' }}>
                      <span className="checkout-size-badge" style={{ fontSize: '10px', color: 'var(--primary)', background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)', padding: '2px 7px', borderRadius: '4px', fontWeight: '600' }}>
                        Size: {item.size}
                      </span>
                    </div>
                  )}
                  <p className="checkout-product-price" style={{ margin: 0, color: 'var(--primary)', fontSize: '15px', fontWeight: '800' }}>
                    ${item.price * item.quantity} {item.quantity > 1 && <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>(${item.price} each)</span>}
                  </p>
                </div>
                <div className="checkout-qty-wrapper" style={{ display:'flex',alignItems:'center',gap:'6px',flexShrink:0 }}>
                  <div className="glass checkout-qty-box" style={{ display:'flex',alignItems:'center',borderRadius:'20px',overflow:'hidden' }}>
                    <button className="checkout-qty-btn" onClick={() => handleUpdateItemQuantity(idx, item.quantity - 1)} style={{ background:'none',border:'none',color:'white',fontSize:'16px',cursor:'pointer',padding:'3px 9px' }}>-</button>
                    <span className="checkout-qty-val" style={{ fontWeight:'bold',padding:'0 4px',minWidth:'18px',textAlign:'center',fontSize:'12px' }}>{item.quantity}</span>
                    <button className="checkout-qty-btn" onClick={() => handleUpdateItemQuantity(idx, item.quantity + 1)} style={{ background:'none',border:'none',color:'white',fontSize:'16px',cursor:'pointer',padding:'3px 9px' }}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass checkout-summary-card" style={{ borderRadius:'12px',padding:'18px',marginBottom:'20px' }}>
            <div className="checkout-summary-row" style={{ display:'flex',justifyContent:'space-between',marginBottom:'10px',color:'var(--text-muted)' }}>
              <span>Subtotal ({totalQuantity} item{totalQuantity > 1 ? 's' : ''})</span>
              <span>${total}</span>
            </div>
            <div className="checkout-summary-total" style={{ borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:'10px',display:'flex',justifyContent:'space-between',fontWeight:'800',fontSize:'17px' }}>
              <span>Total</span>
              <span style={{ color:'var(--primary)' }}>${total}</span>
            </div>
          </div>

          <div className="checkout-actions" style={{ display:'flex',gap:'12px',justifyContent:'flex-end' }}>
            <button onClick={() => navigate(-1)} className="btn-outline checkout-action-btn" style={{ padding:'13px 24px',fontSize:'15px' }}>Cancel</button>
            <button onClick={handleProceed} disabled={loading} className="btn-primary checkout-action-btn" style={{ padding:'13px 30px',fontSize:'15px',opacity:loading?0.85:1,minWidth:'130px',justifyContent:'center',display:'inline-flex',alignItems:'center',gap:'8px' }}>
              {loading ? (
                <>
                  <span style={{ width:'13px',height:'13px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spinCheckout 0.6s linear infinite' }}></span>
                  Placing...
                </>
              ) : 'Proceed'}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spinCheckout { to { transform: rotate(360deg); } }
        .checkout-left { flex: 1 1 400px; padding: 40px; border-right: 1px solid rgba(255,255,255,0.08); }
        .checkout-right { flex: 1 1 300px; padding: 40px; }
      `}</style>
    </div>
  );
};

export default Checkout;
