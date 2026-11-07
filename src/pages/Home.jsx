import React, { useState, useRef } from 'react';
import { 
  Globe, Truck, Award, ChevronLeft, ChevronRight, 
  ArrowRight, CheckCircle, Star, Package, MessageCircle,
  Phone, Mail, ShoppingBag, Zap, Shield, Users, Boxes
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Link, useNavigate } from 'react-router-dom';

const PRODUCT_CATEGORIES = [
  { id: 'football', icon: '⚽', name: 'Football Jerseys', desc: 'Custom sublimation & embroidered' },
  { id: 'rugby', icon: '🏉', name: 'Rugby Shirts', desc: 'Heavy-duty performance fabric' },
  { id: 'tshirts', icon: '👕', name: 'T-Shirts', desc: 'Custom print & blank wholesale' },
  { id: 'polos', icon: '🎽', name: 'Polo Shirts', desc: 'Corporate & sports branding' },
  { id: 'hoodies', icon: '🧥', name: 'Hoodies & Jackets', desc: 'Fleece, zip-up & pullover styles' },
  { id: 'shorts', icon: '🩳', name: 'Shorts & Bottoms', desc: 'Mesh, dry-fit & performance' },
  { id: 'shoes', icon: '👟', name: 'Sports Shoes', desc: 'Astro turf, indoor & outdoor' },
  { id: 'accessories', icon: '🧤', name: 'Accessories', desc: 'Gloves, socks, caps & bags' },
];

const EXPORT_COUNTRIES = ['🇺🇸 USA', '🇬🇧 UK', '🇨🇦 Canada', '🇩🇪 Germany', '🇫🇷 France', '🇳🇱 Netherlands', '🇦🇺 Australia', '🇸🇦 Saudi Arabia'];

const TESTIMONIALS = [
  { name: 'James Mitchell', country: 'United Kingdom', flag: '🇬🇧', rating: 5, text: 'Absolutely outstanding quality! SublivoExport delivered 500 custom football jerseys for our club. The sublimation printing is perfect and delivery was on time. Will order again!' },
  { name: 'Carlos Rodriguez', country: 'United States', flag: '🇺🇸', rating: 5, text: 'Best sportswear manufacturer I have worked with from Pakistan. The polo shirts and rugby uniforms are top quality. Highly recommend SublivoExport for bulk orders.' },
  { name: 'Pierre Dubois', country: 'France', flag: '🇫🇷', rating: 5, text: 'We ordered custom hoodies and T-shirts for our sports academy. SublivoExport exceeded our expectations – premium quality at factory-direct prices. Amazing experience!' },
];

const Home = ({ products, handleAddToCart, navigate }) => {
  const localNavigate = useNavigate();
  const goTo = navigate || localNavigate;
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const carouselRef = useRef(null);

  const featuredProducts = products.filter(p => p.isFeatured);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/923204615100?text=Hi SublivoExport, I am interested in placing a bulk order for sportswear.', '_blank');
  };

  const handleEmail = () => {
    window.location.href = 'mailto:sublivoxexport@gmail.com';
  };

  const handleInstagram = () => {
    window.open('https://www.instagram.com/sublivoexport', '_blank');
  };

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <header className="sublivo-hero">
        {/* Animated background */}
        <div className="sublivo-hero-bg">
          <div className="hero-orb orb-1"></div>
          <div className="hero-orb orb-2"></div>
          <div className="hero-grid-pattern"></div>
        </div>

        <div className="sublivo-hero-content">
          {/* Badge */}
          <div className="sublivo-badge">
            <span className="badge-dot"></span>
            Custom Sportswear, Apparel & Shoes Exporter
          </div>

          {/* Main Heading */}
          <h1 className="sublivo-hero-title">
            <span className="sublivo-brand-word">SublivoExport</span>
            <br />
            <span className="sublivo-hero-subtitle-text">Custom Sportswear & Apparel</span>
            <br />
            <span className="sublivo-hero-tagline" style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Manufactured in Pakistan · Exported Worldwide</span>
          </h1>

          <p className="sublivo-hero-desc">
            We manufacture and export custom football jerseys, rugby shirts, t-shirts, polo shirts, hoodies & jackets, shorts, sports shoes and accessories worldwide. Supplying clubs, brands & distributors in 
            <strong style={{ color: 'white' }}> USA, UK, Canada & Europe</strong>.
          </p>

          {/* CTA Buttons */}
          <div className="sublivo-hero-btns">
            <Link to="/shop" className="btn-primary sublivo-hero-cta" style={{ textDecoration: 'none' }}>
              <ShoppingBag size={18} /> Browse Products
            </Link>
            <button 
              className="sublivo-whatsapp-btn sublivo-hero-cta"
              onClick={handleWhatsApp}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49"/></svg>
              WhatsApp Us
            </button>
          </div>

          {/* Stats Row */}
          <div className="sublivo-stats">
            <div className="sublivo-stat">
              <span className="stat-num">500+</span>
              <span className="stat-label">Happy Clients</span>
            </div>
            <div className="sublivo-stat-divider"></div>
            <div className="sublivo-stat">
              <span className="stat-num">15+</span>
              <span className="stat-label">Countries</span>
            </div>
            <div className="sublivo-stat-divider"></div>
            <div className="sublivo-stat">
              <span className="stat-num">10M+</span>
              <span className="stat-label">Units Exported</span>
            </div>
            <div className="sublivo-stat-divider"></div>
            <div className="sublivo-stat">
              <span className="stat-num">8+</span>
              <span className="stat-label">Years Experience</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </header>

      {/* ===== EXPORT COUNTRIES TICKER ===== */}
      <div className="countries-ticker glass" style={{ overflow: 'hidden', padding: '14px 0', margin: '0' }}>
        <div className="ticker-track">
          {[...EXPORT_COUNTRIES, ...EXPORT_COUNTRIES].map((c, i) => (
            <span key={i} className="ticker-item">{c}</span>
          ))}
        </div>
      </div>

      {/* ===== WHY SUBLIVOEXPORT ===== */}
      <section id="why-choose" className="sublivo-section">
        <div className="sublivo-section-header">
          <p className="sublivo-section-eyebrow">Why Choose Us</p>
          <h2 className="sublivo-section-title">Direct Quality.<br /><span style={{ color: 'var(--primary)' }}>International Standards.</span></h2>
          <p className="sublivo-section-desc">Direct factory manufacturing means better quality, lower prices, and faster delivery for your bulk orders.</p>
        </div>

        <div className="sublivo-features-grid">
          {[
            { icon: <Award size={22} />, title: 'Direct Manufacturing', desc: 'Direct manufacturing with 200+ skilled workers and modern machinery.' },
            { icon: <Zap size={22} />, title: 'Sublimation Printing', desc: 'State-of-the-art sublimation machines for vivid, fade-resistant prints on any design.' },
            { icon: <Shield size={22} />, title: 'Quality Control', desc: 'Strict quality checks at every production stage. International export-grade standards.' },
            { icon: <Globe size={22} />, title: 'Global Shipping', desc: 'Reliable worldwide shipping to USA, UK, Canada, Europe and beyond with full tracking.' },
            { icon: <Award size={22} />, title: 'Custom Branding', desc: 'Your logo, name, number, colors — we produce exactly what you need, no minimum hassle.' },
            { icon: <Users size={22} />, title: 'Trusted by 500+', desc: 'Over 500 clubs, brands, and businesses worldwide trust SublivoExport for their sportswear.' },
          ].map((f, i) => (
            <div key={i} className="sublivo-feature-card glass">
              <div className="feature-icon-box">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRODUCT CATEGORIES ===== */}
      <section id="categories" className="sublivo-section sublivo-categories-section">
        <div className="sublivo-section-header">
          <p className="sublivo-section-eyebrow">Full Export Range</p>
          <h2 className="sublivo-section-title">Everything You Need.<br /><span style={{ color: 'var(--primary)' }}>Jerseys, Apparel, Shoes & Accessories.</span></h2>
          <p className="sublivo-section-desc">From custom sublimation jerseys to heavy-duty rugby gear, casual apparel, footwear, and sports accessories — we manufacture and export it all under one roof.</p>
        </div>

        <div className="sublivo-categories-grid">
          {PRODUCT_CATEGORIES.map((cat, i) => (
            <div 
              key={i} 
              className={`sublivo-cat-card glass ${activeCategory === i ? 'active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === i ? null : i)}
            >
              <span className="cat-emoji">{cat.icon}</span>
              <h4>{cat.name}</h4>
              <p>{cat.desc}</p>
              <Link to={`/shop?category=${cat.id}`} className="cat-order-btn" onClick={e => e.stopPropagation()}>
                Order Now <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRODUCTS FROM DB ===== */}
      {displayProducts.length > 0 && (
        <section id="product-details" className="sublivo-section sublivo-products-section">
          <div className="sublivo-section-header">
            <p className="sublivo-section-eyebrow">Handpicked Collection</p>
            <h2 className="sublivo-section-title">Featured <span style={{ color: 'var(--primary)' }}>Products</span></h2>
          </div>

          <div 
            ref={carouselRef}
            className="sublivo-products-row"
          >
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id || product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          <div className="sublivo-products-footer" style={{ textAlign: 'center' }}>
            <Link to="/shop" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', padding: '10px 22px', fontSize: '13.5px' }}>
              View All Products <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}

      {/* ===== CUSTOM ORDER SECTION ===== */}
      <section id="custom-order" className="sublivo-section">
        <div className="sublivo-custom-order glass">
          <div className="sublivo-custom-order-header" style={{ textAlign: 'center' }}>
            <p className="sublivo-section-eyebrow">Custom Orders</p>
            <h2 className="sublivo-section-title">Your Vision, Our <span style={{ color: 'var(--primary)' }}>Expertise</span></h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Send us your design, colors, logo and we'll bring it to life. Full customization available on all products.
            </p>
          </div>

          <div className="custom-steps">
            {[
              { step: '01', title: 'Share Your Design', desc: 'Send us your logo, colors, player names & numbers via WhatsApp or email.' },
              { step: '02', title: 'Get Free Quote', desc: 'We send you a detailed quote with price, timeline and sample options.' },
              { step: '03', title: 'Approve Sample', desc: 'We produce a digital mockup or physical sample for your approval.' },
              { step: '04', title: 'Production & Ship', desc: 'Full production begins. We pack & ship worldwide with tracking.' },
            ].map((s, i) => (
              <div key={i} className="custom-step glass">
                <div className="step-number">{s.step}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="sublivo-custom-order-actions" style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleWhatsApp} className="btn-primary sublivo-custom-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49"/></svg>
              Start Your Order on WhatsApp
            </button>
            <button onClick={handleEmail} className="btn-outline sublivo-custom-btn">
              <Mail size={16} /> Email Us
            </button>
          </div>
        </div>
      </section>

      {/* ===== BULK ORDER SECTION ===== */}
      <section id="bulk-orders" className="sublivo-section">
        <div className="sublivo-bulk-layout">
          <div className="sublivo-bulk-content">
            <p className="sublivo-section-eyebrow">Bulk Orders</p>
            <h2 className="sublivo-section-title" style={{ textAlign: 'left' }}>
              Scale Your Business<br /><span style={{ color: 'var(--primary)' }}>With Bulk Pricing</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '18px', fontSize: '13.5px' }}>
              We offer special pricing for bulk orders. The more you order, the better the price. Perfect for sports clubs, academies, retail brands and distributors worldwide.
            </p>
            <div className="bulk-tiers">
              {[
                { qty: '50–200 pcs', discount: 'Standard Rate', color: 'var(--text-muted)' },
                { qty: '200–500 pcs', discount: '5–10% Discount', color: 'var(--secondary)' },
                { qty: '500–1000 pcs', discount: '10–20% Discount', color: 'var(--primary)' },
                { qty: '1000+ pcs', discount: 'Best Price', color: '#ff6b6b' },
              ].map((t, i) => (
                <div key={i} className="bulk-tier glass" >
                  <div style={{ fontWeight: '700', color: 'white' }}>{t.qty}</div>
                  <div style={{ fontSize: '12px', color: t.color, fontWeight: '600' }}>{t.discount}</div>
                </div>
              ))}
            </div>
            <button onClick={() => goTo('/bulk-quote')} className="btn-primary" style={{ marginTop: '18px', padding: '10px 22px', fontSize: '13.5px' }}>
              Get Bulk Quote <Package size={15} />
            </button>
          </div>

          {/* Big Bulk Order Image with Circle Border */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: '280px',
              userSelect: 'none'
            }}
          >
            <div 
              style={{
                width: '330px',
                height: '330px',
                maxWidth: '85vw',
                maxHeight: '85vw',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid var(--primary)',
                boxShadow: '0 0 45px rgba(49, 205, 106, 0.45), 0 15px 35px rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#111'
              }}
            >
              <img 
                src="/buy-bulk.jpg" 
                onError={(e) => {
                  e.currentTarget.src = "https://thumbs.dreamstime.com/z/buy-bulk-word-many-boxes-product-volume-quantity-surrounded-cardboard-packages-wholesale-store-to-illustrate-31717243.jpg";
                }}
                alt="Buy in Bulk - Wholesale Sportswear"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUALITY & SHIPPING ===== */}
      <section id="quality" className="sublivo-section">
        <div className="sublivo-section-header">
          <p className="sublivo-section-eyebrow">Quality & Shipping</p>
          <h2 className="sublivo-section-title">From Production<br /><span style={{ color: 'var(--primary)' }}>To Your Door</span></h2>
        </div>

        <div className="quality-steps">
          {[
            { icon: '🎨', title: 'Design Approval', desc: 'Digital mockup shared before production starts.' },
            { icon: '✂️', title: 'Production', desc: 'Manufactured in our dedicated production facility with skilled workers.' },
            { icon: '🔍', title: 'Quality Control', desc: 'Every piece inspected before packing. Zero compromise.' },
            { icon: '📦', title: 'Professional Packing', desc: 'Individually packed, labeled, and export-ready.' },
            { icon: '✈️', title: 'International Shipping', desc: 'DHL, FedEx, UPS & sea freight available worldwide.' },
            { icon: '🤝', title: 'After-Sales Support', desc: 'We stay in touch until you are 100% satisfied.' },
          ].map((s, i) => (
            <div key={i} className="quality-step glass">
              <span style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}>{s.icon}</span>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FACTORY & PRODUCTION VIDEOS ===== */}
      <section id="factory-tour" className="sublivo-section">
        <div className="sublivo-section-header">
          <p className="sublivo-section-eyebrow">Real Factory Footage</p>
          <h2 className="sublivo-section-title">
            Inside Our <span style={{ color: 'var(--primary)' }}>Production Facility</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
            Watch our skilled workers and dedicated manufacturing lines in action in Sialkot, Pakistan. Real craftsmanship, authentic export quality.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginTop: '28px'
        }}>
          {/* Video 1: Stitching Floor */}
          <div className="glass" style={{
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(49, 205, 106, 0.2)',
            background: 'rgba(15, 20, 15, 0.65)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ position: 'relative', width: '100%', height: '260px', background: '#000', overflow: 'hidden' }}>
              <video 
                src="/Production.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline 
                controls 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(49, 205, 106, 0.4)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                pointerEvents: 'none'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} />
                Stitching & Assembly
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
                High-Speed Manufacturing Line
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                Skilled craftsmen operating precision sewing lines to produce durable, high-performance teamwear and uniforms.
              </p>
            </div>
          </div>

          {/* Video 2: Assembly & Quality Checking */}
          <div className="glass" style={{
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(245, 166, 35, 0.2)',
            background: 'rgba(15, 20, 15, 0.65)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ position: 'relative', width: '100%', height: '260px', background: '#000', overflow: 'hidden' }}>
              <video 
                src="/Video2.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline 
                controls 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(245, 166, 35, 0.4)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#f5a623',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                pointerEvents: 'none'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f5a623', display: 'inline-block' }} />
                Finishing & Quality Check
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
                Finishing, Inspection & Packaging
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                Every single garment is examined for seam integrity, wash-fastness, and professional labeling before international shipment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="reviews" className="sublivo-section">
        <div className="sublivo-section-header">
          <p className="sublivo-section-eyebrow">Client Reviews</p>
          <h2 className="sublivo-section-title">What Our <span style={{ color: 'var(--primary)' }}>Clients Say</span></h2>
        </div>

        <div className="sublivo-testimonials">
          {TESTIMONIALS.map((t, i) => (
            <div 
              key={i} 
              className={`sublivo-testimonial glass ${activeTestimonial === i ? 'active-testimonial' : ''}`}
              onClick={() => setActiveTestimonial(i)}
            >
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                {[...Array(t.rating)].map((_, si) => <Star key={si} size={14} fill="var(--primary)" color="var(--primary)" />)}
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '16px' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                  {t.flag}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{t.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.country}</div>
                </div>
                <CheckCircle size={16} color="#4ade80" style={{ marginLeft: 'auto' }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
