import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, ArrowRight, Coffee, MousePointer2 } from 'lucide-react';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const fetchSlides = async () => {
            try {
                const response = await api.get('/hero', { signal: controller.signal });
                setSlides(response.data);
            } catch (err) {
                if (err.name === 'AbortError') return; 
                console.error('Failed to load hero slides', err);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchSlides();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [slides]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#1A1410]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-accent" size={40} />
                <span className="text-xs uppercase tracking-[0.3em] text-white/40">Loading Experience</span>
            </div>
        </div>
    );
    if (slides.length === 0) return null;

    const slide = slides[currentIndex];

    return (
        <section className="relative h-screen w-full overflow-hidden bg-[#1A1410]">
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                >
                    <img 
                        src={slide.image_url} 
                        alt={slide.title} 
                        className="w-full h-full object-cover" 
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    <div className="absolute inset-0 bg-[#4A3B32]/20 mix-blend-overlay" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute top-32 right-12 hidden lg:grid grid-cols-5 gap-2 opacity-20 z-10">
                {[...Array(25)].map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-accent" />
                ))}
            </div>

            <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 z-10">
                <div className="w-[1px] h-16 bg-white/20" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 rotate-90 whitespace-nowrap origin-center">
                    Est. 2024 • Karachi
                </span>
                <div className="w-[1px] h-16 bg-white/20" />
            </div>

            <div className="relative z-10 h-full container mx-auto px-6 md:px-16 lg:px-24 flex flex-col justify-center">
                <div className="max-w-3xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slide.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="flex items-center gap-3 mb-6"
                            >
                                <div className="w-12 h-[2px] bg-accent" />
                                <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs">
                                    {slide.eyebrow || 'Welcome to Mazi'}
                                </span>
                            </motion.div>

                            <div className="overflow-hidden mb-6">
                                <motion.h1 
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                    className="text-5xl md:text-7xl lg:text-8xl font-heading text-white leading-[1.05] tracking-tight"
                                >
                                    {slide.title}
                                </motion.h1>
                            </div>

                            {slide.description && (
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.6 }}
                                    className="text-lg md:text-xl text-white/70 mb-10 max-w-xl leading-relaxed font-light"
                                >
                                    {slide.description}
                                </motion.p>
                            )}

                            {slide.cta_text && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9, duration: 0.6 }}
                                    className="flex flex-wrap items-center gap-6"
                                >
                                   
                                    <Link 
                                        to={slide.cta_url || '/'} 
                                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-accent text-primary font-bold tracking-wider uppercase text-xs overflow-hidden rounded-full"
                                    >
                                        <span className="relative z-10">{slide.cta_text}</span>
                                        <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                        
                                        
                                        <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                                    </Link>

                                   
                                    <div className="hidden md:flex items-center gap-3 text-white/50">
                                        <MousePointer2 size={16} className="text-accent animate-bounce" />
                                        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to Explore</span>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
=
            {slides.length > 1 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-8 right-6 md:right-12 z-20 flex items-center gap-6"
                >
                    
                    <div className="hidden md:flex items-baseline gap-2 font-heading">
                        <span className="text-3xl text-white">
                            {String(currentIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="text-white/30 text-sm">/</span>
                        <span className="text-white/40 text-sm">
                            {String(slides.length).padStart(2, '0')}
                        </span>
                    </div>

                    <div className="hidden md:block w-[1px] h-10 bg-white/20" />

                    <div className="flex gap-3">
                        <button 
                            onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)} 
                            className="group w-12 h-12 rounded-full border border-white/20 hover:border-accent hover:bg-accent flex items-center justify-center text-white hover:text-primary backdrop-blur-sm transition-all duration-300"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <button 
                            onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)} 
                            className="group w-12 h-12 rounded-full border border-white/20 hover:border-accent hover:bg-accent flex items-center justify-center text-white hover:text-primary backdrop-blur-sm transition-all duration-300"
                            aria-label="Next slide"
                        >
                            <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            )}

            {slides.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 z-20 flex gap-1 px-6 md:px-12">
                    {slides.map((s, index) => (
                        <button
                            key={s.id}
                            onClick={() => setCurrentIndex(index)}
                            className="flex-1 h-[2px] bg-white/10 overflow-hidden group cursor-pointer"
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            <div 
                                className={`h-full bg-accent transition-all duration-500 ${
                                    index === currentIndex 
                                        ? 'w-full' 
                                        : index < currentIndex 
                                        ? 'w-full opacity-40' 
                                        : 'w-0 group-hover:w-full'
                                }`} 
                            />
                        </button>
                    ))}
                </div>
            )}

        </section>
    );
};

export default HeroSlider;