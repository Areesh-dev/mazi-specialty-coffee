import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';
import Reveal from '../common/Reveal';
import SectionHeading from '../common/SectionHeading';
import { ArrowUpRight } from 'lucide-react';

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading 
          eyebrow="Explore" 
          title="Our Menu Categories" 
          subtitle="From classic cold brews to artisanal specialties, find your perfect cup." 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {categories.map((cat, index) => (
            <Reveal key={cat.id} delay={index * 0.1}>
              
              <Link 
                to={`/menu?category=${cat.slug}`} 
                className="group relative block h-[420px] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_25px_60px_rgb(74,59,50,0.25)] transition-all duration-500 hover:-translate-y-2"
              >
                
                <img 
                  src={cat.image_url || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop'} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                
                <div className="absolute inset-3 border border-white/0 group-hover:border-white/20 rounded-xl transition-all duration-500 pointer-events-none" />

                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs font-heading font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:-translate-y-1">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8">
                  
                  <h3 className="text-3xl font-heading text-white mb-3 leading-tight">
                    {cat.name}
                  </h3>
                  <div className="w-10 h-[2px] bg-[#C27A5E] mb-4 transition-all duration-500 group-hover:w-20" />

                  <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-6 transform transition-all duration-500 group-hover:translate-y-0">
                    {cat.description || 'Discover our range of handcrafted beverages.'}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-white text-xs font-bold uppercase tracking-widest">
                      Explore Menu
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#C27A5E] group-hover:border-[#C27A5E] group-hover:scale-110 transition-all duration-500">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                </div>
              </Link>

            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;