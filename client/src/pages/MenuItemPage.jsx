import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import Reveal from '../components/common/Reveal';
import { 
  ArrowLeft, Loader2, Star, ArrowUpRight, Coffee, 
  CheckCircle2, XCircle, Sparkles, Heart 
} from 'lucide-react';

const MenuItemPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/menu/${slug}`);
        setItem(response.data);
        
        // Fetch related items from same category
        if (response.data.category_id && response.data.categories?.slug) {
          const relResponse = await api.get(`/menu?category=${response.data.categories.slug}&available=true`);
          setRelated(relResponse.data.filter(i => i.id !== response.data.id).slice(0, 3));
        }
      } catch (err) {
        console.error(err);
        navigate('/menu');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [slug, navigate]);

  if (loading) return (
    <div className="pt-32 min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-accent" size={40} />
      <span className="text-xs uppercase tracking-[0.3em] text-muted">Loading Item</span>
    </div>
  );
  
  if (!item) return null;

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-40 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">

        {/* ============ BACK LINK ============ */}
        <Reveal>
          <Link 
            to="/menu" 
            className="group inline-flex items-center gap-2 text-muted hover:text-accent transition-colors mb-10 text-xs font-bold uppercase tracking-[0.25em]"
          >
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Back to Menu
          </Link>
        </Reveal>

        {/* ============ HERO SECTION (Split Layout) ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-24">
          
          {/* LEFT: Image */}
          <Reveal className="relative">
            {/* Back Frame Decoration */}
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-accent/20 rounded-3xl hidden md:block" />

            <div className="relative group rounded-3xl overflow-hidden shadow-[0_30px_80px_rgb(74,59,50,0.2)]">
              <img 
                src={item.image_url || 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1000'} 
                alt={item.name} 
                className="w-full h-[450px] md:h-[600px] object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105" 
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Featured Badge (Top Left) */}
              {item.is_featured && (
                <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/95 backdrop-blur-md text-primary px-4 py-2 rounded-full shadow-lg">
                  <Star size={14} className="text-accent fill-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Featured
                  </span>
                </div>
              )}

              {/* Price Badge (Bottom Right, floating) */}
              <div className="absolute bottom-6 right-6 bg-accent text-white rounded-2xl px-6 py-4 shadow-2xl">
                <span className="text-[10px] uppercase tracking-widest block opacity-90 leading-none mb-1">
                  Price
                </span>
                <span className="font-heading text-3xl font-bold leading-none block">
                  Rs. {item.price}
                </span>
              </div>
            </div>
          </Reveal>

          {/* RIGHT: Details */}
          <Reveal delay={0.15} className="flex flex-col justify-center py-4">
            
            {/* Category Eyebrow */}
            {item.categories?.name && (
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-[2px] bg-accent" />
                <Link 
                  to={`/menu?category=${item.categories.slug}`}
                  className="text-accent font-bold tracking-[0.35em] uppercase text-[10px] md:text-xs hover:text-primary transition-colors"
                >
                  {item.categories.name}
                </Link>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-primary leading-[1.1] tracking-tight mb-4">
              {item.name}
            </h1>
            
            {/* Animated Divider */}
            <div className="w-20 h-[3px] bg-accent mb-8" />

            {/* Description */}
            <p className="text-muted text-lg leading-relaxed mb-8 max-w-lg">
              {item.description || 'A signature Mazi creation, handcrafted with care using the finest ingredients.'}
            </p>

            {/* Availability Status */}
            <div className="flex items-center gap-4 mb-10">
              <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 ${
                item.is_available 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {item.is_available ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Available Now
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Currently Unavailable
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10 max-w-md">
              <div className="bg-surface rounded-2xl p-5 border border-border">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-3">
                  <Coffee size={18} />
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted block mb-1">
                  Crafted
                </span>
                <span className="text-sm font-semibold text-primary">
                  Made to Order
                </span>
              </div>

              <div className="bg-surface rounded-2xl p-5 border border-border">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-3">
                  <Sparkles size={18} />
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted block mb-1">
                  Quality
                </span>
                <span className="text-sm font-semibold text-primary">
                  Specialty Grade
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/menu" 
                className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span className="text-xs uppercase tracking-[0.2em]">
                  Explore Menu
                </span>
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                  <ArrowUpRight size={14} className="group-hover/btn:rotate-45 transition-transform duration-300" />
                </div>
              </Link>

              <Link 
                to="/contact" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-surface border border-border text-primary font-semibold rounded-full hover:border-accent hover:bg-white transition-all duration-300 text-xs uppercase tracking-[0.2em]"
              >
                <Heart size={14} className="text-accent" />
                Visit Us
              </Link>
            </div>

          </Reveal>
        </div>

        {/* ============ RELATED ITEMS ============ */}
        {related.length > 0 && (
          <Reveal delay={0.2}>
            <div className="mt-8">
              
              {/* Section Header */}
              <div className="max-w-3xl mx-auto text-center mb-14">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-12 h-[1px] bg-accent/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-accent font-bold tracking-[0.35em] uppercase text-[10px] md:text-xs">
                    Also on the Menu
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <div className="w-12 h-[1px] bg-accent/60" />
                </div>
                <h2 className="text-4xl md:text-5xl font-heading text-primary leading-tight mb-4">
                  You might also
                  <br />
                  <span className="italic font-normal opacity-70">enjoy these</span>
                </h2>

                <div className="flex items-center gap-2 mt-8 justify-center">
                  <div className="h-[1px] w-6 bg-primary/20" />
                  <div className="w-1 h-1 rounded-full bg-accent" />
                  <div className="h-[1px] w-6 bg-primary/20" />
                </div>
              </div>

              {/* Related Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {related.map((relItem, index) => (
                  <Reveal key={relItem.id} delay={index * 0.1}>
                    <Link 
                      to={`/menu/${relItem.slug}`} 
                      className="group relative block bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(74,59,50,0.15)] transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                    >
                      
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={relItem.image_url || 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800'} 
                          alt={relItem.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                        />
                        
                        {/* Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        {/* Price Badge */}
                        <div className="absolute bottom-4 right-4 bg-accent text-white px-4 py-2 rounded-full shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                          <span className="font-heading text-sm font-semibold">Rs. {relItem.price}</span>
                        </div>

                        {/* Featured Badge */}
                        {relItem.is_featured && (
                          <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                            <Star size={12} className="text-accent fill-accent" />
                            Featured
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 pt-5">
                        {relItem.categories?.name && (
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-2 block">
                            {relItem.categories.name}
                          </span>
                        )}

                        <div className="relative inline-block mb-3">
                          <h3 className="text-xl font-heading text-primary leading-tight">
                            {relItem.name}
                          </h3>
                          <span className="absolute -bottom-1 left-0 w-8 h-[2px] bg-accent transition-all duration-500 group-hover:w-full"></span>
                        </div>

                        <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-4">
                          {relItem.description || 'A signature Mazi creation.'}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="text-xs uppercase tracking-widest text-muted font-semibold">
                            View Item
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
            </div>
          </Reveal>
        )}

        {/* ============ BOTTOM CTA BANNER ============ */}
        <Reveal delay={0.4}>
          <div className="mt-24 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#3A2E26] to-primary p-10 md:p-14 text-center">
            
            {/* Decorative Blobs */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <Coffee size={32} className="text-accent mx-auto mb-6" />
              <h3 className="text-3xl md:text-4xl font-heading text-white mb-4 leading-tight">
                Come taste the
                <br />
                <span className="italic font-normal opacity-80">Mazi experience</span>
              </h3>
              <p className="text-white/60 text-base mb-8 max-w-lg mx-auto">
                Visit our backyard café for specialty coffee, warm conversations, and a digital detox.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link 
                  to="/menu" 
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-primary rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-white transition-all duration-300"
                >
                  Full Menu
                  <ArrowUpRight size={14} />
                </Link>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/20 text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/20 transition-all duration-300"
                >
                  Find Us
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
};

export default MenuItemPage;