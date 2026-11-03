import type { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: 'About Us | KPS Worldwide Logistics, Chennai Since 1985',
  description: 'KPS Worldwide Logistics is a Chennai customs broker and freight forwarder with 40+ years of experience in project cargo, ODC and FTWZ warehousing.',
  alternates: {
    canonical: 'https://kpsgroups.net/about-us',
  },
  openGraph: {
    title: 'About KPS Worldwide Logistics',
    description: 'Chennai customs broker and freight forwarder since 1985.',
    url: 'https://kpsgroups.net/about-us',
    type: 'website',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      name: 'About KPS Worldwide Logistics',
      url: 'https://kpsgroups.net/about-us',
    },
    {
      '@type': 'Organization',
      name: 'KPS Worldwide Logistics Pvt. Ltd.',
      url: 'https://kpsgroups.net',
      foundingDate: '1985',
      founder: {
        '@type': 'Person',
        name: 'Srinivasa Pragasam',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'No. 14, 6th Floor, A.K. Nayak Bhavan, Jahangir Street, Second Line Beach, Parrys',
        addressLocality: 'Chennai',
        addressRegion: 'Tamil Nadu',
        postalCode: '600001',
        addressCountry: 'IN',
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
      <AboutContent />
    </>
  );
}
