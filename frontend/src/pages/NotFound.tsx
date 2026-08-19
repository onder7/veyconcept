import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <p className="mb-4 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span className="h-px w-8 bg-amber-500" /> Hata 404
      </p>
      <h1 className="font-display text-7xl md:text-8xl text-foreground mb-4">Sayfa Bulunamadı</h1>
      <p className="text-muted-foreground mb-8">Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <Button className="rounded-full h-11 px-8" render={<Link to="/" />}>Ana Sayfaya Dön</Button>
    </div>
  );
}
