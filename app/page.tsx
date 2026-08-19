import Hero from '@/components/Hero';
import AboutStory from '@/components/AboutStory';
import MenuScroll from '@/components/MenuScroll';

export default function Home() {
  return (
    <>
      <Hero />
      <AboutStory />
      <MenuScroll />
      <section className="cta">
        <h3>هیرو، داستان و منوی این کیس‌استادی بزرگ‌تر — سیستم طراحی، دیتای واقعی و ساخت را روایت می‌کند.</h3>
        <a href="https://github.com/Amirksr/DivanCafe">مشاهده‌ی ریپوی دیوان‌کافه ←</a>
        <footer>DIVAN — نمونه‌ی اسکرول سینماتیک · Next.js 14 + GSAP ScrollTrigger</footer>
      </section>
    </>
  );
}
