import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import Reveal from '../components/common/Reveal';
import { Search, Loader2, X, ArrowUpRight, Star, Coffee } from 'lucide-react';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const activeCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, menuRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/menu?category=${activeCategory}&search=${searchQuery}&available=true`)
        ]);
        setCategories(catRes.data);
        setMenuItems(menuRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (slug) => {
    setSearchParams(prev => {
      if (slug) prev.set('category', slug);
      else prev.delete('category');
      return prev;
    });
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchParams(prev => {
      if (val) prev.set('q', val);
      else prev.delete('q');
      return prev;
    });
  };

  const clearSearch = () => {
    setSearchParams(prev => {
      prev.delete('q');
      return prev;
    });
  };

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-40 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* ============ HEADING ============ */}
        <Reveal className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-accent/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-accent font-bold tracking-[0.35em] uppercase text-[10px] md:text-xs">
              Our Menu
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <div className="w-12 h-[1px] bg-accent/60" />
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading text-primary leading-[1.1] tracking-tight mb-6">
            Crafted with passion,
            <br />
            <span className="italic font-normal opacity-70">served with love</span>
          </h1>
        </Reveal>

        {/* ============ FILTERS & SEARCH ============ */}
        <Reveal delay={0.1} className="mb-14">
          <div className="bg-surface rounded-3xl p-6 md:p-8 border border-border shadow-sm max-w-5xl mx-auto">
            
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input 
                type="text" 
                placeholder="Search our menu..." 
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-14 pr-12 py-4 bg-background border-2 border-transparent rounded-2xl focus:border-accent outline-none transition-all duration-300 text-primary placeholder:text-muted"
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center text-muted hover:bg-accent hover:text-white transition-all duration-300"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            
          </div>
        </Reveal>

        {/* ============ RESULTS COUNT ============ */}
        {!loading && menuItems.length > 0 && (
          <div className="max-w-7xl mx-auto flex items-center gap-3 mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-muted font-semibold">
              {menuItems.length} {menuItems.length === 1 ? 'Item' : 'Items'}
            </span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>
        )}

        {/* ============ ITEMS GRID ============ */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-accent" size={40} />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">Loading Menu</span>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20 bg-surface rounded-3xl border border-border">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background border border-border flex items-center justify-center">
              <Search className="text-muted" size={24} />
            </div>
            <h3 className="text-2xl font-heading text-primary mb-3">No items found</h3>
            <p className="text-muted text-sm mb-6">
              We could not find anything matching your criteria.
            </p>
            <button 
              onClick={() => { handleCategoryChange(''); clearSearch(); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {menuItems.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.05}>
                
                {/* Premium Card - Same as Featured Menu */}
                <Link 
                  to={`/menu/${item.slug}`} 
                  className="group relative block bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(74,59,50,0.15)] transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                >
                  
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.image_url || 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop'} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Featured Badge (only if featured) */}
                    {item.is_featured && (
                      <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                        <Star size={12} className="text-accent fill-accent" />
                        Featured
                      </div>
                    )}

                    {/* Price Badge (Bottom Right) */}
                    <div className="absolute bottom-4 right-4 bg-accent text-white px-4 py-2 rounded-full shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <span className="font-heading text-sm font-semibold">Rs. {item.price}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 pt-5">
                    
                    {/* Category Eyebrow */}
                    {item.categories?.name && (
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-2 block">
                        {item.categories.name}
                      </span>
                    )}

                    {/* Item Name with underline animation */}
                    <div className="relative inline-block mb-3">
                      <h3 className="text-xl font-heading text-primary leading-tight">
                        {item.name}
                      </h3>
                      <span className="absolute -bottom-1 left-0 w-8 h-[2px] bg-accent transition-all duration-500 group-hover:w-full"></span>
                    </div>

                    {/* Description */}
                    <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-4">
                      {item.description || 'A signature Mazi creation, crafted with care.'}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs uppercase tracking-widest text-muted font-semibold">
                        View Details
                      </span>
                      <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>

                  </div>
                  
                </Link>

              </Reveal>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Menu;