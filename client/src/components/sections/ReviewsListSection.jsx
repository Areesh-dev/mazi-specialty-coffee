import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import SectionHeading from '../common/SectionHeading';
import { Star, User } from 'lucide-react';

const ReviewsListSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/reviews');
        setReviews(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return null;
  if (reviews.length === 0) return null;

  const half = Math.ceil(reviews.length / 2);
  let row1 = reviews.slice(0, half);
  let row2 = reviews.slice(half);

  const minCards = 6;
  while (row1.length < minCards) row1 = [...row1, ...row1];
  while (row2.length < minCards) row2 = [...row2, ...row2];

  const row1Display = [...row1, ...row1];
  const row2Display = [...row2, ...row2];

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 45s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 45s linear infinite;
        }
        /* Hover par animation rokne ke liye */
        .marquee-container:hover .animate-marquee-left,
        .marquee-container:hover .animate-marquee-right {
          animation-play-state: paused;
        }
      `}</style>

      <div className="container mx-auto px-4 md:px-8 mb-12">
        <SectionHeading 
          eyebrow="Testimonials" 
          title="We love what we do, and they love the results." 
          subtitle="Real experiences from our community." 
        />
      </div>

      <div className="marquee-container space-y-6 relative">
        
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <div className="flex gap-6 w-max animate-marquee-left">
            {row1Display.map((review, index) => (
              <ReviewCard key={`r1-${review.id}-${index}`} review={review} />
            ))}
          </div>
        </div>

        {row2Display.length > 0 && (
          <div className="flex overflow-hidden">
            <div className="flex gap-6 w-max animate-marquee-right">
              {row2Display.map((review, index) => (
                <ReviewCard key={`r2-${review.id}-${index}`} review={review} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

const ReviewCard = ({ review }) => {
  return (
    <div className="w-[350px] shrink-0 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-auto min-h-[220px] transition-shadow hover:shadow-md">
      <div>
        <div className="flex gap-1 text-accent mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              fill={i < review.rating ? "currentColor" : "none"} 
              className={i < review.rating ? "text-accent" : "text-gray-300"} 
            />
          ))}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          "{review.review_text}"
        </p>
      </div>
      
      <div className="flex items-center gap-3 border-t border-gray-100 pt-4 mt-auto">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shrink-0">
          {review.image_url ? (
            <img src={review.image_url} alt={review.customer_name} className="w-full h-full object-cover" />
          ) : (
            <User className="text-gray-400" size={20} />
          )}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{review.customer_name}</h4>
          <p className="text-xs text-gray-500">
            Verified Guest • {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewsListSection;