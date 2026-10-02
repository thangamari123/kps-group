import type { Metadata } from 'next';
import AwardsContent from '@/components/corporate/AwardsContent';

export const metadata: Metadata = {
  title: 'Awards & Recognitions | KPS Worldwide Logistics',
  description: 'A comprehensive record of prestigious industry awards, customer partner appreciations, and conclave recognitions honoring K.P.S.',
  keywords: ['KPS awards', 'shipping awards India', 'logistics excellence award', 'South East Cargo Conclave CEO of the year', 'CII awards'],
  alternates: {
    canonical: 'https://www.kpsgroups.net/awards',
  },
  openGraph: {
    title: 'Awards & Recognitions | KPS Worldwide Logistics',
    description: 'A comprehensive record of prestigious industry awards, customer partner appreciations, and conclave recognitions honoring K.P.S.',
    url: 'https://www.kpsgroups.net/awards',
    siteName: 'KPS Worldwide Logistics',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Awards & Recognitions | KPS Worldwide Logistics',
    description: 'A comprehensive record of prestigious industry awards, customer partner appreciations, and conclave recognitions honoring K.P.S.',
  },
};

export default function AwardsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Awards & Recognitions - KPS Worldwide Logistics',
    description: 'A comprehensive record of prestigious industry awards, customer partner appreciations, and conclave recognitions honoring K.P.S.',
    url: 'https://www.kpsgroups.net/awards',
    publisher: {
      '@type': 'Organization',
      name: 'KPS Worldwide Logistics Pvt. Ltd.',
      url: 'https://www.kpsgroups.net',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AwardsContent />
    </>
  );
}
