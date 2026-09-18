import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import Reveal from '../components/common/Reveal';
import { 
  ArrowLeft, Calendar, Clock, MapPin, Loader2, 
  Sparkles, ImageIcon, ArrowUpRight, Share2, Coffee, X 
} from 'lucide-react';

const EventDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${slug}`);
        setEvent(response.data);
      } catch (err) {
        console.error(err);
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug, navigate]);

  if (loading) return (
    <div className="pt-32 min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-accent" size={40} />
      <span className="text-xs uppercase tracking-[0.3em] text-muted">Loading Event</span>
    </div>
  );
  
  if (!event) return null;

  const hasGallery = event.gallery && event.gallery.length > 0;

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-40 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">

        {/* ============ BACK LINK ============ */}
        <Reveal>
          <Link 
            to="/events" 
            className="group inline-flex items-center gap-2 text-muted hover:text-accent transition-colors mb-10 text-xs font-bold uppercase tracking-[0.25em]"
          >
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Back to Events
          </Link>
        </Reveal>

        {/* ============ HERO IMAGE WITH FLOATING DATE BADGE ============ */}
        <Reveal delay={0.1}>
          <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_80px_rgb(74,59,50,0.2)] h-[450px] md:h-[600px] group">
            <img 
              src={event.cover_image_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200'} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105" 
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/95 backdrop-blur-md text-primary px-4 py-2 rounded-full shadow-lg">
              <Sparkles size={14} className="text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Event
              </span>
            </div>

            {/* Share Button */}
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: event.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all duration-300 shadow-lg"
              aria-label="Share event"
            >
              <Share2 size={16} />
            </button>

            {/* Bottom: Title on Image */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              {/* Meta chips */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white">
                  <Calendar size={14} className="text-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    {new Date(event.event_date).toLocaleDateString('en-US', { 
                      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
                    })}
                  </span>
                </div>
                {event.event_time && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white">
                    <Clock size={14} className="text-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                      {event.event_time}
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white leading-[1.1] tracking-tight max-w-4xl">
                {event.title}
              </h1>
            </div>

            {/* Floating Date Badge - Bottom Right */}
            <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 bg-accent text-white rounded-2xl px-6 py-4 shadow-2xl text-center hidden md:block">
              <span className="text-[10px] uppercase tracking-widest block opacity-90 leading-none mb-1">
                {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
              </span>
              <span className="font-heading text-4xl font-bold leading-none block">
                {new Date(event.event_date).getDate()}
              </span>
              <span className="text-[10px] uppercase tracking-widest block opacity-90 leading-none mt-1">
                {new Date(event.event_date).getFullYear()}
              </span>
            </div>
          </div>
        </Reveal>

        {/* ============ CONTENT SECTION ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-16">
          
          {/* LEFT: Description (Spans 2 cols) */}
          <Reveal delay={0.2} className="lg:col-span-2">
            <div className="bg-surface rounded-3xl p-8 md:p-10 border border-border h-full">
              
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Coffee size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted block leading-none mb-1">
                    The Story
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    About This Event
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-[1px] w-full bg-border mb-8" />

              {/* Description */}
              <div className="prose prose-lg max-w-none text-muted leading-relaxed whitespace-pre-line">
                {event.description || 'Join us for a special evening at Mazi Specialty Coffee.'}
              </div>

              {/* Bottom Info Row (Location) */}
              {event.location && (
                <div className="flex items-start gap-4 mt-10 pt-8 border-t border-border">
                  <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center text-accent shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-muted block mb-1">
                      Location
                    </span>
                    <span className="text-base font-semibold text-primary">
                      {event.location}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* RIGHT: Quick Info Sidebar */}
          <Reveal delay={0.3}>
            <div className="space-y-6">
              
              {/* Event Info Card */}
              <div className="bg-gradient-to-br from-primary via-[#3A2E26] to-primary rounded-3xl p-8 text-white shadow-[0_25px_60px_rgb(74,59,50,0.25)] relative overflow-hidden">
                
                {/* Decorative */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl" />
                
                <div className="relative z-10">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold block mb-4">
                    Event Details
                  </span>
                  
                  <div className="space-y-5">
                    {/* Date */}
                    <div className="flex items-start gap-4 pb-5 border-b border-white/10">
                      <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-accent shrink-0">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
                          Date
                        </span>
                        <span className="text-sm font-semibold">
                          {new Date(event.event_date).toLocaleDateString('en-US', { 
                            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Time */}
                    {event.event_time && (
                      <div className="flex items-start gap-4 pb-5 border-b border-white/10">
                        <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-accent shrink-0">
                          <Clock size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
                            Time
                          </span>
                          <span className="text-sm font-semibold">{event.event_time}</span>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-accent shrink-0">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
                            Location
                          </span>
                          <span className="text-sm font-semibold">{event.location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Share / CTA Card */}
              <div className="bg-surface rounded-3xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <Share2 size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted block leading-none mb-1">
                      Spread
                    </span>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      The Word
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: event.title, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="w-full py-3 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Share Event
                  <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
                </button>
              </div>

            </div>
          </Reveal>

        </div>

        {/* ============ GALLERY SECTION ============ */}
        {hasGallery && (
          <Reveal delay={0.4}>
            <div className="mt-24">
              
              {/* Section Header */}
              <div className="max-w-3xl mx-auto text-center mb-14">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-12 h-[1px] bg-accent/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-accent font-bold tracking-[0.35em] uppercase text-[10px] md:text-xs">
                    Gallery
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <div className="w-12 h-[1px] bg-accent/60" />
                </div>
                <h2 className="text-4xl md:text-5xl font-heading text-primary leading-tight mb-4">
                  Moments from
                  <br />
                  <span className="italic font-normal opacity-70">this gathering</span>
                </h2>
                
                <div className="flex items-center gap-2 mt-8 justify-center">
                  <div className="h-[1px] w-6 bg-primary/20" />
                  <div className="w-1 h-1 rounded-full bg-accent" />
                  <div className="h-[1px] w-6 bg-primary/20" />
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {event.gallery.map((img, index) => (
                  <Reveal key={img.id} delay={index * 0.05}>
                    <button 
                      onClick={() => setActiveImage(img.image_url)}
                      className={`group relative overflow-hidden rounded-2xl block w-full ${
                        index === 0 ? 'md:col-span-2 md:row-span-2 h-64 md:h-[420px]' : 'h-48 md:h-[200px]'
                      }`}
                    >
                      <img 
                        src={img.image_url} 
                        alt={`Gallery ${index}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[900ms] ease-out" 
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Hover Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-primary shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                          <ImageIcon size={18} />
                        </div>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* ============ LIGHTBOX MODAL ============ */}
        {activeImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveImage(null)}
          >
            <button 
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-all duration-300"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <img 
              src={activeImage} 
              alt="Gallery Preview" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* ============ BACK CTA ============ */}
        <Reveal delay={0.5}>
          <div className="mt-24 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#3A2E26] to-primary p-10 md:p-14 text-center">
            
            {/* Decorative */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <Coffee size={32} className="text-accent mx-auto mb-6" />
              <h3 className="text-3xl md:text-4xl font-heading text-white mb-4 leading-tight">
                Want to be a part of
                <br />
                <span className="italic font-normal opacity-80">the next one?</span>
              </h3>
              <p className="text-white/60 text-base mb-8 max-w-lg mx-auto">
                Explore more gatherings or reach out to plan your own event at Mazi.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link 
                  to="/events" 
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-primary rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-white transition-all duration-300"
                >
                  All Events
                  <ArrowUpRight size={14} />
                </Link>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/20 text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/20 transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
};

export default EventDetail;