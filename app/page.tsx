import { SiteHeader } from '@/components/site-header';
import { Hero } from '@/components/sections/hero';
import { Shop } from '@/components/sections/shop';
import { Atelier } from '@/components/sections/atelier';
import { Journal } from '@/components/sections/journal';
import { Footer } from '@/components/sections/footer';
import { CartDrawer } from '@/components/cart-drawer';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Shop />
        <Atelier />
        <Journal />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
