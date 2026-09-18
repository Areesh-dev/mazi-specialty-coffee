import { useState } from 'react';
import { api } from '../../lib/api';
import { z } from 'zod';
import Reveal from '../common/Reveal';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Star, Send, Coffee, Quote } from 'lucide-react';

const reviewSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  rating: z.number().min(1, 'Please select a rating').max(5),
  review_text: z.string().min(10, 'Review must be at least 10 characters').max(500, 'Review is too long'),
});

const ReviewFormSection = () => {
  const [formData, setFormData] = useState({ customer_name: '', rating: 0, review_text: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      reviewSchema.parse(formData);
      setIsSubmitting(true);
      await api.post('/reviews', formData);
      setIsSuccess(true);
      setFormData({ customer_name: '', rating: 0, review_text: '' });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach(e => fieldErrors[e.path[0]] = e.message);
        setErrors(fieldErrors);
      } else {
        setErrors({ submit: err.message || 'Failed to submit review. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="py-28 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-2xl text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-[0_20px_50px_rgb(194,122,94,0.4)]"
          >
            <CheckCircle className="text-white" size={48} strokeWidth={2.5} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs block mb-3">
              Submitted
            </span>
            <h2 className="text-4xl md:text-5xl font-heading text-primary mb-4">
              Thank You!
            </h2>
            <div className="w-16 h-[2px] bg-accent mx-auto mb-6" />
            <p className="text-muted text-lg mb-8 leading-relaxed">
              Your review has been submitted and is awaiting approval. 
              We deeply appreciate you sharing your Mazi experience with us.
            </p>
            <button 
              onClick={() => setIsSuccess(false)} 
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Coffee size={18} />
              Share Another Experience
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-28 bg-background relative overflow-hidden">
      
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        <Reveal>
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-[0_25px_70px_rgb(74,59,50,0.15)] overflow-hidden grid grid-cols-1 lg:grid-cols-5">
            
            <div className="lg:col-span-2 bg-gradient-to-br from-primary via-[#3A2E26] to-primary p-10 md:p-12 text-white relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              
              <Quote size={200} className="absolute -top-8 -right-8 text-white/[0.03]" strokeWidth={0.5} />
              <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-accent/10 to-transparent" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-[2px] bg-accent" />
                  <span className="text-accent font-bold tracking-[0.2em] uppercase text-xs">Testimonial</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-heading leading-tight mb-6 text-white">
                  Share Your
                  <br />
                  <span className="text-accent italic">Mazi Moment</span>
                </h2>

                <p className="text-white/70 leading-relaxed max-w-sm">
                  Every visit tells a story. Every cup creates a memory. 
                  We would love to hear yours.
                </p>
              </div>

              <div className="relative z-10 mt-12">
                <div className="flex items-center gap-3">
                  <Coffee size={20} className="text-accent" />
                  <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Mazi Specialty Coffee
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="relative">
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3">
                    Your Name <span className="text-accent">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.customer_name} 
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})} 
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-accent focus:bg-white outline-none transition-all duration-300 text-primary placeholder:text-gray-400"
                    placeholder="e.g. Ahmed Khan"
                  />
                  <AnimatePresence>
                    {errors.customer_name && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-xs mt-2 flex items-center gap-1"
                      >
                        <AlertCircle size={14} /> {errors.customer_name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3">
                    Your Rating <span className="text-accent">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = star <= (hoverRating || formData.rating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({...formData, rating: star})}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform duration-200 hover:scale-125 focus:outline-none"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star 
                            size={32} 
                            className={`transition-all duration-300 ${isActive ? 'text-accent fill-accent drop-shadow-md' : 'text-gray-300'}`}
                          />
                        </button>
                      );
                    })}
                    {formData.rating > 0 && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-3 text-sm font-semibold text-accent"
                      >
                        {formData.rating === 5 ? 'Excellent!' : 
                         formData.rating === 4 ? 'Very Good!' : 
                         formData.rating === 3 ? 'Good' : 
                         formData.rating === 2 ? 'Fair' : 'Poor'}
                      </motion.span>
                    )}
                  </div>
                  <AnimatePresence>
                    {errors.rating && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-xs mt-2 flex items-center gap-1"
                      >
                        <AlertCircle size={14} /> {errors.rating}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-bold uppercase tracking-[0.15em] text-primary">
                      Your Review <span className="text-accent">*</span>
                    </label>
                    <span className={`text-xs font-mono ${formData.review_text.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                      {formData.review_text.length}/500
                    </span>
                  </div>
                  <textarea 
                    rows="5" 
                    value={formData.review_text} 
                    onChange={(e) => setFormData({...formData, review_text: e.target.value})} 
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-accent focus:bg-white outline-none transition-all duration-300 text-primary placeholder:text-gray-400 resize-none"
                    placeholder="Tell us about your experience at Mazi..."
                  />
                  <AnimatePresence>
                    {errors.review_text && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-xs mt-2 flex items-center gap-1"
                      >
                        <AlertCircle size={14} /> {errors.review_text}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {errors.submit && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl flex items-center gap-2"
                    >
                      <AlertCircle size={16} /> {errors.submit}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full py-4 bg-primary text-white font-semibold tracking-wide rounded-xl hover:bg-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Review
                      <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

              </form>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ReviewFormSection;