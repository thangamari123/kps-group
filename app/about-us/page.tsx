import type { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: 'About Us | KPS Worldwide Logistics - Moving Your Commerce. Shaping Global Trade.',
  description: 'At KPS Worldwide Logistics Pvt Ltd., we bridge the gap between standard logistics and complex project engineering with 40+ years of trusted international freight expertise.',
  keywords: [
    'About KPS Worldwide Logistics',
    'Moving Your Commerce Shaping Global Trade',
    'logistics company Chennai history',
    'Customs House Agent Chennai 1985',
    'B.S. Prassanna logistics leader',
    'KPS company profile'
  ],
};

export default function AboutPage() {
  return <AboutContent />;
}
