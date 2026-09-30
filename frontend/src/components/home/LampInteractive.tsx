import { useState } from 'react';
import { Power } from 'lucide-react';

export function LampInteractive() {
  const [isLightOn, setIsLightOn] = useState(false);

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          {/* Lamba Görseli */}
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
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
              />

              {/* Power Düğmesi - hover sırasında göster */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/60 rounded-full p-4 backdrop-blur-sm hover:bg-black/80 transition-colors">
                  <Power className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
