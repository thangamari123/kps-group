import type { Metadata } from 'next';
import DownloadsContent from '@/components/corporate/DownloadsContent';

export const metadata: Metadata = {
  title: 'Downloads & Corporate Resources | KPS Worldwide Logistics',
  description: 'Download KPS company profiles, CII membership certificates, FFFI certificates, AEO credentials, and customs broker associations documentation.',
  keywords: ['KPS downloads', 'KPS company profile pdf', 'AEO certificate', 'CII membership', 'CCBA membership', 'BCBA'],
};

export default function DownloadsPage() {
  return <DownloadsContent />;
}
