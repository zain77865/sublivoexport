import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, X, ArrowUpDown, Tag, 
  Sparkles, Check, RotateCcw, MessageCircle, ArrowRight,
  LayoutGrid, Trophy, Flame, Shirt, Award, Wind, Compass, Footprints, Backpack
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: LayoutGrid, keywords: [] },
  { id: 'football', name: 'Football Jerseys', icon: Trophy, keywords: ['football', 'jersey', 'soccer', 'kit'] },
  { id: 'rugby', name: 'Rugby Shirts', icon: Flame, keywords: ['rugby'] },
  { id: 'tshirts', name: 'T-Shirts', icon: Shirt, keywords: ['t-shirt', 'tshirt', 'tee', 'shirt'] },
  { id: 'polos', name: 'Polo Shirts', icon: Award, keywords: ['polo'] },
  { id: 'hoodies', name: 'Hoodies & Jackets', icon: Wind, keywords: ['hoodie', 'jacket', 'fleece', 'tracksuit', 'sweatshirt'] },
  { id: 'shorts', name: 'Shorts & Bottoms', icon: Compass, keywords: ['short', 'bottom', 'trouser', 'pant'] },
  { id: 'shoes', name: 'Sports Shoes', icon: Footprints, keywords: ['shoe', 'cleat', 'sneaker', 'footwear'] },
  { id: 'accessories', name: 'Accessories', icon: Backpack, keywords: ['accessory', 'accessories', 'glove', 'cap', 'sock', 'bag'] },
];

const PRICE_PRESETS = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-25', label: 'Under $25', min: 0, max: 25 },
  { id: '25-50', label: '$25 – $50', min: 25, max: 50 },
  { id: '50-100', label: '$50 – $100', min: 50, max: 100 },
  { id: 'above-100', label: '$100+', min: 100, max: Infinity },
];

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'discount', label: 'Highest Discount' },
  { id: 'title-asc', label: 'Name: A to Z' },
];

const Shop = ({ products, handleAddToCart }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read URL search params
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPricePreset, setSelectedPricePreset] = useState('all');
  const [customMinPrice, setCustomMinPrice] = useState('');
  const [customMaxPrice, setCustomMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [onlySale, setOnlySale] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    const cat = params.get('category') || 'all';
    setSearchTerm(q);
    if (cat) setSelectedCategory(cat);
  }, [location.search]);

  // Handle category change
  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    const params = new URLSearchParams(location.search);
    if (catId === 'all') {
      params.delete('category');
    } else {
      params.set('category', catId);
    }
    navigate({ pathname: '/shop', search: params.toString() ? `?${params.toString()}` : '' }, { replace: true });
  };

  // Handle Search Input submit / change
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    const params = new URLSearchParams(location.search);
    if (val.trim()) {
      params.set('search', val.trim());
    } else {
      params.delete('search');
    }
    navigate({ pathname: '/shop', search: params.toString() ? `?${params.toString()}` : '' }, { replace: true });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams(location.search);
    params.delete('search');
    navigate({ pathname: '/shop', search: params.toString() ? `?${params.toString()}` : '' }, { replace: true });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPricePreset('all');
    setCustomMinPrice('');
    setCustomMaxPrice('');
    setSortBy('featured');
    setOnlySale(false);
    navigate('/shop', { replace: true });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Text Search Filter
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const titleMatch = p.title && p.title.toLowerCase().includes(term);
          const descMatch = p.description && p.description.toLowerCase().includes(term);
          if (!titleMatch && !descMatch) return false;
        }

        // 2. Category Filter
        if (selectedCategory !== 'all') {
          const cat = CATEGORIES.find((c) => c.id === selectedCategory);
          if (cat) {
            const prodCat = (p.category || '').toLowerCase();
            const catName = cat.name.toLowerCase();
            const catId = cat.id.toLowerCase();
            
            const isDirectMatch = prodCat && (prodCat === catName || prodCat.includes(catId) || catName.includes(prodCat));
            if (!isDirectMatch) {
              const textToSearch = `${p.title || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();
              const matched = cat.keywords.some((kw) => textToSearch.includes(kw));
              if (!matched) return false;
            }
          }
        }

        // 3. Price Preset Filter
        if (selectedPricePreset !== 'all') {
          const preset = PRICE_PRESETS.find((pr) => pr.id === selectedPricePreset);
          if (preset) {
            if (p.price < preset.min || p.price > preset.max) return false;
          }
        }

        // 4. Custom Min/Max Price Filter
        if (customMinPrice !== '' && !isNaN(Number(customMinPrice))) {
          if (p.price < Number(customMinPrice)) return false;
        }
        if (customMaxPrice !== '' && !isNaN(Number(customMaxPrice))) {
          if (p.price > Number(customMaxPrice)) return false;
        }

        // 5. On Sale Only Filter
        if (onlySale) {
          const actual = p.actualPrice || 0;
          if (!actual || actual <= p.price) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'discount') {
          const discA = a.actualPrice && a.actualPrice > a.price ? (a.actualPrice - a.price) / a.actualPrice : 0;
          const discB = b.actualPrice && b.actualPrice > b.price ? (b.actualPrice - b.price) / b.actualPrice : 0;
          return discB - discA;
        }
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        return 0; // Default featured order
      });
  }, [products, searchTerm, selectedCategory, selectedPricePreset, customMinPrice, customMaxPrice, onlySale, sortBy]);

  // Count active filters (for badge)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedPricePreset !== 'all' || customMinPrice !== '' || customMaxPrice !== '') count++;
    if (onlySale) count++;
    if (sortBy !== 'featured') count++;
    if (searchTerm.trim()) count++;
    return count;
  }, [selectedCategory, selectedPricePreset, customMinPrice, customMaxPrice, onlySale, sortBy, searchTerm]);

  const handleCustomOrderWhatsApp = () => {
    window.open('https://wa.me/923204615100?text=Hi SublivoExport, I need custom sportswear made with my team design & logo.', '_blank');
  };

  return (
    <div className="container shop-page-container">
      
      {/* ===== HEADER & TITLE ===== */}
      <div className="shop-header-wrapper">
        <div className="shop-header-left">
          <div className="glass shop-badge">
            <Sparkles size={13} /> Premium Export Collection
          </div>
          <h1 className="section-title shop-title">
            Product <span style={{ color: 'var(--primary)' }}>Collection</span>
          </h1>
          <p className="shop-subtitle">
            Factory-direct custom jerseys, apparel, footwear & athletic gear.
          </p>
        </div>
      </div>

      {/* ===== SEARCH & FILTER BAR ===== */}
      <div className="glass shop-search-bar">
        {/* Search input */}
        <div className="shop-search-input-box">
          <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search jerseys, hoodies, shirts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="shop-search-input"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="shop-clear-btn"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Right side controls: Sort & Filter Toggle */}
        <div className="shop-controls-group">
          {/* Sort By Dropdown */}
          <div className="shop-sort-box">
            <ArrowUpDown size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="shop-sort-select"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} style={{ background: '#111', color: '#fff' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Filter Panel Button */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`shop-filter-toggle-btn ${isFilterPanelOpen ? 'active' : ''}`}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="shop-filter-count-badge">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ===== CATEGORY PILLS (WITH REAL PROFESSIONAL SVG ICONS) ===== */}
      <div className="shop-category-row">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const CategoryIcon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`shop-category-pill ${isActive ? 'active' : ''}`}
            >
              <CategoryIcon size={14} className="shop-category-icon" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* ===== MODAL FILTER PANEL (FLOATING OVERLAY WITH HIGH Z-INDEX & CLOSE BUTTON) ===== */}
      {isFilterPanelOpen && (
        <>
          <div 
            className="shop-filter-backdrop"
            onClick={() => setIsFilterPanelOpen(false)}
          />
          <div className="glass shop-filter-panel">
            {/* Modal Header */}
            <div className="shop-filter-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={16} color="var(--primary)" />
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'white', margin: 0 }}>
                  Filter Products
                </h3>
                {activeFiltersCount > 0 && (
                  <span className="shop-filter-count-badge">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsFilterPanelOpen(false)}
                className="shop-filter-close-btn"
                title="Close filters"
                aria-label="Close filters"
              >
                <X size={16} />
              </button>
            </div>

            {/* Filter Options Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              
              {/* Price Presets */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Price Range
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {PRICE_PRESETS.map((preset) => {
                    const isSelected = selectedPricePreset === preset.id && customMinPrice === '' && customMaxPrice === '';
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setSelectedPricePreset(preset.id);
                          setCustomMinPrice('');
                          setCustomMaxPrice('');
                        }}
                        style={{
                          textAlign: 'left',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          background: isSelected ? 'rgba(245,166,35,0.15)' : 'transparent',
                          border: isSelected ? '1px solid rgba(245,166,35,0.4)' : '1px solid transparent',
                          color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{preset.label}</span>
                        {isSelected && <Check size={13} color="var(--primary)" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Min / Max Price */}
                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Custom Range ($)</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="number"
                      placeholder="Min"
                      value={customMinPrice}
                      onChange={(e) => {
                        setCustomMinPrice(e.target.value);
                        setSelectedPricePreset('custom');
                      }}
                      style={{
                        width: '75px',
                        padding: '5px 8px',
                        fontSize: '11.5px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        color: 'white',
                        outline: 'none'
                      }}
                    />
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>–</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={customMaxPrice}
                      onChange={(e) => {
                        setCustomMaxPrice(e.target.value);
                        setSelectedPricePreset('custom');
                      }}
                      style={{
                        width: '75px',
                        padding: '5px 8px',
                        fontSize: '11.5px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        color: 'white',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Special Deals / Toggles */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Special Offers
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '12.5px',
                    color: onlySale ? 'white' : 'var(--text-muted)'
                  }}>
                    <input
                      type="checkbox"
                      checked={onlySale}
                      onChange={(e) => setOnlySale(e.target.checked)}
                      style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '15px', height: '15px' }}
                    />
                    <span>Show Discounted Only</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '18px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              <button
                onClick={handleResetFilters}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  color: 'var(--text-muted)',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={12} /> Reset
              </button>

              <button
                onClick={() => setIsFilterPanelOpen(false)}
                className="btn-primary"
                style={{ padding: '7px 18px', fontSize: '12px' }}
              >
                Apply ({filteredProducts.length})
              </button>
            </div>

          </div>
        </>
      )}

      {/* ===== ACTIVE FILTER BADGES BAR ===== */}
      <div className="shop-active-filters">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span className="shop-count-text">
            Showing <strong style={{ color: 'white' }}>{filteredProducts.length}</strong> of {products.length} products
          </span>

          {selectedCategory !== 'all' && (
            <span className="shop-filter-chip primary">
              {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
              <X size={11} style={{ cursor: 'pointer' }} onClick={() => handleCategorySelect('all')} />
            </span>
          )}

          {searchTerm && (
            <span className="shop-filter-chip info">
              "{searchTerm}"
              <X size={11} style={{ cursor: 'pointer' }} onClick={handleClearSearch} />
            </span>
          )}

          {selectedPricePreset !== 'all' && (
            <span className="shop-filter-chip neutral">
              {PRICE_PRESETS.find((p) => p.id === selectedPricePreset)?.label}
              <X size={11} style={{ cursor: 'pointer' }} onClick={() => setSelectedPricePreset('all')} />
            </span>
          )}

          {(customMinPrice || customMaxPrice) && (
            <span className="shop-filter-chip neutral">
              ${customMinPrice || 0} – ${customMaxPrice || '∞'}
              <X size={11} style={{ cursor: 'pointer' }} onClick={() => { setCustomMinPrice(''); setCustomMaxPrice(''); }} />
            </span>
          )}

          {onlySale && (
            <span className="shop-filter-chip danger">
              On Sale Only
              <X size={11} style={{ cursor: 'pointer' }} onClick={() => setOnlySale(false)} />
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="shop-clear-all-link"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ===== PRODUCTS GRID ===== */}
      {filteredProducts.length === 0 ? (
        <div className="glass" style={{
          textAlign: 'center',
          padding: '40px 16px',
          borderRadius: '16px',
          marginTop: '16px'
        }}>
          <Tag size={36} color="var(--primary)" style={{ opacity: 0.6, marginBottom: '10px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
            No Sportswear Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', maxWidth: '420px', margin: '0 auto 16px', lineHeight: 1.5 }}>
            No products match the selected filters. Try clearing your filters or message us directly on WhatsApp for custom orders.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleResetFilters}
              className="btn-outline"
              style={{ fontSize: '12px', padding: '8px 18px' }}
            >
              <RotateCcw size={13} /> Reset Filters
            </button>
            <button
              onClick={handleCustomOrderWhatsApp}
              className="sublivo-whatsapp-btn"
              style={{ fontSize: '12px', padding: '8px 18px' }}
            >
              <MessageCircle size={14} /> Order Custom Kit
            </button>
          </div>
        </div>
      ) : (
        <div className="shop-products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id || product._id}
              product={product}
              onMoreDetailClick={() => navigate(`/product/${product.id || product._id}`)}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Shop;