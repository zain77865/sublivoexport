import React from 'react';
import { Home, ShoppingBag, MessageCircle, Mail, Globe, MapPin, Users, PhoneCall } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer = ({ currentPage }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const isNoFooterPage = location.pathname === '/track-order';

  return (
    <>
      {!isNoFooterPage && (
        <footer className="footer-section">
          {/* Main Footer */}
          <div className="sublivo-footer glass-panel" style={{ borderRadius: '0', padding: '50px 30px 20px', borderBottom: 'none' }}>
            <div className="sublivo-footer-grid">
              {/* Brand Column */}
              <div className="footer-brand-col">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <img src="/logo.png" alt="SublivoExport Logo" style={{ height: '44px', objectFit: 'contain' }} />
                  <div>
                    <h2 style={{ 
                      fontSize: '20px', fontWeight: '800', lineHeight: 1, letterSpacing: '0.5px',
                      background: 'linear-gradient(135deg, #f5a623, #1a9fff)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                    }}>SublivoExport</h2>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', letterSpacing: '1px', textTransform: 'uppercase' }}>Sportswear & Apparel Exporter</p>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: '280px', marginBottom: '20px' }}>
                  Manufacturer & exporter of custom football jerseys, rugby shirts, polo shirts, t-shirts, hoodies, shorts, sports shoes & accessories to USA, UK, Canada & Europe.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <MapPin size={14} color="var(--primary)" />
                  Pakistan
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>
                  <Globe size={14} color="var(--secondary)" />
                  Exporting to 15+ countries
                </div>
              </div>

              {/* Links Row */}
              <div className="footer-links-row">
                {/* Products Column */}
                <div className="footer-links-col">
                  <h4 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)' }}>Products</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { name: 'Football Jerseys', id: 'football' },
                      { name: 'Rugby Shirts', id: 'rugby' },
                      { name: 'T-Shirts', id: 'tshirts' },
                      { name: 'Polo Shirts', id: 'polos' },
                      { name: 'Hoodies & Jackets', id: 'hoodies' },
                      { name: 'Shorts & Bottoms', id: 'shorts' },
                      { name: 'Sports Shoes', id: 'shoes' },
                      { name: 'Accessories', id: 'accessories' }
                    ].map((item, i) => (
                      <Link key={i} to={`/shop?category=${item.id}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.3s' }}
                        onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                        onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                      >{item.name}</Link>
                    ))}
                  </div>
                </div>

                {/* Company Column */}
                <div className="footer-links-col">
                  <h4 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)' }}>Company</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px' }}>Home</Link>
                    <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px' }}>About Us</Link>
                    <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px' }}>Contact Us</Link>
                    <a href="#bulk-orders" onClick={e => { e.preventDefault(); handleScrollTo('bulk-orders'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', cursor: 'pointer' }}>Bulk Orders</a>
                    <a href="#quality" onClick={e => { e.preventDefault(); handleScrollTo('quality'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', cursor: 'pointer' }}>Quality Control</a>
                    <Link to="/privacy-policy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px' }}>Privacy Policy</Link>
                    <Link to="/terms-conditions" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px' }}>Terms & Conditions</Link>
                  </div>
                </div>

                {/* Contact Us Column (Icons only in a single row) */}
                <div className="footer-links-col">
                  <h4 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)' }}>Contact Us</h4>
                  
                  {/* Social Icons in one single row */}
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                    <a 
                      href="https://wa.me/923204615100" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="WhatsApp"
                      style={{ 
                        width: '42px', 
                        height: '42px', 
                        borderRadius: '12px', 
                        background: 'rgba(37,211,102,0.12)', 
                        border: '1px solid rgba(37,211,102,0.3)', 
                        color: '#25d366', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        textDecoration: 'none'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49"/></svg>
                    </a>

                    <a 
                      href="mailto:sublivoxexport@gmail.com" 
                      title="Email Us"
                      style={{ 
                        width: '42px', 
                        height: '42px', 
                        borderRadius: '12px', 
                        background: 'rgba(26,159,255,0.12)', 
                        border: '1px solid rgba(26,159,255,0.3)', 
                        color: '#1a9fff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        textDecoration: 'none'
                      }}
                    >
                      <Mail size={20} />
                    </a>

                    <a 
                      href="https://instagram.com/sublivoexport" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="Instagram"
                      style={{ 
                        width: '42px', 
                        height: '42px', 
                        borderRadius: '12px', 
                        background: 'rgba(225,48,108,0.12)', 
                        border: '1px solid rgba(225,48,108,0.3)', 
                        color: '#e1306c', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        textDecoration: 'none'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '40px', paddingTop: '20px' }}>
              <p>© 2026 SublivoExport. All rights reserved. | Pakistan</p>
              <div className="footer-legal">
                <Link to="/privacy-policy">Privacy Policy</Link>
                <span>|</span>
                <Link to="/terms-conditions">Terms & Conditions</Link>
                <span>|</span>
                <Link to="/return-policy">Return Policy</Link>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav glass">
        <Link to="/" className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link to="/shop" className={`bottom-nav-item ${location.pathname === '/shop' ? 'active' : ''}`}>
          <ShoppingBag size={20} />
          <span>Products</span>
        </Link>
        <Link to="/about" className={`bottom-nav-item ${location.pathname === '/about' ? 'active' : ''}`}>
          <Users size={20} />
          <span>About</span>
        </Link>
        <Link to="/contact" className={`bottom-nav-item ${location.pathname === '/contact' ? 'active' : ''}`}>
          <PhoneCall size={20} />
          <span>Contact</span>
        </Link>
      </div>
    </>
  );
};

export default Footer;
