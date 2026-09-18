import HeroSlider from '../components/hero/HeroSlider';
import AboutSection from '../components/sections/AboutSection';
import CategoriesSection from '../components/sections/CategoriesSection';
import FeaturedMenuSection from '../components/sections/FeaturedMenuSection';
import UpcomingEventsSection from '../components/sections/UpcomingEventsSection';
import ReviewsListSection from '../components/sections/ReviewsListSection';
import ReviewFormSection from '../components/sections/ReviewFormSection';

const Home = () => {
  return (
    <>
      <HeroSlider />
      <AboutSection />
      <CategoriesSection />
      <FeaturedMenuSection />
      <UpcomingEventsSection />
      <ReviewsListSection />
      <ReviewFormSection />
    </>
  );
};

export default Home;