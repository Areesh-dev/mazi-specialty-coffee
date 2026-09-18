import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import Reveal from '../common/Reveal';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

const UpcomingEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [flippedCard, setFlippedCard] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/upcoming-events');
        setEvents(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  const handleCardClick = (id) => {
    setFlippedCard(prev => (prev === id ? null : id));
  };

  return (
    <section className="py-24 bg-primary text-white">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading light eyebrow="Gatherings" title="Upcoming Events" subtitle="Join us for special evenings, tastings, and community gatherings." />
        
        {events.length === 0 ? (
          <EmptyState light title="Nothing scheduled just yet." description="Follow Mazi for the next gathering." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {events.map((event, index) => (
              <Reveal key={event.id} delay={index * 0.1}>
                
                <div 
                  className="group w-full h-[400px] [perspective:1000px] cursor-pointer"
                  onClick={() => handleCardClick(event.id)}
                >
                  <div 
                    className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] ${flippedCard === event.id ? '[transform:rotateY(180deg)]' : ''}`}
                  >
                    
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-sm overflow-hidden bg-black">
                      <img 
                        src={event.poster_url || 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800'} 
                        alt={event.title} 
                        className="w-full h-full object-cover opacity-80" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6 w-full">
                        <span className="text-accent text-xs font-bold uppercase tracking-widest mb-2 block">Upcoming Event</span>
                        <h3 className="text-2xl font-heading text-white leading-tight">{event.title}</h3>
                        <span className="text-white/50 text-[10px] uppercase tracking-wider mt-3 block lg:hidden">Tap for details</span>
                      </div>
                    </div>

                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-surface text-primary rounded-sm p-6 flex flex-col justify-between border border-border">
                      <div>
                        <h3 className="text-xl font-heading mb-3 line-clamp-2">{event.title}</h3>
                        <p className="text-muted text-sm mb-6 line-clamp-3">
                          {event.description || 'Join us for this special gathering at Mazi.'}
                        </p>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-3 text-muted">
                            <Calendar size={16} className="text-accent shrink-0" /> 
                            <span>{new Date(event.event_date).toDateString()}</span>
                          </div>
                          {event.event_time && (
                            <div className="flex items-center gap-3 text-muted">
                              <Clock size={16} className="text-accent shrink-0" /> 
                              <span>{event.event_time}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-3 text-muted">
                              <MapPin size={16} className="text-accent shrink-0" /> 
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {event.booking_url && (
                        <a 
                          href={event.booking_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()} 
                          className="mt-6 w-full py-3 bg-primary text-white text-center text-sm font-semibold uppercase tracking-wider rounded hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                        >
                          Book Now <ArrowRight size={16} />
                        </a>
                      )}
                    </div>

                  </div>
                </div>

              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEventsSection;