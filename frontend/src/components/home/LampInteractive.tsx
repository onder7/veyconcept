import { useState } from 'react';
import { Power } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LampInteractive() {
  const [isLightOn, setIsLightOn] = useState(false);
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-b from-background to-muted/20 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-8 md:gap-12">
          {/* Başlık */}
          <div className="text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
              {isLightOn ? '✨ Işık Açık' : '🌙 Işık Kapalı'}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
              Lamba üzerine tıklayarak ışığı açıp kapatın ve cam kürenin üzerindeki parlak refleksiyonu izleyin.
            </p>
          </div>

          {/* Lamba Görseli - Resim veya CSS Fallback */}
          <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
            {/* Arka plan glow efekti */}
            {isLightOn && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200/40 to-transparent blur-3xl animate-pulse" />
            )}

            {/* Resim Container */}
            <div
              onClick={() => setIsLightOn(!isLightOn)}
              className="relative w-full h-full flex items-center justify-center cursor-pointer group transition-transform hover:scale-105"
            >
              {/* Resim - sönük veya ışıklı versiyonu */}
              <img
                src={isLightOn ? '/lamp-on.png' : '/lamp-off.png'}
                alt="Interactive lamp"
                className={`w-full h-full object-contain transition-all duration-500 ${
                  isLightOn ? 'brightness-110 drop-shadow-lg' : 'brightness-90'
                }`}
                onError={(e) => {
                  // Resim yoksa fallback görseli göster
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />

              {/* CSS Fallback - Resim yoksa bu gösterilir */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                  isLightOn ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Parlak ışık haresi - CSS gradient overlay */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(ellipse 300px 200px at 35% 25%, rgba(255, 200, 100, 0.4), rgba(255, 150, 50, 0.2), transparent 60%)`,
                  }}
                />
              </div>

              {/* Hover indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
                  <Power className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Kontrol Düğmeleri */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setIsLightOn(false)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                !isLightOn
                  ? 'bg-foreground text-background shadow-lg'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              🌙 {t('lamp.off', 'Işığı Kapat')}
            </button>
            <button
              onClick={() => setIsLightOn(true)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                isLightOn
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/50'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              ✨ {t('lamp.on', 'Işığı Aç')}
            </button>
          </div>

          {/* Bilgi notu */}
          <p className="text-xs md:text-sm text-muted-foreground text-center max-w-sm">
            İpucu: Lamba görseline de tıklayabilirsiniz
          </p>
        </div>
      </div>
    </section>
  );
}
