import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';
import Reveal from '../common/Reveal';
import SectionHeading from '../common/SectionHeading';
import { ArrowUpRight, Star } from 'lucide-react';

const FeaturedMenuSection = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/menu?featured=true&available=true');
        setItems(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeatured();
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading 
          eyebrow="Signature" 
          title="Featured Creations" 
          subtitle="Our most loved beverages, crafted to perfection." 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.1}>
              
              <Link 
                to={`/menu/${item.slug}`} 
                className="group relative block bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(74,59,50,0.15)] transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image_url || 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop'} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                    <Star size={12} className="text-accent fill-accent" />
                    Featured
                  </div>

                  <div className="absolute bottom-4 right-4 bg-accent text-white px-4 py-2 rounded-full shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <span className="font-heading text-sm font-semibold">Rs. {item.price}</span>
                  </div>
                </div>
                <div className="p-6 pt-5">
                  {item.categories?.name && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-2 block">
                      {item.categories.name}
                    </span>
                  )}

                  <div className="relative inline-block mb-3">
                    <h3 className="text-xl font-heading text-primary leading-tight">
                      {item.name}
                    </h3>
                    <span className="absolute -bottom-1 left-0 w-8 h-[2px] bg-accent transition-all duration-500 group-hover:w-full"></span>
                  </div>

                  <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-4">
                    {item.description || 'A signature Mazi creation, crafted with care.'}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs uppercase tracking-widest text-muted font-semibold">
                      View Details
                    </span>
                    <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300">
                      <ArrowUpRight size={16} />
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

export default FeaturedMenuSection;