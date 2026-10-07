import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export interface FindUsLink {
  id: string;
  label_tr: string;
  label_en: string;
  url: string;
  icon: string;
}

export interface FindUsData {
  title_tr: string;
  title_en: string;
  links: FindUsLink[];
}

export function useFindUsLinks() {
  return useQuery({
    queryKey: ['find-us-links'],
    queryFn: () =>
      api
        .get<{ success: boolean; data: FindUsData }>('/find-us')
        .then((r) => r.data?.data ?? null),
    staleTime: 1000 * 60 * 10,
  });
}
