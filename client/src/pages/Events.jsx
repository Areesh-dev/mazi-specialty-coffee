import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import Reveal from '../components/common/Reveal';
import { Calendar, MapPin, Clock, Loader2, ArrowUpRight, Sparkles } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-40 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* ============ HEADING ============ */}
        <Reveal className="max-w-3xl mx-auto text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-accent/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-accent font-bold tracking-[0.35em] uppercase text-[10px] md:text-xs">
              Gatherings
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <div className="w-12 h-[1px] bg-accent/60" />
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading text-primary leading-[1.1] tracking-tight mb-6">
            Past & Present
            <br />
            <span className="italic font-normal opacity-70">moments at Mazi</span>
          </h1>
        </Reveal>

        {/* ============ CONTENT ============ */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-accent" size={40} />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">Loading Events</span>
          </div>
        ) : events.length === 0 ? (
          <EmptyState 
            title="No events yet" 
            description="Check back soon for upcoming gatherings." 
            icon={Calendar}
          />
        ) : (
          <div className="max-w-7xl mx-auto space-y-20 md:space-y-28">
            {events.map((event, index) => {
              const isReversed = index % 2 === 1;
              return (
                <Reveal key={event.id} delay={index * 0.1}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
                    
                    {/* ============ IMAGE SIDE ============ */}
                    <div className={`relative ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                      
                      {/* Back Frame Decoration */}
                      <div className={`absolute -top-4 ${isReversed ? '-right-4' : '-left-4'} w-full h-full border-2 border-accent/20 rounded-3xl hidden md:block`} />
                      
                      {/* Main Image Container */}
                      <Link 
                        to={`/events/${event.slug}`}
                        className="relative group rounded-3xl overflow-hidden shadow-[0_25px_70px_rgb(74,59,50,0.2)] h-full min-h-[420px] block"
                      >
                        <img 
                          src={event.cover_image_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800'} 
                          alt={event.title} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" 
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      
                        {/* Date Badge - Bottom Right (Premium Editorial) */}
                        <div className="absolute bottom-5 right-5 bg-accent text-white rounded-2xl px-5 py-3 shadow-2xl text-center">
                          <span className="text-[10px] uppercase tracking-widest block opacity-90 leading-none mb-1">
                            {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="font-heading text-3xl font-bold leading-none block">
                            {new Date(event.event_date).getDate()}
                          </span>
                          <span className="text-[10px] uppercase tracking-widest block opacity-90 leading-none mt-1">
                            {new Date(event.event_date).getFullYear()}
                          </span>
                        </div>
                      </Link>
                    </div>

                    {/* ============ CONTENT SIDE ============ */}
                    <div className={`${isReversed ? 'lg:order-1' : 'lg:order-2'} flex flex-col justify-center py-4`}>
                      
                      {/* Meta Info Row: Date Chip + Time + Location */}
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface rounded-full border border-border">
                          <Calendar size={14} className="text-accent" />
                          <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                            {new Date(event.event_date).toLocaleDateString('en-US', { 
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        {event.event_time && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface rounded-full border border-border">
                            <Clock size={14} className="text-accent" />
                            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                              {event.event_time}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <Link to={`/events/${event.slug}`} className="group/title inline-block">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading text-primary leading-[1.15] tracking-tight mb-4 transition-colors duration-300 group-hover/title:text-accent">
                          {event.title}
                        </h3>
                      </Link>
                      <div className="w-20 h-[3px] bg-accent mb-6" />

                      {/* Location */}
                      {event.location && (
                        <div className="flex items-start gap-3 mb-6">
                          <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-muted block mb-1">
                              Location
                            </span>
                            <span className="text-sm font-semibold text-primary">
                              {event.location}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-muted text-base md:text-lg leading-relaxed mb-8 max-w-lg line-clamp-3">
                        {event.description}
                      </p>

                      {/* CTA */}
                      <Link 
                        to={`/events/${event.slug}`}
                        className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg self-start"
                      >
                        <span className="text-xs uppercase tracking-[0.2em]">
                          View Event
                        </span>
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                          <ArrowUpRight size={14} className="group-hover/btn:rotate-45 transition-transform duration-300" />
                        </div>
                      </Link>
                    </div>

                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;