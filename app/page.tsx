import SliderImage from '@/components/sections/slider-image';
import BoursesExternesSection from '@/components/sections/bourses-externes';
import HeroSection from '@/components/sections/hero-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <BoursesExternesSection />
      <SliderImage />
    </>
  );
}
