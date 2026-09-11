import type { Metadata } from 'next';
import AwardsContent from '@/components/corporate/AwardsContent';

export const metadata: Metadata = {
  title: 'Awards & Recognitions | KPS Worldwide Logistics',
  description: 'A comprehensive record of prestigious industry awards, customer partner appreciations, and conclave recognitions honoring KPS & Co.',
  keywords: ['KPS awards', 'shipping awards India', 'logistics excellence award', 'South East Cargo Conclave CEO of the year', 'CII awards'],
};

export default function AwardsPage() {
  return <AwardsContent />;
}
