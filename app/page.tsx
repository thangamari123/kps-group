import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';

export const metadata: Metadata = {
  title: 'Global Supply Chains. Engineered to Scale. | KPS Worldwide Logistics',
  description: 'KPS Worldwide Logistics Pvt. Ltd. is your premier partner for containerized freight, global break bulk, RoRo operations, and complex over dimensional cargo in Chennai, India.',
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
