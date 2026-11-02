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
            <a href="mailto:sublivoexport@gmail.com" className="btn-outline about-cta-btn">
              ✉️ Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
