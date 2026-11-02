import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Send, CheckCircle, 
  MessageCircle, Globe, ShieldCheck, Package, ArrowRight 
} from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    country: '',
    product: '',
    quantity: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const msg = `*New Contact Inquiry - SublivoExport*\n\n` +
      `👤 *Name:* ${form.name}\n` +
      `📧 *Email:* ${form.email || 'N/A'}\n` +
      `📱 *WhatsApp/Phone:* ${form.whatsapp || 'N/A'}\n` +
      `🌍 *Country:* ${form.country}\n` +
      `📦 *Product:* ${form.product || 'General Inquiry'}\n` +
      `🔢 *Estimated Quantity:* ${form.quantity || 'N/A'}\n` +
      `📝 *Message:* ${form.message}`;

    setTimeout(() => {
      window.open(`https://wa.me/923204615100?text=${encodeURIComponent(msg)}`, '_blank');
      setLoading(false);
      setSubmitted(true);
    }, 400);
  };

  const handleDirectWhatsApp = () => {
    window.open('https://wa.me/923204615100?text=Hi SublivoExport, I want to inquire about custom sportswear orders.', '_blank');
  };

  const handleDirectEmail = () => {
    window.location.href = 'mailto:sublivoexport@gmail.com?subject=Sportswear Export Inquiry';
  };

  return (
    <div className="glass-panel contact-page-wrapper">
      <div className="contact-main-container">
        
        {/* Header */}
        <div className="contact-header">
          <p className="contact-badge">Get In Touch</p>
          <h1 className="contact-title">
            Contact <span style={{ color: 'var(--primary)' }}>SublivoExport</span>
          </h1>
          <p className="contact-desc">
            Have a custom design, bulk sportswear order, or international shipment query? Our export specialists in Sialkot, Pakistan are ready to assist you.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="contact-cards-grid">
          {/* WhatsApp Card */}
          <div 
            onClick={handleDirectWhatsApp}
            className="glass contact-card contact-card-whatsapp"
          >
            <div className="contact-card-top">
              <div className="contact-card-icon whatsapp-icon-bg">
                <MessageCircle size={20} />
              </div>
              <span className="contact-card-tag whatsapp-tag">Fastest Reply</span>
            </div>
            <div>
              <h3 className="contact-card-title">WhatsApp Direct</h3>
              <p className="contact-card-text">+92 320 4615100</p>
            </div>
            <div className="contact-card-action whatsapp-action">
              Chat Now <ArrowRight size={13} />
            </div>
          </div>

          {/* Email Card */}
          <div 
            onClick={handleDirectEmail}
            className="glass contact-card contact-card-email"
          >
            <div className="contact-card-top">
              <div className="contact-card-icon email-icon-bg">
                <Mail size={20} />
              </div>
              <span className="contact-card-tag email-tag">Official Email</span>
            </div>
            <div>
              <h3 className="contact-card-title">Email Inquiries</h3>
              <p className="contact-card-text">sublivoexport@gmail.com</p>
            </div>
            <div className="contact-card-action email-action">
              Send Email <ArrowRight size={13} />
            </div>
          </div>

          {/* Location Card */}
          <div className="glass contact-card contact-card-location">
            <div className="contact-card-top">
              <div className="contact-card-icon location-icon-bg">
                <MapPin size={20} />
              </div>
              <span className="contact-card-tag location-tag">Manufacturing Hub</span>
            </div>
            <div>
              <h3 className="contact-card-title">Export Facility</h3>
              <p className="contact-card-text">Sialkot 51310, Punjab, Pakistan</p>
            </div>
            <div className="contact-card-action location-action">
              Capital of Sportswear
            </div>
          </div>

          {/* Working Hours Card */}
          <div className="glass contact-card contact-card-hours">
            <div className="contact-card-top">
              <div className="contact-card-icon hours-icon-bg">
                <Clock size={20} />
              </div>
              <span className="contact-card-tag hours-tag">PKT (GMT+5)</span>
            </div>
            <div>
              <h3 className="contact-card-title">Working Hours</h3>
              <p className="contact-card-text">Mon – Sat: 9AM – 8PM</p>
            </div>
            <div className="contact-card-action hours-action">
              Replies within 2 hours
            </div>
          </div>
        </div>

        {/* Form & Info Section */}
        <div className="contact-content-grid">
          {/* Inquiry Form */}
          <div className="glass contact-form-card">
            <h2 className="contact-section-title">
              Send an <span style={{ color: 'var(--primary)' }}>Inquiry</span>
            </h2>
            <p className="contact-section-desc">
              Fill out this form and we'll share complete pricing, digital mockups & production timelines.
            </p>

            {submitted ? (
              <div className="contact-submitted-box">
                <CheckCircle size={44} color="#4ade80" style={{ marginBottom: '12px' }} />
                <h3 style={{ color: '#4ade80', fontSize: '18px', fontWeight: '700', marginBottom: '6px' }}>Inquiry Prepared!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5, maxWidth: '380px', margin: '0 auto 16px' }}>
                  Your details have been compiled and opened in WhatsApp for instant direct confirmation with our export manager.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="btn-outline"
                  style={{ fontSize: '12.5px', padding: '7px 18px' }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form-inner">
                <div className="contact-inputs-row">
                  <div>
                    <label className="contact-field-label">Your Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="e.g. John Smith" 
                      value={form.name} 
                      onChange={handleChange} 
                      required 
                      className="inquiry-input contact-input" 
                    />
                  </div>
                  <div>
                    <label className="contact-field-label">Country / Region *</label>
                    <input 
                      type="text" 
                      name="country" 
                      placeholder="e.g. United Kingdom" 
                      value={form.country} 
                      onChange={handleChange} 
                      required 
                      className="inquiry-input contact-input" 
                    />
                  </div>
                </div>

                <div className="contact-inputs-row">
                  <div>
                    <label className="contact-field-label">WhatsApp / Phone</label>
                    <input 
                      type="text" 
                      name="whatsapp" 
                      placeholder="+44 7123 456789" 
                      value={form.whatsapp} 
                      onChange={handleChange} 
                      className="inquiry-input contact-input" 
                    />
                  </div>
                  <div>
                    <label className="contact-field-label">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="john@club.com" 
                      value={form.email} 
                      onChange={handleChange} 
                      className="inquiry-input contact-input" 
                    />
                  </div>
                </div>

                <div className="contact-inputs-row">
                  <div>
                    <label className="contact-field-label">Product of Interest</label>
                    <select 
                      name="product" 
                      value={form.product} 
                      onChange={handleChange} 
                      className="inquiry-input contact-input"
                    >
                      <option value="">Select Product Category</option>
                      <option value="Football Jerseys">⚽ Football Jerseys (Sublimation & Embroidered)</option>
                      <option value="Rugby Shirts">🏉 Rugby Shirts (Heavy-Duty Performance)</option>
                      <option value="T-Shirts">👕 T-Shirts (Custom Print & Wholesale)</option>
                      <option value="Polo Shirts">🎽 Polo Shirts (Corporate & Sports)</option>
                      <option value="Hoodies & Jackets">🧥 Hoodies & Jackets (Fleece, Zip-Up & Pullover)</option>
                      <option value="Shorts & Bottoms">🩳 Shorts & Bottoms (Mesh & Dry-Fit)</option>
                      <option value="Sports Shoes">👟 Sports Shoes (Turf, Indoor & Outdoor)</option>
                      <option value="Accessories">🧤 Accessories (Gloves, Socks, Caps & Bags)</option>
                      <option value="Custom Order">Other / Full Custom Kit</option>
                    </select>
                  </div>
                  <div>
                    <label className="contact-field-label">Estimated Quantity</label>
                    <input 
                      type="text" 
                      name="quantity" 
                      placeholder="e.g. 50, 200, 1000 pcs" 
                      value={form.quantity} 
                      onChange={handleChange} 
                      className="inquiry-input contact-input" 
                    />
                  </div>
                </div>

                <div>
                  <label className="contact-field-label">Order Details & Design Notes *</label>
                  <textarea 
                    name="message" 
                    placeholder="Specify club name, colors, sublimation printing, logo placement, sample requirements, or delivery deadline..." 
                    value={form.message} 
                    onChange={handleChange} 
                    required 
                    rows={3} 
                    className="inquiry-input contact-input contact-textarea" 
                    style={{ resize: 'vertical' }} 
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary contact-submit-btn" 
                  disabled={loading}
                >
                  <Send size={15} /> {loading ? 'Preparing...' : 'Send Inquiry to Export Manager'}
                </button>
              </form>
            )}
          </div>

          {/* Why Contact Us / Export FAQ */}
          <div className="contact-info-col">
            <div className="glass contact-why-card">
              <h3 className="contact-why-header">
                <ShieldCheck size={18} color="var(--primary)" /> Why Order From SublivoExport?
              </h3>
              <div className="contact-why-list">
                <div className="contact-why-item">
                  <div className="contact-why-num">1</div>
                  <div>
                    <h4 className="contact-why-title">Direct Manufacturing Prices</h4>
                    <p className="contact-why-text">No middlemen or brokers. We produce directly in Sialkot at authentic wholesale factory rates.</p>
                  </div>
                </div>

                <div className="contact-why-item">
                  <div className="contact-why-num">2</div>
                  <div>
                    <h4 className="contact-why-title">Free Digital Mockups & Samples</h4>
                    <p className="contact-why-text">Share your team logo and colors; our design team will create high-res 3D digital mockups before bulk production.</p>
                  </div>
                </div>

                <div className="contact-why-item">
                  <div className="contact-why-num">3</div>
                  <div>
                    <h4 className="contact-why-title">Tracked Worldwide Express Delivery</h4>
                    <p className="contact-why-text">Direct door-to-door courier shipping to USA, UK, Canada, Australia & Europe via DHL, FedEx, and UPS.</p>
                  </div>
                </div>

                <div className="contact-why-item">
                  <div className="contact-why-num">4</div>
                  <div>
                    <h4 className="contact-why-title">Flexible Order Quantities</h4>
                    <p className="contact-why-text">We cater to small club orders starting from 20-50 pcs up to 10,000+ units for brands and distributors.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Export Hotline Card */}
            <div className="glass contact-hotline-card">
              <h4 className="contact-hotline-title">Need Urgent Assistance?</h4>
              <p className="contact-hotline-text">
                Speak directly with our export coordinator right now for immediate price estimates and order verification.
              </p>
              <button 
                onClick={handleDirectWhatsApp}
                className="sublivo-whatsapp-btn contact-hotline-btn"
              >
                <MessageCircle size={15} /> Open WhatsApp Chat
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
