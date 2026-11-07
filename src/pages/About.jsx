import React from 'react';
import { Globe, Award, Users, CheckCircle, Truck } from 'lucide-react';

const About = () => {
  return (
    <div className="glass-panel about-page-wrapper">
      <div className="about-main-container">
        
        {/* Header */}
        <div className="about-header">
          <p className="about-badge">Our Story</p>
          <h1 className="about-title">
            About <span style={{ color: 'var(--primary)' }}>SublivoExport</span>
          </h1>
          <p className="about-desc">
            Pakistan's premier sportswear manufacturer and exporter, proudly based in Sialkot — the world's sports goods capital.
          </p>
        </div>

        {/* Company Photo Feature Banner */}
        <div style={{
          margin: '24px 0 32px 0',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(49, 205, 106, 0.3)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          position: 'relative'
        }}>
          <img 
            src="/company-photo.jpeg" 
            onError={(e) => { e.currentTarget.src = "/company photo.jpeg"; }}
            alt="SublivoExport Manufacturing Facility & Headquarters" 
            style={{
              width: '100%',
              maxHeight: '440px',
              objectFit: 'cover',
              display: 'block'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
            padding: '24px 24px 16px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '12px'
          }}>
            <div>
              <span style={{ 
                background: 'var(--primary)', 
                color: '#000', 
                fontSize: '11px', 
                fontWeight: '800', 
                padding: '3px 10px', 
                borderRadius: '6px', 
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '6px'
              }}>
                Manufacturing Facility
              </span>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                SublivoExport Headquarters & Production Unit
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
                Sialkot, Punjab, Pakistan — Serving clients across 15+ countries worldwide
              </p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              color: '#fff',
              fontWeight: '600'
            }}>
              ⭐ 100% In-House Production
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="about-stats-grid">
          {[
            { num: '8+', label: 'Years of Excellence' },
            { num: '500+', label: 'Global Clients' },
            { num: '15+', label: 'Countries Served' },
            { num: '10M+', label: 'Units Exported' },
          ].map((s, i) => (
            <div key={i} className="glass about-stat-card">
              <div className="about-stat-num">{s.num}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main Story */}
        <div className="about-text-block">
          <p>Welcome to <strong style={{ color: 'white' }}>SublivoExport</strong> — a professionally run sportswear manufacturing and export company rooted in the heart of Sialkot, Pakistan. We are not just an intermediary or trading house; we are the actual manufacturer. Our manufacturing facility, our machines, our workers — all under one roof.</p>
          
          <p>Sialkot has a global reputation for producing some of the world's finest sports goods, and SublivoExport is proud to be at the forefront of that legacy. We combine traditional Pakistani craftsmanship with modern sublimation printing technology to deliver sportswear that meets international export standards.</p>
          
          <p>Our product range includes <strong style={{ color: 'white' }}>football jerseys, rugby shirts, polo shirts, T-shirts, hoodies, shorts, sports shoes, and accessories</strong>. Every product can be fully customized with your brand logo, player names, numbers, and color combinations using our state-of-the-art sublimation and embroidery machines.</p>
          
          <p>We serve clients across <strong style={{ color: 'white' }}>USA, UK, Canada, Germany, France, Netherlands, Australia, and the Middle East</strong>. From football clubs and rugby academies to retail brands and corporate gifting programs, SublivoExport handles bulk orders of any scale with precision and professionalism.</p>
          
          <p>Our commitment to quality is non-negotiable. Every order goes through a rigorous quality control process before packaging and international shipping. We work with trusted logistics partners including DHL, FedEx, and UPS to ensure timely delivery to your doorstep, anywhere in the world.</p>
        </div>

        {/* What We Offer */}
        <h2 className="about-section-title">
          What Makes Us <span style={{ color: 'var(--primary)' }}>Different</span>
        </h2>
        <div className="about-features-grid">
          {[
            { icon: <Award className="about-icon-svg" size={22} color="var(--primary)" />, title: 'Direct Manufacturing', desc: 'No middlemen. Direct from our Sialkot facility to your country. Better quality, better pricing.' },
            { icon: <Award className="about-icon-svg" size={22} color="var(--primary)" />, title: 'Sublimation Technology', desc: 'UV & wash-resistant sublimation prints. Colors stay vibrant for years.' },
            { icon: <Globe className="about-icon-svg" size={22} color="var(--primary)" />, title: 'Global Reach', desc: 'Exporting to 15+ countries. Trusted by international clubs, brands, and distributors.' },
            { icon: <CheckCircle className="about-icon-svg" size={22} color="var(--primary)" />, title: 'Quality Guaranteed', desc: 'Strict QC at every stage. We only ship products we are proud of.' },
            { icon: <Users className="about-icon-svg" size={22} color="var(--primary)" />, title: 'Full Customization', desc: 'Your design, colors, logo, names, numbers. We manufacture exactly what you envision.' },
            { icon: <Truck className="about-icon-svg" size={22} color="var(--primary)" />, title: 'Fast International Shipping', desc: 'Reliable worldwide delivery via DHL, FedEx, UPS with full tracking.' },
          ].map((f, i) => (
            <div key={i} className="glass about-feature-card">
              <div className="about-feature-icon-box">
                {f.icon}
              </div>
              <div className="about-feature-content">
                <h4 className="about-feature-title">{f.title}</h4>
                <p className="about-feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Live Factory Video Section */}
        <div style={{ margin: '40px 0 10px 0' }}>
          <h2 className="about-section-title" style={{ textAlign: 'left', marginBottom: '8px' }}>
            Live Factory <span style={{ color: 'var(--primary)' }}>Footage</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '20px', lineHeight: 1.6 }}>
            Experience our manufacturing craftsmanship firsthand. We operate our own dedicated stitching, sublimation, and quality control lines in Sialkot.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <video 
                src="/Production.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline 
                controls 
                style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '14px 16px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'white' }}>Stitching & Production Floor</h4>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Precision industrial sewing lines assembling custom uniforms.</p>
              </div>
            </div>

            <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <video 
                src="/Video2.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline 
                controls 
                style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '14px 16px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'white' }}>Finishing & Quality Inspection</h4>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Meticulous finishing, steam pressing, and export packaging.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="about-cta-box">
          <h3 className="about-cta-title">Ready to Work With Us?</h3>
          <p className="about-cta-desc">Contact us today to discuss your bulk order requirements and get a free quote.</p>
          <div className="about-cta-actions">
            <a 
              href="https://wa.me/923204615100?text=Hello SublivoExport, I would like to inquire about your sportswear products." 
              target="_blank" rel="noopener noreferrer"
              className="btn-primary about-cta-btn"
            >
              💬 WhatsApp Us
            </a>
            <a href="mailto:sublivoxexport@gmail.com" className="btn-outline about-cta-btn">
              ✉️ Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
