import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * i18n routing helper hook
 * Güncel dile göre route path'i günceller
 * Örn: /tr/urun/xyz → /en/urun/xyz
 */
export function useI18nRouting() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Dilin sadece 2 karakterli kısmını al (tr veya en)
  const normalizedLanguage = (i18n.language || 'tr').split('-')[0] as 'tr' | 'en';

  // Mevcut dilin path segment'i
  const getPathWithLanguage = (path: string, lang: string): string => {
    // Eğer zaten dil prefix'i varsa kaldır
    const cleanPath = path.replace(/^\/(tr|en)/, '') || '/';
    // Yeni dilin path'ini oluştur
    return lang === 'tr' ? cleanPath : `/${lang}${cleanPath}`;
  };

  // Dil değiştiğinde routing'i güncelle
  useEffect(() => {
    const pathWithLanguage = getPathWithLanguage(location.pathname, normalizedLanguage);
    if (pathWithLanguage !== location.pathname) {
      navigate(pathWithLanguage, { replace: true });
    }
  }, [normalizedLanguage, location.pathname, navigate]);

  return { currentLanguage: normalizedLanguage, getPathWithLanguage };
}
