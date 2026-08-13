import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const bodoni = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-bodoni',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Vey Concept — Modern Design & Bespoke Objects',
  description:
    'Vey Concept is a creative studio designing sculptural interiors and illuminated objects. Bespoke furniture and collectible design for the modern home.',
  openGraph: {
    title: 'Vey Concept — Modern Design & Bespoke Objects',
    description:
      'A creative studio designing sculptural interiors and illuminated objects. Bespoke furniture and collectible design.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bodoni.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
