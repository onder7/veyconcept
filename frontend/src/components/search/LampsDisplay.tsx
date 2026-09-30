import { useState } from 'react';

export function LampsDisplay() {
  const [isLightOn, setIsLightOn] = useState(false);

  return (
    <section className="bg-background py-12 md:py-16 mt-12 border-t border-border">
      <div className="container mx-auto px-4">
        {/* Header - Light Toggle */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            All Lighting
          </h2>
          
          {/* Toggle Switch */}
          <button
            onClick={() => setIsLightOn(!isLightOn)}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
            type="button"
          >
            <span className="text-sm font-medium text-foreground">
              Light: {isLightOn ? 'On' : 'Off'}
            </span>
            <div className={`relative w-12 h-7 rounded-full transition-colors ${
              isLightOn ? 'bg-amber-500' : 'bg-gray-400'
            }`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                isLightOn ? 'right-1' : 'left-1'
              }`} />
            </div>
          </button>
        </div>

        {/* 3 Lamps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Lamba Container */}
              <div className="relative w-full max-w-xs aspect-square flex items-center justify-center">
                {/* Lamba Görseli */}
                <img
                  src={isLightOn ? '/lamp-on.png' : '/lamp-off.png'}
                  alt={`Lamp ${index}`}
                  className={`w-full h-full object-contain transition-all duration-500 ${
                    isLightOn ? 'brightness-110 drop-shadow-lg' : 'brightness-90'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
