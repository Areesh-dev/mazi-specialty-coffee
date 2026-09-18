import { Link } from 'react-router-dom';
import { Coffee, Instagram, Facebook, MapPin, Phone, Clock, Mail, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { logoUrl, siteName } = useTheme();

  return (
    <footer className="relative bg-primary text-white/80 overflow-hidden">
      
      <div className="absolute inset-x-0 top-10 select-none pointer-events-none">
        <h1 className="text-[180px] md:text-[280px] lg:text-[360px] font-heading font-bold text-white/[0.03] text-center leading-none tracking-tighter whitespace-nowrap">
          MAZI
        </h1>
      </div>

      <div className="absolute top-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="absolute top-16 right-8 hidden lg:grid grid-cols-5 gap-2 opacity-20">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-accent" />
        ))}
      </div>

      <div className="relative z-10 pt-24 pb-8">
        <div className="container mx-auto px-4 md:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 pb-16 border-b border-white/10">
            
            <div className="lg:col-span-7">
              
              <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={siteName} 
                    className="h-14 w-auto object-contain" 
                  />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <Coffee className="text-primary" size={26} />
                    </div>
                    <span className="font-heading text-4xl font-bold text-white tracking-tight">
                      {siteName || 'MAZI'}
                    </span>
                  </>
                )}
              </Link>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-[2px] bg-accent" />
                <span className="text-accent font-bold tracking-[0.25em] uppercase text-xs">
                  Since 2024 • Karachi
                </span>
              </div>

              <p className="max-w-lg text-white/60 leading-relaxed text-lg mb-10 font-light">
                A nostalgic backyard café experience in the heart of Karachi. 
                Specialty coffee, warm conversations, and a digital detox — 
                where every cup tells a story of home.
              </p>

              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40 mr-2">
                  Follow Us
                </span>
                <div className="w-8 h-[1px] bg-white/20" />
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <h4 className="text-white font-heading text-2xl mb-8 flex items-center gap-3">
                Visit Us
                <span className="w-8 h-[2px] bg-accent" />
              </h4>

              <ul className="space-y-6">
                <li className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-primary group-hover:border-accent transition-all duration-300">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-white/40 block mb-1">Location</span>
                    <span className="text-white/80">Karachi, Pakistan</span>
                  </div>
                </li>

                <li className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-primary group-hover:border-accent transition-all duration-300">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-white/40 block mb-1">Phone</span>
                    <a href="tel:+923000000000" className="text-white/80 hover:text-accent transition-colors">
                      +92 300 0000000
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-primary group-hover:border-accent transition-all duration-300">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-white/40 block mb-1">Open Daily</span>
                    <span className="text-white/80">4:00 PM — 1:00 AM</span>
                  </div>
                </li>
              </ul>

              <Link 
                to="/contact" 
                className="mt-8 inline-flex items-center gap-2 text-accent text-sm font-bold uppercase tracking-widest hover:gap-3 transition-all duration-300 group"
              >
                Get Directions
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            <p className="text-xs text-white/40 tracking-wider text-center md:text-left">
              &copy; {currentYear} {siteName || 'Mazi Specialty Coffee'}. 
              <span className="text-white/20 mx-2">•</span>
              Crafted with <span className="text-accent">♥</span> in Karachi
            </p>

            <div className="hidden md:flex items-center gap-3 text-white/20">
              <div className="w-16 h-[1px] bg-white/10" />
              <Coffee size={14} />
              <div className="w-16 h-[1px] bg-white/10" />
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              Digital Detox Café
            </p>

          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;