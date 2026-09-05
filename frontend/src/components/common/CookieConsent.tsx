import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Settings } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export function CookieConsent() {
  const { t } = useTranslation();
  const [showConsent, setShowConsent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedPreferences = localStorage.getItem('cookie_preferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch {
        setShowConsent(true);
      }
    } else {
      setShowConsent(true);
    }
    setIsLoaded(true);
  }, []);

  function saveCookiePreferences(prefs: CookiePreferences) {
    localStorage.setItem('cookie_preferences', JSON.stringify(prefs));
    setPreferences(prefs);
    setShowConsent(false);
    setShowSettings(false);

    // Apply cookie settings
    applyPreferences(prefs);
  }

  function applyPreferences(prefs: CookiePreferences) {
    // Here you would enable/disable analytics, marketing pixels, etc. based on preferences
    console.log('Cookie preferences applied:', prefs);

    // Example: Enable/disable Google Analytics
    const gtag = (window as any).gtag;
    if (gtag) {
      if (prefs.analytics) {
        gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      } else {
        gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
    }
  }

  function acceptAll() {
    saveCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    });
  }

  function rejectAll() {
    saveCookiePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    });
  }

  if (!isLoaded || !showConsent) return null;

  return (
    <>
      {/* Cookie Consent Banner — mobilde alt menünün üzerine (bottom-16) ve asistan ikonunun üstüne (z-[80]) */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-[80] bg-white border-t border-gray-200 shadow-lg dark:bg-gray-900 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t('components.cookieConsent.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('components.cookieConsent.description')}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="/sozlesmeler" className="text-sm text-primary hover:underline">
                  {t('components.cookieConsent.cookiePolicy')}
                </a>
                <span className="text-gray-300">•</span>
                <button
                  onClick={() => setShowSettings(true)}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Settings size={14} />
                  {t('components.cookieConsent.cookieSettings')}
                </button>
              </div>
            </div>

            <div className="flex gap-2 md:ml-4 md:flex-shrink-0">
              <button
                onClick={rejectAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                {t('components.cookieConsent.reject')}
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-opacity-90 rounded-lg transition-colors"
              >
                {t('components.cookieConsent.accept')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <>
          <div
            className="fixed inset-0 z-[80] bg-black/40"
            onClick={() => setShowSettings(false)}
          />
          <div className="fixed inset-x-4 top-1/2 z-[90] w-full max-w-2xl transform -translate-y-1/2 -translate-x-1/2 left-1/2 bg-white rounded-lg shadow-xl dark:bg-gray-900 max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('components.cookieConsent.settingsTitle')}
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Necessary Cookies */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t('components.cookieConsent.necessaryTitle')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t('components.cookieConsent.necessaryDesc')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="mt-1 w-4 h-4"
                  />
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t('components.cookieConsent.analyticsTitle')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t('components.cookieConsent.analyticsDesc')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="mt-1 w-4 h-4"
                  />
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t('components.cookieConsent.marketingTitle')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t('components.cookieConsent.marketingDesc')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="mt-1 w-4 h-4"
                  />
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t('components.cookieConsent.functionalTitle')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t('components.cookieConsent.functionalDesc')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                    className="mt-1 w-4 h-4"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3 justify-end">
              <button
                onClick={rejectAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                {t('components.cookieConsent.rejectAll')}
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-opacity-90 rounded-lg transition-colors"
              >
                {t('components.cookieConsent.acceptAll')}
              </button>
              <button
                onClick={() => saveCookiePreferences(preferences)}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {t('components.cookieConsent.save')}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
