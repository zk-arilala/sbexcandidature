import SliderImage from '@/components/sections/slider-image';
import TestimonialsSection from '@/components/sections/bourses-externes';
import HeroSection from '@/components/sections/hero-section';

export default async function Home() {
  return (
    <>
      <HeroSection />
      <TestimonialsSection />
      <SliderImage />
    </>
  );
}
