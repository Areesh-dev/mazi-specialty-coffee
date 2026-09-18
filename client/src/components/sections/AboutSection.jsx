import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import Reveal from '../common/Reveal';
import { Coffee, Heart, Users, Quote, Sparkles } from 'lucide-react';

const AboutSection = () => {
    const [content, setContent] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchAbout = async () => {
            try {
                const response = await api.get('/content/about', { signal: controller.signal });
                if (response.data) setContent(response.data.content);
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error('Failed to load about content', err);
            }
        };

        fetchAbout();
        return () => controller.abort();
    }, []);

    if (!content) return null;

    const features = [
        { 
            icon: Coffee, 
            title: 'Specialty Brews', 
            description: 'Handcrafted with love',
            number: '01'
        },
        { 
            icon: Users, 
            title: 'Community First', 
            description: 'A space for everyone',
            number: '02'
        },
    ];

    return (
        <section className="py-28 bg-background relative overflow-hidden">
            
            <div className="absolute top-20 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    
                    <Reveal y={30}>
                        <div className="relative">
                            
                            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-accent/30 rounded-2xl hidden md:block" />
                            
                            <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_60px_rgb(74,59,50,0.2)]">
                                <img 
                                    src={content.image_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop'} 
                                    alt="Mazi Cafe" 
                                    className="w-full h-[550px] object-cover hover:scale-105 transition-transform duration-1000" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-2xl p-6 shadow-2xl hidden md:flex flex-col items-center justify-center w-40 h-40 border-4 border-background">
                                <Sparkles size={20} className="text-accent mb-2" />
                                <span className="text-[10px] uppercase tracking-widest text-white/60">Established</span>
                                <span className="font-heading text-3xl font-bold text-accent leading-none my-1">2024</span>
                                <span className="text-[10px] uppercase tracking-widest text-white/60">Karachi</span>
                            </div>

                            <div className="absolute -top-8 -right-8 w-24 h-24 hidden lg:grid grid-cols-4 gap-2 opacity-40">
                                {[...Array(16)].map((_, i) => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent" />
                                ))}
                            </div>

                        </div>
                    </Reveal>

                    <Reveal delay={0.2} y={30}>
                        
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-[2px] bg-accent" />
                            <span className="text-accent font-bold tracking-[0.2em] uppercase text-xs">Our Story</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-primary mb-6 leading-tight">
                            {content.heading || 'A Nostalgic Backyard Escape'}
                        </h2>
                        <p className="text-muted text-lg leading-relaxed mb-10">
                            {content.body || 'Mazi is more than just a coffee shop. It is a tribute to the old Karachi, a place where time slows down and conversations flow freely.'}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {features.map((feature, index) => (
                                <div 
                                    key={index}
                                    className="group relative p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-accent/30 transition-all duration-500 hover:-translate-y-1"
                                >
                                    <span className="absolute top-4 right-4 text-[10px] font-bold text-accent/40 tracking-widest font-mono">
                                        {feature.number}
                                    </span>
                                    
                                    <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                                        <feature.icon size={22} />
                                    </div>
                                    <h4 className="font-heading text-lg text-primary mb-1">
                                        {feature.title}
                                    </h4>
                                    <p className="text-xs text-muted">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="relative bg-gradient-to-br from-primary to-[#3A2E26] rounded-2xl p-8 text-white shadow-[0_15px_40px_rgb(74,59,50,0.25)] overflow-hidden">
                            <Quote size={120} className="absolute -top-4 -right-4 text-white/5" strokeWidth={1} />
                            
                            <div className="relative z-10">
                                <Quote size={28} className="text-accent mb-4" />
                                <p className="font-heading text-xl md:text-2xl italic leading-relaxed text-white/95">
                                    "{content.quote || 'Where every cup tells a story of home.'}"
                                </p>
                                <div className="flex items-center gap-3 mt-6">
                                    <div className="w-12 h-[1px] bg-accent" />
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                                        Mazi Specialty Coffee
                                    </span>
                                </div>
                            </div>
                        </div>

                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;