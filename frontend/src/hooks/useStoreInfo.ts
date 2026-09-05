import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

// Mağaza kimliği tek kaynaktan: /api/company-info (kurulumda girilen general_ ayarları).
// Marka adı kodda sabit yazılmaz; her yerde bu hook kullanılır.

export interface StoreInfo {
  name: string;
  legalName: string;
  slogan: string;
  sloganEn: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  taxOffice: string;
  taxNumber: string;
  logoUrl: string;
}

const FALLBACK: StoreInfo = {
  name: 'Mağaza',
  legalName: 'Mağaza',
  slogan: '',
  sloganEn: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  taxOffice: '',
  taxNumber: '',
  logoUrl: '',
};

async function fetchStoreInfo(): Promise<StoreInfo> {
  const res = await fetch('/api/company-info');
  if (!res.ok) return FALLBACK;
  const json = await res.json();
  const d = json?.data ?? {};
  return {
    name: d.name || FALLBACK.name,
    legalName: d.legalName || d.name || FALLBACK.name,
    slogan: d.slogan || '',
    sloganEn: d.sloganEn || '',
    email: d.email || '',
    phone: d.phone || '',
    address: d.address || '',
    city: d.city || '',
    taxOffice: d.taxOffice || '',
    taxNumber: d.taxNumber || '',
    logoUrl: d.logoUrl || '',
  };
}

export function useStoreInfo(): StoreInfo {
  const { data } = useQuery({
    queryKey: ['store-info'],
    queryFn: fetchStoreInfo,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
  return data ?? FALLBACK;
}

export function useFooterSlogan(): string {
  const { i18n } = useTranslation();
  const storeInfo = useStoreInfo();
  
  // Language değişirse, yeni slogan computed
  return useMemo(() => {
    return i18n.language === 'en' ? storeInfo.sloganEn || storeInfo.slogan : storeInfo.slogan;
  }, [i18n.language, storeInfo.slogan, storeInfo.sloganEn]);
}
