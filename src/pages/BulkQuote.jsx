import React, { useState } from 'react';
import { 
  Package, Upload, CheckCircle, ShieldCheck, Globe, 
  MessageCircle, Mail, ArrowLeft, Sparkles, FileText, X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { API_URL } from '../config';

const PRODUCT_LIST = [
  { id: 'tshirt', name: 'T-Shirt', icon: '👕' },
  { id: 'hoodie', name: 'Hoodie', icon: '🧥' },
  { id: 'zip-hoodie', name: 'Zip Hoodie', icon: '🥼' },
  { id: 'joggers', name: 'Joggers / Pants', icon: '👖' },
  { id: 'shorts', name: 'Shorts', icon: '🩳' },
  { id: 'cargo-pants', name: 'Cargo Pants', icon: '🪖' },
  { id: 'jacket', name: 'Jacket & Windbreaker', icon: '🧥' },
  { id: 'varsity-jacket', name: 'Varsity Jacket', icon: '🎖️' },
  { id: 'tracksuit', name: 'Tracksuit Kit', icon: '🏃' },
  { id: 'football-jerseys', name: 'Football Jerseys', icon: '⚽' },
  { id: 'rugby-shirts', name: 'Rugby Shirts', icon: '🏉' },
  { id: 'polo-shirts', name: 'Polo Shirts', icon: '🎽' },
  { id: 'sports-shoes', name: 'Sports Shoes', icon: '👟' },
  { id: 'accessories', name: 'Accessories', icon: '🧤' },
  { id: 'other', name: 'Custom Apparel', icon: '✨' },
];

const FABRIC_OPTIONS = [
  'Select Fabric Type',
  '100% Cotton',
  'Cotton Jersey',
  'Cotton Double Jersey',
  '65/35 Cotton Polyester',
  'Cotton Spandex',
  'Cotton Fleece',
  'French Terry',
  'Popcorn Fleece',
  'Scuba',
  'Lycra / Spandex',
  'Polyester (Dry-Fit Interlock)',
  'Nylon',
  'Mesh',
  'Denim / Washed',
  'Twill / Corduroy',
  'Custom Fabric'
];

const GSM_OPTIONS = [
  'Select Fabric GSM',
  '160 GSM',
  '180 GSM',
  '200 GSM',
  '220 GSM',
  '240 GSM',
  '260 GSM',
  '280 GSM',
  '300 GSM',
  '320 GSM',
  '350 GSM',
  '380 GSM',
  '400 GSM',
  '450 GSM',
  '500 GSM',
  'Custom GSM'
];

const WASH_OPTIONS = [
  'Select Vintage Effect / Wash',
  'Plain (No Wash)',
  'Acid Wash',
  'Stone Wash',
  'Sun Fade',
  'Pigment Dye',
  'Dirty Wash',
  'Vintage Wash',
  'Snow Wash',
  'Custom Wash'
];

const FIT_OPTIONS = [
  'Select Fit Style',
  'Regular Fit',
  'Oversized Fit',
  'Boxy Fit',
  'Cropped Fit',
  'Slim Fit',
  'Relaxed Fit',
  'Baggy Fit',
  'Drop Shoulder',
  'Athletic Performance Fit',
  'Custom Pattern'
];

const PRINTING_OPTIONS = [
  'Select Printing Technique',
  'Sublimation Printing',
  'Screen Printing',
  'Digital Printing',
  'DTF Print',
  'DTG Print',
  'Puff Print',
  'High Density Print',
  'Reflective 3M Print',
  'Glitter / Foil Print',
  'Silicone / Rubber Print',
  'Flat Embroidery',
  '3D Puff Embroidery',
  'Chenille Embroidery',
  'Mixed Media'
];

const RHINESTONE_OPTIONS = [
  'Select Rhinestones Option',
  'None',
  'Random Sheet',
  'Custom Logo',
  'Custom Artwork'
];

const LABEL_OPTIONS = [
  'Select Labels & Branding',
  'Neck Woven Label',
  'Printed Neck Label',
  'Wash Care Label',
  'Custom Hang Tag',
  'Custom Polybag Branding',
  'Other Labels'
];

const SIZES_LIST = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
const QTY_OPTIONS = ['Sample', '10 UNITS', '20 UNITS', '30 UNITS', '50 UNITS', '100 UNITS', '100+ Pieces', '500+ Pieces', '1000+ Pieces'];

const BulkQuote = () => {
  const location = useLocation();
  const prefill = location.state || {};

  // Contact
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [country, setCountry] = useState('');

  // Selected Products (multi-select)
  const [selectedProducts, setSelectedProducts] = useState(
    prefill.prefillProduct ? [prefill.prefillProduct] : []
  );

  // File Upload
  const [uploadedFile, setUploadedFile] = useState(null);

  // Specifications
  const [fabric, setFabric] = useState(FABRIC_OPTIONS[0]);
  const [customFabric, setCustomFabric] = useState('');
  const [gsm, setGsm] = useState(GSM_OPTIONS[0]);
  const [customGsm, setCustomGsm] = useState('');
  const [wash, setWash] = useState(WASH_OPTIONS[0]);
  const [customWash, setCustomWash] = useState('');
  const [fit, setFit] = useState(FIT_OPTIONS[0]);
  const [customFit, setCustomFit] = useState('');
  const [printing, setPrinting] = useState(PRINTING_OPTIONS[0]);
  const [customPrinting, setCustomPrinting] = useState('');
  const [rhinestone, setRhinestone] = useState(RHINESTONE_OPTIONS[0]);
  const [customRhinestone, setCustomRhinestone] = useState('');
  const [label, setLabel] = useState(LABEL_OPTIONS[0]);
  const [customLabel, setCustomLabel] = useState('');

  // Sizes & Quantities
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [customSizes, setCustomSizes] = useState(prefill.prefillSize ? `Selected Size: ${prefill.prefillSize}` : '');
  const [selectedQty, setSelectedQty] = useState('');
  const [customQty, setCustomQty] = useState(prefill.prefillQty ? `${prefill.prefillQty} pcs` : '');

  // Additional instructions
  const [notes, setNotes] = useState(prefill.prefillColor ? `Color: ${prefill.prefillColor}` : '');

  // Submission State
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const toggleProduct = (prodName) => {
    if (selectedProducts.includes(prodName)) {
      setSelectedProducts(selectedProducts.filter(p => p !== prodName));
    } else {
      setSelectedProducts([...selectedProducts, prodName]);
    }
  };

  const toggleSize = (s) => {
    if (selectedSizes.includes(s)) {
      setSelectedSizes(selectedSizes.filter(x => x !== s));
    } else {
      setSelectedSizes([...selectedSizes, s]);
    }
  };

  const getInquirySummary = () => {
    return {
      name,
      email,
      whatsapp,
      country,
      products: selectedProducts.length > 0 ? selectedProducts.join(', ') : 'Custom Selection',
      specs: {
        fabric: fabric !== FABRIC_OPTIONS[0] ? fabric : customFabric || 'N/A',
        gsm: gsm !== GSM_OPTIONS[0] ? gsm : customGsm || 'N/A',
        wash: wash !== WASH_OPTIONS[0] ? wash : customWash || 'N/A',
        fit: fit !== FIT_OPTIONS[0] ? fit : customFit || 'N/A',
        printing: printing !== PRINTING_OPTIONS[0] ? printing : customPrinting || 'N/A',
        rhinestone: rhinestone !== RHINESTONE_OPTIONS[0] ? rhinestone : customRhinestone || 'None',
        label: label !== LABEL_OPTIONS[0] ? label : customLabel || 'N/A'
      },
      sizes: selectedSizes.length > 0 ? selectedSizes.join(', ') : customSizes || 'All Sizes',
      quantity: selectedQty || customQty || 'Sample / MOQ inquiry',
      fileName: uploadedFile ? uploadedFile.name : 'No file attached',
      notes: notes || 'None'
    };
  };

  const handleWhatsAppSubmit = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }
    const sum = getInquirySummary();
    const msg = 
      `*🌟 NEW BULK & OEM MANUFACTURING INQUIRY*\n` +
      `*Company / Client:* ${sum.name}\n` +
      `*Email:* ${sum.email || 'N/A'}\n` +
      `*WhatsApp:* ${sum.whatsapp || 'N/A'}\n` +
      `*Country/City:* ${sum.country || 'N/A'}\n\n` +
      `*📦 Products:* ${sum.products}\n` +
      `*🧵 Fabric:* ${sum.specs.fabric}\n` +
      `*⚖️ GSM:* ${sum.specs.gsm}\n` +
      `*🎨 Wash:* ${sum.specs.wash}\n` +
      `*✂️ Fit:* ${sum.specs.fit}\n` +
      `*🖨️ Print/Embroidery:* ${sum.specs.printing}\n` +
      `*💎 Rhinestone:* ${sum.specs.rhinestone}\n` +
      `*🏷️ Labels:* ${sum.specs.label}\n\n` +
      `*📏 Sizes:* ${sum.sizes}\n` +
      `*🔢 Quantity:* ${sum.quantity}\n` +
      `*📎 File:* ${sum.fileName}\n` +
      `*📝 Notes:* ${sum.notes}\n\n` +
      `_Sent via SublivoExport Inquiry Portal_`;

    window.open(`https://wa.me/923204615100?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleEmailSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }
    setLoading(true);
    const sum = getInquirySummary();

    try {
      await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name, email, phone: whatsapp, country },
          product: { title: `Bulk Inquiry: ${sum.products}`, price: 0 },
          quantity: sum.quantity,
          totalAmount: 0,
          customizationNotes: JSON.stringify(sum)
        })
      }).catch(() => {});

      setSubmitted(true);
      setSubmitMessage('Thank you! Your bulk manufacturing inquiry has been sent to our export team.');
    } catch {
      setSubmitted(true);
      setSubmitMessage('Inquiry prepared! Click below to confirm directly with our export manager on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ width: '100%', boxSizing: 'border-box', paddingTop: '10px', paddingBottom: '50px', minHeight: '85vh' }}>
      
      {/* Top back link */}
      <div style={{ marginBottom: '10px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '12px' }}>
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        margin: '0 auto',
        padding: '28px 26px',
        borderRadius: '18px',
        border: '1px solid rgba(49, 205, 106, 0.25)',
        boxShadow: '0 16px 45px rgba(0,0,0,0.55)'
      }}>

        {/* Compact Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(49, 205, 106, 0.1)',
            border: '1px solid rgba(49, 205, 106, 0.3)',
            borderRadius: '16px',
            padding: '3px 12px',
            fontSize: '10.5px',
            color: 'var(--primary)',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '8px'
          }}>
            <Sparkles size={11} /> Sialkot, Pakistan • Direct Manufacturer
          </div>
          <h1 style={{
            fontSize: 'clamp(20px, 3.2vw, 25px)',
            fontWeight: '800',
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
            margin: '0 0 6px 0'
          }}>
            STREETWEAR & SPORTSWEAR <span style={{ color: 'var(--primary)' }}>INQUIRY FORM</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', maxWidth: '540px', margin: '0 auto', lineHeight: 1.4 }}>
            Custom Sample OEM & Bulk Wholesale Request • Factory-Direct Pricing
          </p>
        </div>

        {submitted ? (
          <div style={{
            textAlign: 'center',
            padding: '36px 16px',
            background: 'rgba(49, 205, 106, 0.05)',
            border: '1px solid rgba(49, 205, 106, 0.3)',
            borderRadius: '16px'
          }}>
            <CheckCircle size={46} color="#4ade80" style={{ marginBottom: '12px' }} />
            <h2 style={{ color: '#4ade80', fontSize: '20px', fontWeight: '800', marginBottom: '6px' }}>
              Inquiry Dispatched!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.5 }}>
              {submitMessage}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleWhatsAppSubmit} className="btn-primary" style={{ padding: '10px 20px', fontSize: '13.5px' }}>
                <MessageCircle size={16} /> Open Direct WhatsApp Chat
              </button>
              <button onClick={() => setSubmitted(false)} className="btn-outline" style={{ padding: '10px 20px', fontSize: '13.5px' }}>
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleWhatsAppSubmit(e); }}>

            {/* 1. Contact Details */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '5px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '13.5px' }}>1.</span>
                <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'white' }}>Your Contact Details</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="inquiry-input"
                    style={{ padding: '7px 11px', fontSize: '12.5px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="e.g. john@brand.com" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="inquiry-input"
                    style={{ padding: '7px 11px', fontSize: '12.5px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>WhatsApp / Phone *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. +1 555 123 4567" 
                    required 
                    value={whatsapp} 
                    onChange={e => setWhatsapp(e.target.value)} 
                    className="inquiry-input"
                    style={{ padding: '7px 11px', fontSize: '12.5px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Country & City *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. USA, New York" 
                    required 
                    value={country} 
                    onChange={e => setCountry(e.target.value)} 
                    className="inquiry-input"
                    style={{ padding: '7px 11px', fontSize: '12.5px' }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Select Products (Compact Cards) */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '5px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '13.5px' }}>2.</span>
                <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'white' }}>
                  Select Products <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400' }}>(Multi-select)</span>
                </h3>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))',
                gap: '8px'
              }}>
                {PRODUCT_LIST.map((p) => {
                  const isSelected = selectedProducts.includes(p.name);
                  return (
                    <div 
                      key={p.id}
                      onClick={() => toggleProduct(p.name)}
                      style={{
                        padding: '9px 8px',
                        borderRadius: '10px',
                        border: isSelected ? '1.5px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
                        background: isSelected ? 'rgba(49, 205, 106, 0.15)' : 'rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'center',
                        position: 'relative'
                      }}
                    >
                      {isSelected && (
                        <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
                          <CheckCircle size={13} color="var(--primary)" />
                        </div>
                      )}
                      <div style={{ fontSize: '20px', marginBottom: '2px' }}>{p.icon}</div>
                      <div style={{ fontSize: '11.5px', fontWeight: '700', color: isSelected ? 'var(--primary)' : 'white', lineHeight: 1.2 }}>
                        {p.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Upload Design / Techpack (Compact) */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '5px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '13.5px' }}>3.</span>
                <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'white' }}>
                  Upload Techpack / Design <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400' }}>(PDF, JPG, PNG, AI, ZIP - Max 25MB)</span>
                </h3>
              </div>
              
              <div style={{
                border: '1.5px dashed rgba(255,255,255,0.18)',
                borderRadius: '12px',
                padding: '12px 14px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png,.ai,.eps,.zip"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadedFile(e.target.files[0]);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <Upload size={20} color="var(--primary)" />
                {uploadedFile ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(49,205,106,0.15)', padding: '4px 12px', borderRadius: '16px', color: 'var(--primary)', fontSize: '12px' }}>
                    <FileText size={13} /> {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                    <button type="button" onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', display: 'flex' }}>
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.85)' }}>
                    Attach Mockup / Techpack or <strong style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Browse File</strong>
                  </span>
                )}
              </div>
            </div>

            {/* 4. Specifications & Customization */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '5px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '13.5px' }}>4.</span>
                <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'white' }}>
                  Specifications & Customization
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {/* Fabric */}
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Fabric Type</label>
                  <select value={fabric} onChange={e => setFabric(e.target.value)} className="inquiry-input" style={{ padding: '6px 9px', fontSize: '12px', marginBottom: '4px' }}>
                    {FABRIC_OPTIONS.map((f, i) => <option key={i} value={f}>{f}</option>)}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Custom Fabric details..." 
                    value={customFabric} 
                    onChange={e => setCustomFabric(e.target.value)} 
                    className="inquiry-input" 
                    style={{ fontSize: '11.5px', padding: '5px 8px' }}
                  />
                </div>

                {/* GSM */}
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Fabric Weight / GSM</label>
                  <select value={gsm} onChange={e => setGsm(e.target.value)} className="inquiry-input" style={{ padding: '6px 9px', fontSize: '12px', marginBottom: '4px' }}>
                    {GSM_OPTIONS.map((g, i) => <option key={i} value={g}>{g}</option>)}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Custom GSM details..." 
                    value={customGsm} 
                    onChange={e => setCustomGsm(e.target.value)} 
                    className="inquiry-input" 
                    style={{ fontSize: '11.5px', padding: '5px 8px' }}
                  />
                </div>

                {/* Wash */}
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Vintage Effect / Wash</label>
                  <select value={wash} onChange={e => setWash(e.target.value)} className="inquiry-input" style={{ padding: '6px 9px', fontSize: '12px', marginBottom: '4px' }}>
                    {WASH_OPTIONS.map((w, i) => <option key={i} value={w}>{w}</option>)}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Custom Wash details..." 
                    value={customWash} 
                    onChange={e => setCustomWash(e.target.value)} 
                    className="inquiry-input" 
                    style={{ fontSize: '11.5px', padding: '5px 8px' }}
                  />
                </div>

                {/* Fit */}
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Fit Style</label>
                  <select value={fit} onChange={e => setFit(e.target.value)} className="inquiry-input" style={{ padding: '6px 9px', fontSize: '12px', marginBottom: '4px' }}>
                    {FIT_OPTIONS.map((ft, i) => <option key={i} value={ft}>{ft}</option>)}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Custom Fit Style..." 
                    value={customFit} 
                    onChange={e => setCustomFit(e.target.value)} 
                    className="inquiry-input" 
                    style={{ fontSize: '11.5px', padding: '5px 8px' }}
                  />
                </div>

                {/* Printing / Embroidery */}
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Printing / Embroidery</label>
                  <select value={printing} onChange={e => setPrinting(e.target.value)} className="inquiry-input" style={{ padding: '6px 9px', fontSize: '12px', marginBottom: '4px' }}>
                    {PRINTING_OPTIONS.map((p, i) => <option key={i} value={p}>{p}</option>)}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Custom Technique details..." 
                    value={customPrinting} 
                    onChange={e => setCustomPrinting(e.target.value)} 
                    className="inquiry-input" 
                    style={{ fontSize: '11.5px', padding: '5px 8px' }}
                  />
                </div>

                {/* Rhinestones */}
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Rhinestones</label>
                  <select value={rhinestone} onChange={e => setRhinestone(e.target.value)} className="inquiry-input" style={{ padding: '6px 9px', fontSize: '12px', marginBottom: '4px' }}>
                    {RHINESTONE_OPTIONS.map((r, i) => <option key={i} value={r}>{r}</option>)}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Custom Rhinestones..." 
                    value={customRhinestone} 
                    onChange={e => setCustomRhinestone(e.target.value)} 
                    className="inquiry-input" 
                    style={{ fontSize: '11.5px', padding: '5px 8px' }}
                  />
                </div>

                {/* Labels */}
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Labels & Branding</label>
                  <select value={label} onChange={e => setLabel(e.target.value)} className="inquiry-input" style={{ padding: '6px 9px', fontSize: '12px', marginBottom: '4px' }}>
                    {LABEL_OPTIONS.map((l, i) => <option key={i} value={l}>{l}</option>)}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Custom Label details..." 
                    value={customLabel} 
                    onChange={e => setCustomLabel(e.target.value)} 
                    className="inquiry-input" 
                    style={{ fontSize: '11.5px', padding: '5px 8px' }}
                  />
                </div>
              </div>
            </div>

            {/* 5. Size Range */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '5px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '13.5px' }}>5.</span>
                <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'white' }}>Size Range</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                {SIZES_LIST.map((s) => {
                  const isChecked = selectedSizes.includes(s);
                  return (
                    <div 
                      key={s}
                      onClick={() => toggleSize(s)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        border: isChecked ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                        background: isChecked ? 'rgba(49, 205, 106, 0.2)' : 'rgba(255,255,255,0.04)',
                        color: isChecked ? 'var(--primary)' : 'white',
                        transition: 'all 0.15s'
                      }}
                    >
                      {s}
                    </div>
                  );
                })}
              </div>
              <input 
                type="text" 
                placeholder="Custom size chart instructions / breakdown..." 
                value={customSizes} 
                onChange={e => setCustomSizes(e.target.value)} 
                className="inquiry-input"
                style={{ padding: '6px 10px', fontSize: '12px' }}
              />
            </div>

            {/* 6. Quantity / Target MOQ */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '5px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '13.5px' }}>6.</span>
                <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'white' }}>Quantity / MOQ Target</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                {QTY_OPTIONS.map((q) => {
                  const isSelected = selectedQty === q;
                  return (
                    <div 
                      key={q}
                      onClick={() => setSelectedQty(isSelected ? '' : q)}
                      style={{
                        padding: '5px 13px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        border: isSelected ? '1px solid #f5a623' : '1px solid rgba(255,255,255,0.1)',
                        background: isSelected ? 'rgba(245, 166, 35, 0.2)' : 'rgba(255,255,255,0.04)',
                        color: isSelected ? '#f5a623' : 'white',
                        transition: 'all 0.15s'
                      }}
                    >
                      {q}
                    </div>
                  );
                })}
              </div>
              <input 
                type="text" 
                placeholder="Or custom target quantity (e.g. 500 pcs)..." 
                value={customQty} 
                onChange={e => setCustomQty(e.target.value)} 
                className="inquiry-input"
                style={{ padding: '6px 10px', fontSize: '12px' }}
              />
            </div>

            {/* 7. Additional Instructions */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '5px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '13.5px' }}>7.</span>
                <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'white' }}>Additional Instructions</h3>
              </div>
              <textarea 
                rows={2}
                placeholder="Write any special instructions, pantone colors, packaging preferences or deadlines..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="inquiry-input"
                style={{ padding: '8px 12px', fontSize: '12px', resize: 'vertical' }}
              />
            </div>

            {/* Action Buttons Side-by-Side */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              <button 
                type="button" 
                onClick={handleWhatsAppSubmit}
                className="btn-primary" 
                style={{
                  justifyContent: 'center',
                  padding: '11px 18px',
                  fontSize: '13.5px',
                  fontWeight: '800',
                  borderRadius: '10px',
                  boxShadow: '0 6px 18px rgba(49, 205, 106, 0.3)'
                }}
              >
                <MessageCircle size={17} /> WHATSAPP INQUIRY
              </button>
              
              <button 
                type="button" 
                onClick={handleEmailSubmit}
                disabled={loading}
                className="btn-outline" 
                style={{
                  justifyContent: 'center',
                  padding: '11px 18px',
                  fontSize: '13.5px',
                  fontWeight: '800',
                  borderRadius: '10px',
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.2)'
                }}
              >
                <Mail size={16} /> {loading ? 'Submitting...' : 'EMAIL INQUIRY'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default BulkQuote;
