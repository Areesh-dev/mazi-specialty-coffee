import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import Reveal from '../components/common/Reveal';
import { Loader2, ArrowUpRight, Users, Calendar, Sparkles } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

const Collaborations = () => {
  const [collabs, setCollabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollabs = async () => {
      try {
        const response = await api.get('/collaborations');
        setCollabs(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollabs();
  }, []);

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute top-40 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* HEADING */}
        <Reveal className="max-w-3xl mx-auto text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-accent/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-accent font-bold tracking-[0.35em] uppercase text-[10px] md:text-xs">
              Partnerships
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <div className="w-12 h-[1px] bg-accent/60" />
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading text-primary leading-[1.1] tracking-tight mb-6">
            Collaborations
            <br />
            <span className="italic font-normal opacity-70">that tell stories</span>
          </h1>
        </Reveal>

        {/* CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-accent" size={40} />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">Loading Collaborations</span>
          </div>
        ) : collabs.length === 0 ? (
          <EmptyState 
            title="No collaborations yet" 
            description="We are always looking for new partners. Stay tuned!" 
            icon={Users}
          />
        ) : (
          <div className="max-w-7xl mx-auto space-y-20 md:space-y-28">
            {collabs.map((collab, index) => {
              const isReversed = index % 2 === 1;
              return (
                <Reveal key={collab.id} delay={index * 0.1}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
                    
                    {/* IMAGE SIDE */}
                    <div className={`relative ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className={`absolute -top-4 ${isReversed ? '-right-4' : '-left-4'} w-full h-full border-2 border-accent/20 rounded-3xl hidden md:block`} />
                      
                      <div className="relative group rounded-3xl overflow-hidden shadow-[0_25px_70px_rgb(74,59,50,0.2)] h-full min-h-[400px]">
                        <img 
                          src={collab.image_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800'} 
                          alt={collab.title} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" 
                        />
                        
                        {/* Gradient Overlay - subtle */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        
                        {/* Collaboration Badge - Top Left */}
                        <div className="absolute top-5 left-5 flex items-center gap-2 bg-white/95 backdrop-blur-md text-primary px-4 py-2 rounded-full shadow-lg">
                          <Sparkles size={14} className="text-accent" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            Collaboration
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CONTENT SIDE */}
                    <div className={`${isReversed ? 'lg:order-1' : 'lg:order-2'} flex flex-col justify-center py-4`}>
                      
                      {/* Partner Label + Name */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                          <Users size={18} />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.3em] text-muted block">
                            In Partnership With
                          </span>
                          <span className="text-sm font-semibold text-primary">
                            {collab.partner_name}
                          </span>
                        </div>
                      </div>

                      {/* Date Chip */}
                      {collab.event_date && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface rounded-full border border-border mb-5 self-start">
                          <Calendar size={14} className="text-accent" />
                          <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                            {new Date(collab.event_date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading text-primary leading-[1.15] tracking-tight mb-4">
                        {collab.title}
                      </h3>
                      <div className="w-16 h-[3px] bg-accent mb-6" />

                      {/* Description */}
                      <p className="text-muted text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                        {collab.description}
                      </p>

                      {collab.external_url ? (
                        <a 
                          href={collab.external_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg self-start"
                        >
                          <span className="text-xs uppercase tracking-[0.2em]">
                            Learn More
                          </span>
                          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                            <ArrowUpRight size={14} className="group-hover/btn:rotate-45 transition-transform duration-300" />
                          </div>
                        </a>
                      ) : (
                        <div className="inline-flex items-center gap-3 self-start">
                          <div className="w-10 h-[1px] bg-accent" />
                          <span className="text-accent font-semibold uppercase text-xs tracking-[0.3em]">
                            Mazi Collaboration
                          </span>
                        </div>
                      )}
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

export default Collaborations;