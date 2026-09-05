import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { productApi } from '@/services/productApi';
import { api } from '@/services/api';
import { HeroVideo } from '@/components/home/HeroVideo';
import { HomeJournal } from '@/components/home/HomeJournal';
import { HomeShop } from '@/components/home/HomeShop';
import { useState, useEffect } from 'react';
import { SeoHead } from '@/components/seo/SeoHead';
import { organizationSchema, websiteSchema } from '@/lib/schemas';
import { CampaignBanner } from '@/components/common/CampaignDisplay';
import { useStoreInfo } from '@/hooks/useStoreInfo';

export function Home() {
  const { t } = useTranslation();
  const { name: storeName, slogan: storeSlogan } = useStoreInfo();
  const [bannerCampaign, setBannerCampaign] = useState<any | null>(null);

  // Fetch banner campaign
  useEffect(() => {
    const fetchBannerCampaign = async () => {
      try {
        const res = await api.get('/campaigns?isActive=true');
        const campaigns = res.data?.data || [];
        const banner = campaigns.find((c: any) => c.displayType === 'banner' && new Date(c.endDate) > new Date());
        if (banner) setBannerCampaign(banner);
      } catch (e) {
        console.error('Failed to fetch banner campaign:', e);
      }
    };
    fetchBannerCampaign();
  }, []);

  /*
  // Görsel slider — video hero'yu test ederken geçici olarak devre dışı.
  */

  const { data: featuredData, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productApi.featured(8),
    staleTime: 1000 * 60 * 5,
  });

  const featured = featuredData?.data?.data ?? [];

  return (
    <main className="bg-background">
      <SeoHead
        description={t('home.description', { storeName })}
        schema={[organizationSchema(storeName), websiteSchema(storeName)]}
      />
      {/* Video hero aktif; görsel slider geçici olarak devre dışı. */}
      {/*
      <HeroSlider
        slides={slides}
        storeName={storeName}
      />
      */}
      
      <HeroVideo
        storeName={storeName}
        slogan={storeSlogan}
      />

      {/* Campaign Banner */}
      {bannerCampaign && (
        <section className="container mx-auto px-4 py-12">
          <CampaignBanner campaign={bannerCampaign} />
        </section>
      )}




      {/* Öne Çıkan Ürünler — referans "shop" bölümü: tıklayınca modal (one-page) */}
      <HomeShop products={featured} loading={isFeaturedLoading} />

      {/* "Günce" tarzı koyu editorial bülten bandı */}
      <HomeJournal />
    </main>
  );
}
