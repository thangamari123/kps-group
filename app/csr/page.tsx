import type { Metadata } from 'next';
import CSRContent from '@/components/corporate/CSRContent';

export const metadata: Metadata = {
  title: 'CSR Initiatives | KPS Worldwide Logistics',
  description: 'Our Corporate Social Responsibility Initiatives - making a positive impact through sustainability, community engagement, and responsible business practices.',
  keywords: ['KPS CSR', 'corporate social responsibility', 'Bala Vihar sponsorship', 'logistics community outreach'],
};

export default function CSRPage() {
  return <CSRContent />;
}
