import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Categories from '@/components/Categories';
import FeaturedMenu from '@/components/FeaturedMenu';
import Gallery from '@/components/Gallery';
import AmbianceSpaces from '@/components/AmbianceSpaces';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Categories />
      <FeaturedMenu />
      <Gallery />
      <AmbianceSpaces />
    </>
  );
}
