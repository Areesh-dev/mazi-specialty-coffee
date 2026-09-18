import ReviewsListSection from '../components/sections/ReviewsListSection';
import ReviewFormSection from '../components/sections/ReviewFormSection';

const Reviews = () => {
  return (
    <div className="bg-background min-h-screen">
      <ReviewsListSection />
      <ReviewFormSection />
    </div>
  );
};

export default Reviews;