import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Loader2, Coffee, Calendar, Users, LayoutGrid,
  ArrowUpRight, TrendingUp, Clock, Command, CornerDownLeft
} from 'lucide-react';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('mazi_recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved).slice(0, 4));
  }, []);

  
  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 4);
    setRecentSearches(updated);
    localStorage.setItem('mazi_recent_searches', JSON.stringify(updated));
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults(null);
      setActiveFilter('all');
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults(null);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const hasResults = results && Object.values(results).some(arr => arr.length > 0);
  const totalResults = results ? Object.values(results).reduce((sum, arr) => sum + arr.length, 0) : 0;

  
  const filterTabs = [
    { id: 'all', label: 'All', icon: Search, count: totalResults },
    { id: 'menu', label: 'Menu', icon: Coffee, count: results?.menu?.length || 0 },
    { id: 'events', label: 'Events', icon: Calendar, count: results?.events?.length || 0 },
    { id: 'collaborations', label: 'Collabs', icon: Users, count: results?.collaborations?.length || 0 },
    { id: 'categories', label: 'Categories', icon: LayoutGrid, count: results?.categories?.length || 0 },
  ];

  const popularSearches = ['Cold Brew', 'Iced Latte', 'Events', 'Specialty Coffee'];

  const shouldShowResult = (category) => activeFilter === 'all' || activeFilter === category;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[#1A1410]/95 backdrop-blur-2xl" />

          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none select-none">
            <h1 className="text-[200px] md:text-[300px] font-heading font-bold text-white/[0.02] leading-none tracking-tighter">
              SEARCH
            </h1>
          </div>

          <div className="relative h-full flex flex-col">

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-end items-center px-6 md:px-12 py-6"
            >
              <button
                onClick={onClose}
                className="group flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 hover:border-accent hover:bg-accent/10 transition-all duration-300"
                aria-label="Close search"
              >
                <X size={20} className="text-white/70 group-hover:text-accent group-hover:rotate-90 transition-all duration-300" />
              </button>
            </motion.div>

            {/* Search Input Area */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="px-6 md:px-12 max-w-5xl w-full mx-auto"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-[2px] bg-accent" />
                <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs">
                  Search Mazi
                </span>
              </div>

              {/* Input */}
              <div className="relative group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors duration-300" size={32} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent border-b-2 border-white/10 focus:border-accent text-3xl md:text-5xl font-heading text-white py-6 pl-12 md:pl-14 pr-12 outline-none transition-all duration-500 placeholder:text-white/20 placeholder:italic"
                />
                {loading && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Loader2 className="text-accent animate-spin" size={28} />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Filter Tabs (only show when results exist) */}
            <AnimatePresence>
              {hasResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="px-6 md:px-12 max-w-5xl w-full mx-auto mt-8"
                >
                  <div className="flex flex-wrap gap-2">
                    {filterTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveFilter(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${activeFilter === tab.id
                            ? 'bg-accent text-primary'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                          }`}
                      >
                        <tab.icon size={14} />
                        {tab.label}
                        {tab.count > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeFilter === tab.id ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/50'
                            }`}>
                            {tab.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ============ RESULTS AREA ============ */}
            <div className="flex-1 overflow-y-auto mt-8 px-6 md:px-12 pb-12">
              <div className="max-w-5xl w-full mx-auto">

                {/* EMPTY STATE: Nothing typed yet */}
                {!query.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4 text-white/40">
                          <Clock size={14} />
                          <span className="text-xs uppercase tracking-widest font-semibold">Recent Searches</span>
                        </div>
                        <div className="space-y-2">
                          {recentSearches.map((term, i) => (
                            <button
                              key={i}
                              onClick={() => setQuery(term)}
                              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-accent/30 transition-all duration-300 group text-left"
                            >
                              <span className="text-white/70 text-sm group-hover:text-white transition-colors">{term}</span>
                              <ArrowUpRight size={16} className="text-white/20 group-hover:text-accent group-hover:rotate-45 transition-all duration-300" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Searches */}
                    <div>
                      <div className="flex items-center gap-2 mb-4 text-white/40">
                        <TrendingUp size={14} />
                        <span className="text-xs uppercase tracking-widest font-semibold">Popular</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term, i) => (
                          <button
                            key={i}
                            onClick={() => setQuery(term)}
                            className="px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/5 hover:bg-accent hover:text-primary hover:border-accent text-white/70 text-sm transition-all duration-300"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* LOADING SKELETON */}
                {loading && query.trim().length >= 2 && (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 bg-white/[0.02] rounded-xl border border-white/5 animate-pulse">
                        <div className="w-12 h-12 rounded-lg bg-white/10" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-white/10 rounded w-1/3" />
                          <div className="h-3 bg-white/5 rounded w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* NO RESULTS */}
                {query.trim().length >= 2 && !loading && !hasResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
                      <Search className="text-white/30" size={32} />
                    </div>
                    <h3 className="text-2xl font-heading text-white mb-3">No results found</h3>
                    <p className="text-white/40 mb-8 max-w-md mx-auto">
                      We could not find anything matching <span className="text-accent italic">"{query}"</span>.
                      Try a different keyword.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {popularSearches.slice(0, 3).map((term, i) => (
                        <button
                          key={i}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 hover:border-accent hover:text-accent text-white/60 text-sm transition-all duration-300"
                        >
                          Try "{term}"
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* RESULTS */}
                {hasResults && !loading && (
                  <div className="space-y-10">

                    {/* Result Count */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase tracking-widest text-white/40 font-semibold">
                        {totalResults} {totalResults === 1 ? 'Result' : 'Results'}
                      </span>
                      <div className="flex-1 h-[1px] bg-white/10" />
                    </div>

                    {/* Menu Results */}
                    {shouldShowResult('menu') && results.menu?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                      >
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                            <Coffee size={16} />
                          </div>
                          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Menu</h4>
                          <span className="text-xs text-white/30 font-mono">{results.menu.length}</span>
                        </div>
                        <div className="space-y-2">
                          {results.menu.map((item, i) => (
                            <Link
                              key={item.id}
                              to={`/menu/${item.slug}`}
                              onClick={() => { saveRecentSearch(query); onClose(); }}
                              className="group flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-accent/30 transition-all duration-300"
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                                  <Coffee size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="font-heading text-lg text-white block group-hover:text-accent transition-colors truncate">
                                    {item.name}
                                  </span>
                                  <span className="text-white/40 text-sm line-clamp-1">{item.description}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-accent font-semibold text-sm hidden md:block">Rs. {item.price}</span>
                                <ArrowUpRight size={18} className="text-white/20 group-hover:text-accent group-hover:rotate-45 transition-all duration-300" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Events Results */}
                    {shouldShowResult('events') && results.events?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                            <Calendar size={16} />
                          </div>
                          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Events</h4>
                          <span className="text-xs text-white/30 font-mono">{results.events.length}</span>
                        </div>
                        <div className="space-y-2">
                          {results.events.map((item) => (
                            <Link
                              key={item.id}
                              to={`/events/${item.slug}`}
                              onClick={() => { saveRecentSearch(query); onClose(); }}
                              className="group flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-accent/30 transition-all duration-300"
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                                  <Calendar size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="font-heading text-lg text-white block group-hover:text-accent transition-colors truncate">
                                    {item.title}
                                  </span>
                                  <span className="text-white/40 text-sm line-clamp-1">{item.description}</span>
                                </div>
                              </div>
                              <ArrowUpRight size={18} className="text-white/20 group-hover:text-accent group-hover:rotate-45 transition-all duration-300 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Collaborations Results */}
                    {shouldShowResult('collaborations') && results.collaborations?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                            <Users size={16} />
                          </div>
                          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Collaborations</h4>
                          <span className="text-xs text-white/30 font-mono">{results.collaborations.length}</span>
                        </div>
                        <div className="space-y-2">
                          {results.collaborations.map((item) => (
                            <Link
                              key={item.id}
                              to="/collaborations"
                              onClick={() => { saveRecentSearch(query); onClose(); }}
                              className="group flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-accent/30 transition-all duration-300"
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                                  <Users size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="font-heading text-lg text-white block group-hover:text-accent transition-colors truncate">
                                    {item.title}
                                  </span>
                                  <span className="text-white/40 text-sm">with {item.partner_name}</span>
                                </div>
                              </div>
                              <ArrowUpRight size={18} className="text-white/20 group-hover:text-accent group-hover:rotate-45 transition-all duration-300 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Categories Results */}
                    {shouldShowResult('categories') && results.categories?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                            <LayoutGrid size={16} />
                          </div>
                          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Categories</h4>
                          <span className="text-xs text-white/30 font-mono">{results.categories.length}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {results.categories.map((item) => (
                            <Link
                              key={item.id}
                              to={`/menu?category=${item.slug}`}
                              onClick={() => { saveRecentSearch(query); onClose(); }}
                              className="group flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-accent hover:bg-accent hover:text-primary text-white/80 transition-all duration-300"
                            >
                              <LayoutGrid size={14} className="group-hover:text-primary transition-colors" />
                              <span className="text-sm font-semibold">{item.name}</span>
                              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}

                  </div>
                )}

              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;