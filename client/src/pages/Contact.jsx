import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import Reveal from '../components/common/Reveal';
import { MapPin, Phone, Clock, Mail, Instagram, ArrowUpRight, Coffee, Navigation } from 'lucide-react';

const Contact = () => {
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await api.get('/content/contact');
        if (response.data) setContactInfo(response.data.content);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContact();
  }, []);

  const contactItems = [
    {
      icon: MapPin,
      label: 'Location',
      value: contactInfo?.address || 'Karachi, Pakistan',
      href: null,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: contactInfo?.phone || '+92 300 0000000',
      href: `tel:${(contactInfo?.phone || '+923000000000').replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: contactInfo?.email || 'hello@mazicoffee.com',
      href: `mailto:${contactInfo?.email || 'hello@mazicoffee.com'}`,
    },
    {
      icon: Clock,
      label: 'Opening Hours',
      value: contactInfo?.hours || 'Daily: 4:00 PM - 1:00 AM',
      href: null,
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@mazicoffee',
      href: contactInfo?.instagram || 'https://instagram.com',
    },
  ];

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-40 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
        
        {/* ============ HEADING ============ */}
        <Reveal className="max-w-3xl mx-auto text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-accent/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-accent font-bold tracking-[0.35em] uppercase text-[10px] md:text-xs">
              Get in Touch
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <div className="w-12 h-[1px] bg-accent/60" />
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading text-primary leading-[1.1] tracking-tight mb-6">
            Come say hello
            <br />
            <span className="italic font-normal opacity-70">at our backyard</span>
          </h1>
          
        </Reveal>

        {/* ============ CONTENT GRID ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* ============ LEFT: Contact Info ============ */}
          <Reveal className="lg:col-span-2">
            <div className="bg-surface rounded-3xl p-8 md:p-10 h-full border border-border">
              
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Coffee size={22} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted block leading-none mb-1">
                    Contact
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    Our Details
                  </span>
                </div>
              </div>

              {/* Contact Items */}
              <div className="space-y-1">
                {contactItems.map((item, index) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-all duration-300 group">
                      <div className="w-11 h-11 rounded-xl bg-white border border-border flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300">
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase tracking-[0.25em] text-muted block mb-1">
                          {item.label}
                        </span>
                        <span className="text-sm font-semibold text-primary block truncate group-hover:text-accent transition-colors">
                          {item.value}
                        </span>
                      </div>
                      {item.href && (
                        <ArrowUpRight 
                          size={16} 
                          className="text-muted/40 group-hover:text-accent group-hover:rotate-45 transition-all duration-300 shrink-0 mt-2" 
                        />
                      )}
                    </div>
                  );

                  return (
                    <div key={index}>
                      {item.href ? (
                        <a 
                          href={item.href} 
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Decorative Bottom Line */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
                <div className="w-8 h-[1px] bg-accent" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted">
                  Est. 2024 • Karachi
                </span>
              </div>

            </div>
          </Reveal>

          {/* ============ RIGHT: Map ============ */}
          <Reveal delay={0.15} className="lg:col-span-3">
            <div className="relative h-full min-h-[500px] rounded-3xl overflow-hidden shadow-[0_25px_70px_rgb(74,59,50,0.15)] group">
              
              {/* Back Frame Decoration */}
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-accent/20 rounded-3xl hidden md:block -z-10" />
              
              {/* Map Iframe */}
              <iframe 
                title="Mazi Location"
                src={contactInfo?.map_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115873.99247767401!2d67.01067185!3d24.8607343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e06651d4bbf%3A0x9cf92f44555a0c23!2sKarachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"} 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '500px', filter: 'grayscale(0.3) contrast(1.05)' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="relative z-10 group-hover:filter-none transition-all duration-700"
              />

              {/* Floating Info Card - Bottom Left */}
              <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-border max-w-[280px] hidden md:block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Navigation size={18} className="text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted block leading-none mb-1">
                      Find Us
                    </span>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Karachi, Pakistan
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {contactInfo?.hours || 'Open Daily: 4:00 PM — 1:00 AM'}
                </p>
              </div>

              {/* Floating CTA - Top Right */}
              <a 
                href={`https://www.google.com/maps/search/${encodeURIComponent(contactInfo?.address || 'Karachi, Pakistan')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-6 right-6 z-20 group/map bg-primary text-white rounded-full px-5 py-3 flex items-center gap-3 hover:bg-accent transition-all duration-300 shadow-2xl hover:scale-105"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Get Directions
                </span>
                <ArrowUpRight size={14} className="group-hover/map:rotate-45 transition-transform duration-300" />
              </a>

            </div>
          </Reveal>

        </div>

        {/* ============ BOTTOM CTA BANNER ============ */}
        <Reveal delay={0.3}>
          <div className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#3A2E26] to-primary p-10 md:p-16 text-center">
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <Coffee size={32} className="text-accent mx-auto mb-6" />
              <h3 className="text-3xl md:text-4xl font-heading text-white mb-4 leading-tight">
                Planning a visit?
              </h3>
              <p className="text-white/60 text-base md:text-lg mb-8 max-w-lg mx-auto">
                Whether it's a first date, a friend reunion, or a solo coffee break — Mazi is your backyard.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a 
                  href={contactInfo?.instagram || 'https://instagram.com'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-white transition-all duration-300"
                >
                  <Instagram size={14} /> Follow Us
                </a>
                <a 
                  href={`tel:${(contactInfo?.phone || '+923000000000').replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/20 transition-all duration-300"
                >
                  <Phone size={14} /> Call Us
                </a>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
};

export default Contact;