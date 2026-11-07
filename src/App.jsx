import { API_URL } from './config';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import ReturnPolicy from './pages/ReturnPolicy';
import AddAdmin from './pages/AddAdmin';
import SubAdminLogin from './pages/SubAdminLogin';
import BulkQuote from './pages/BulkQuote';
function RouteSEOAndScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // 1. Scroll Handling
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }

    // 2. Dynamic Route SEO (Title, Description, Canonical)
    const seoMap = {
      '/': {
        title: 'SublivoExport | Custom Sportswear, Football Jerseys, Rugby & Shoes Manufacturer',
        desc: 'Premier factory manufacturer and exporter of custom Football Jerseys, Rugby Shirts, T-Shirts, Polo Shirts, Hoodies, Shorts, Sports Shoes and Accessories from Pakistan.'
      },
      '/shop': {
        title: 'Wholesale Catalog & Custom Sportswear Collection | SublivoExport',
        desc: 'Explore our export collection of custom sublimation football jerseys, rugby kits, blank t-shirts, polo shirts, fleece hoodies, athletic shorts and sports shoes with factory-direct pricing.'
      },
      '/about': {
        title: 'About Us | Custom Sportswear Manufacturer & Exporter | SublivoExport',
        desc: 'Discover SublivoExport — a direct manufacturing facility in Pakistan with state-of-the-art sublimation printing, delivering international export quality sportswear to USA, UK & Europe.'
      },
      '/contact': {
        title: 'Contact Us & Request Bulk Wholesale Quote | SublivoExport',
        desc: 'Get in touch with SublivoExport for bulk custom sportswear orders, free digital mockups, sample requests, and wholesale inquiries. Direct WhatsApp: +92 320 4615100.'
      },
      '/bulk-quote': {
        title: 'Streetwear & Sportswear Bulk Inquiry Form | SublivoExport',
        desc: 'Request custom sample OEM and bulk manufacturing quotation for streetwear, sportswear, hoodies, t-shirts, jerseys and tracksuits. Factory-direct export rates from Sialkot.'
      },
      '/privacy-policy': {
        title: 'Privacy Policy | SublivoExport',
        desc: 'SublivoExport Privacy Policy - How we protect your data and order confidentiality.'
      },
      '/terms-conditions': {
        title: 'Terms & Conditions | SublivoExport',
        desc: 'SublivoExport Terms and Conditions for wholesale export manufacturing and international shipments.'
      },
      '/return-policy': {
        title: 'Return Policy & Quality Guarantee | SublivoExport',
        desc: 'SublivoExport 100% quality guarantee and international return policy.'
      }
    };

    let matched = seoMap[pathname];
    if (!matched) {
      if (pathname.startsWith('/product/')) {
        matched = {
          title: 'Product Details | SublivoExport Sportswear Catalog',
          desc: 'High-quality export custom sportswear manufactured by SublivoExport. Full customization, sublimation printing, and worldwide courier delivery.'
        };
      } else if (pathname.startsWith('/checkout')) {
        matched = {
          title: 'Secure Checkout & Sample Order | SublivoExport',
          desc: 'Order product samples and submit customized sportswear orders with SublivoExport.'
        };
      }
    }

    if (matched) {
      document.title = matched.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', matched.desc);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', matched.title);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', matched.desc);

      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', `https://sublivoexport.com${pathname}`);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [adminToken, setAdminToken] = useState(() => {
    return sessionStorage.getItem('adminToken') || null;
  });

  const [subAdminToken, setSubAdminToken] = useState(() => {
    return sessionStorage.getItem('subAdminToken') || null;
  });
  const [subAdminPermissions, setSubAdminPermissions] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('subAdminPermissions') || '[]'); } catch { return []; }
  });

  const fetchProducts = (forceFresh = false) => {
    // If forceFresh (after admin add/edit/delete), clear cache first
    if (forceFresh) {
      localStorage.removeItem('cachedProducts');
    }
    // Only show full-screen loading if no cached products exist
    const cached = localStorage.getItem('cachedProducts');
    if (cached && !forceFresh) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setIsLoading(false); // Show site immediately with cached data
        }
      } catch {}
    } else {
      setIsLoading(true);
    }
    // Always fetch fresh data in background
    fetch(`${API_URL}/products?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
          if (!forceFresh) {
            localStorage.setItem('cachedProducts', JSON.stringify(data)); // Cache for next visit
          }
        }
      })
      .catch(err => console.error('Error fetching products:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (adminToken) {
      sessionStorage.setItem('adminToken', adminToken);
    } else {
      sessionStorage.removeItem('adminToken');
    }
  }, [adminToken]);

  useEffect(() => {
    if (subAdminToken) {
      sessionStorage.setItem('subAdminToken', subAdminToken);
    } else {
      sessionStorage.removeItem('subAdminToken');
    }
    sessionStorage.setItem('subAdminPermissions', JSON.stringify(subAdminPermissions));
  }, [subAdminToken, subAdminPermissions]);

  const handleUpdateCartQuantity = (id, newQuantity, size) => {
    if (newQuantity < 1) {
      setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
      return;
    }
    setCartItems(prev => prev.map(item => (item.id === id && item.size === size) ? { ...item, quantity: newQuantity } : item));
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === product.size);
      if (existing) {
        return prev.map(item => (item.id === product.id && item.size === product.size) ? { ...item, quantity: item.quantity + product.quantity } : item);
      }
      return [...prev, product];
    });
    setIsCartOpen(true);
  };
  
  const totalCartItems = cartItems.length;
  const totalCartPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  return (
    <div className="app-container">
      <RouteSEOAndScroll />
      {/* Background shapes */}
      <div className="background-shape shape-1"></div>
      <div className="background-shape shape-2"></div>
      <div className="background-shape shape-3"></div>

      <Routes>
        <Route path="/super-admin/*" element={null} />
        <Route path="/admin/*" element={null} />
        <Route path="/product/*" element={null} />
        <Route path="/checkout" element={null} />
        <Route path="/checkout/*" element={null} />
        <Route path="/track-order/*" element={null} />
        <Route path="/helpline/*" element={null} />
        <Route path="*" element={
          <div className="container">
            <Navbar 
              setIsCartOpen={setIsCartOpen} 
              totalCartItems={totalCartItems} 
            />
          </div>
        }/>
      </Routes>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home products={products} handleAddToCart={handleAddToCart} />} />
          <Route path="/shop" element={<Shop products={products} handleAddToCart={handleAddToCart} />} />
          <Route path="/super-admin" element={<AdminLogin setAdminToken={setAdminToken} />} />
          <Route path="*" element={null} />
        </Routes>
      </div>

      <Routes>
        <Route path="/product/:id" element={<ProductDetail products={products} isLoading={isLoading} handleAddToCart={handleAddToCart} />} />
        <Route path="/checkout" element={<Checkout products={products} cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/checkout/:id" element={<Checkout products={products} cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bulk-quote" element={<BulkQuote />} />
        <Route path="/street-wear" element={<Navigate to="/bulk-quote" replace />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/super-admin/dashboard" element={
          <AdminDashboard 
            adminToken={adminToken} 
            setAdminToken={setAdminToken} 
            products={products} 
            fetchProducts={fetchProducts} 
          />
        } />
        <Route path="/super-admin/add-admin" element={<AddAdmin adminToken={adminToken} setAdminToken={setAdminToken} />} />
        <Route path="/super-admin/orders" element={<AdminOrders adminToken={adminToken} setAdminToken={setAdminToken} />} />
        {/* Sub-Admin Routes */}
        <Route path="/admin" element={<SubAdminLogin setSubAdminToken={setSubAdminToken} setSubAdminPermissions={setSubAdminPermissions} />} />
        <Route path="/admin/dashboard" element={
          <AdminDashboard
            adminToken={subAdminToken}
            setAdminToken={setSubAdminToken}
            products={products}
            fetchProducts={fetchProducts}
            isSubAdmin={true}
            permissions={subAdminPermissions}
          />
        } />
        <Route path="/admin/orders" element={
          <AdminOrders 
            adminToken={subAdminToken} 
            setAdminToken={setSubAdminToken}
            isSubAdmin={true} 
            permissions={subAdminPermissions}
          />
        } />
        {/* Sub-Admin legacy URL redirect to /admin */}
        <Route path="/sub-admin" element={<Navigate to="/admin" replace />} />
        <Route path="/sub-admin/*" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={null} />
      </Routes>

      <Routes>
        <Route path="/super-admin/*" element={null} />
        <Route path="/admin/*" element={null} />
        <Route path="/checkout" element={null} />
        <Route path="/checkout/*" element={null} />
        <Route path="*" element={<Footer />} />
      </Routes>

      <CartSidebar 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        setCartItems={setCartItems}
        handleUpdateCartQuantity={handleUpdateCartQuantity}
        totalCartPrice={totalCartPrice}
      />
      
      {isLoading && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '50px', height: '50px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <div style={{ color: 'white', fontWeight: 'bold', letterSpacing: '2px' }}>LOADING</div>
          </div>
          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default App;
