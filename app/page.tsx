import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';

export const metadata: Metadata = {
  title: 'Customs Broker & Freight Forwarder Chennai | KPS Logistics',
  description: 'Licensed customs broker and freight forwarder in Chennai since 1985. Containerized cargo, ODC, project logistics and FTWZ warehousing across South India.',
  alternates: {
    canonical: 'https://kpsgroups.net/',
  },
  keywords: [
    'KPS Worldwide Logistics',
    'KPS Worldwide Logistics Pvt Ltd',
    'logistics company in Chennai',
    'freight forwarding company India',
    'containerized cargo shipping services',
    'project cargo logistics services',
    'over dimensional cargo transportation',
    'licensed customs brokerage services',
    'industrial warehousing Chennai',
    'customs broker Chennai',
    'ODC transport Chennai'
  ],
};

export default function HomePage() {
  return <HomeContent />;
}
