import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Search, Coffee } from 'lucide-react';
import SearchOverlay from '../common/SearchOverlay';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  
  const { logoUrl, siteName } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Collaborations', path: '/collaborations' },
    { name: 'Events', path: '/events' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-500 py-2 ${
          isTransparent 
            ? 'bg-transparent border-transparent' 
            : 'bg-[#4A3B32]/85 backdrop-blur-xl border-b border-white/10 shadow-lg'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          
          <Link to="/" className="flex items-center gap-2 group">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={siteName} 
                className="h-12 w-auto object-contain" 
              />
            ) : (
              <>
                <Coffee className="text-[#C27A5E] group-hover:rotate-12 transition-transform duration-300" size={32} />
                <span className="font-heading text-2xl font-bold tracking-tight text-white">{siteName}</span>
              </>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name} 
                to={link.path} 
                className={({ isActive }) => 
                  `relative group text-xs font-medium tracking-[0.15em] uppercase transition-colors duration-300 ${isActive ? 'text-[#C27A5E]' : 'text-white/80 hover:text-white'}`
                }
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#C27A5E] transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} className="p-2 text-white/80 hover:text-[#C27A5E] transition-colors" aria-label="Search">
              <Search size={22} />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-white/80 hover:text-[#C27A5E]" aria-label="Toggle menu">
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-30 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden bg-[#4A3B32]/95 backdrop-blur-xl pt-24`}>
        <nav className="flex flex-col items-center gap-8 p-8">
          {navLinks.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path} 
              className={({ isActive }) => 
                `text-2xl font-heading transition-colors ${isActive ? 'text-[#C27A5E]' : 'text-white/80 hover:text-white'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <Link to="/admin/login" className="mt-8 text-sm uppercase tracking-widest text-[#C27A5E] hover:text-white transition-colors">Admin Login</Link>
        </nav>
      </div>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;