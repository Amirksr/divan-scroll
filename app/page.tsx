import Hero from '@/components/Hero';
import MenuScroll from '@/components/MenuScroll';

export default function Home() {
  return (
    <main>
      <Hero />
      <MenuScroll />
      <section className="cta">
        <h3>
          This is the hero and menu scroll of a larger case study — walking through the design
          system, the RTL/LTR routing, and the build.
        </h3>
        <a href="https://github.com/Amirksr/DivanCafe">View the DivanCafe repo →</a>
        <footer>DIVAN — cinematic scroll case study · Next.js 14 + GSAP ScrollTrigger</footer>
      </section>
    </main>
  );
}
