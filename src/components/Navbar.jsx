import React from 'react';
import { ShoppingCart, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ setIsCartOpen, totalCartItems }) => {
  const location = useLocation();

  const handleScrollTo = (id) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
    } else {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className="navbar glass" style={{ borderRadius: '16px', marginTop: '12px' }}>
      {/* Logo + Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/logo.png" alt="SublivoExport Logo" style={{ height: '44px', objectFit: 'contain' }} />
        <div>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '800', 
            lineHeight: 1, 
            letterSpacing: '1px',
            background: 'linear-gradient(135deg, #f5a623, #1a9fff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>SublivoExport</h2>
          <p style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Sportswear & Apparel Exporter</p>
        </div>
      </div>

      {/* Nav Links */}
      <ul className="nav-links">
        <li><Link to="/" className={location.pathname === '/' ? 'text-primary active' : ''}>Home</Link></li>
        <li><Link to="/shop" className={location.pathname === '/shop' ? 'text-primary active' : ''}>Products</Link></li>
        <li>
          <a href="#bulk-orders" onClick={(e) => { e.preventDefault(); handleScrollTo('bulk-orders'); }} style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'color 0.3s' }}>Bulk Orders</a>
        </li>
        <li><Link to="/about" className={location.pathname === '/about' ? 'text-primary active' : ''}>About</Link></li>
        <li><Link to="/contact" className={location.pathname === '/contact' ? 'text-primary active' : ''}>Contact</Link></li>
      </ul>

      {/* Right Actions */}
      <div className="nav-actions">
        {/* Export badge */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', color: 'var(--primary)', fontWeight: '600' }}>
          <Globe size={12} /> Global Exporter
        </div>
        
        {/* Cart */}
        <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setIsCartOpen(true)}>
          <ShoppingCart size={20} />
          {totalCartItems > 0 && (
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--primary)', color: '#000', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{totalCartItems}</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
