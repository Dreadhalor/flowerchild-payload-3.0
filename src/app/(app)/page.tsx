import { FeaturedCategories } from '@flowerchild/components/home/featured-categories';
import { HeroSection } from '@flowerchild/components/home/hero-section';
import { NewArrivals } from '@flowerchild/components/home/new-arrivals';

export default function Home() {
  return (
    <div className='bg-primary min-h-screen'>
      <HeroSection />
      <NewArrivals />
      <FeaturedCategories />
    </div>
  );
}
