import type { Metadata } from 'next';
import ContactContent from '@/components/contact/ContactContent';

export const metadata: Metadata = {
  title: 'Contact KPS Worldwide Logistics | Chennai Office & Branches',
  description: 'Contact KPS Worldwide Logistics in Chennai for customs clearance, freight forwarding and project cargo quotes. Call 044 4508 8099 or send an enquiry.',
  alternates: {
    canonical: 'https://kpsgroups.net/contact-us',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      name: 'Contact KPS Worldwide Logistics',
      url: 'https://kpsgroups.net/contact-us',
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://kpsgroups.net/#chennai-hq',
      name: 'KPS Worldwide Logistics Pvt. Ltd. – Chennai Head Office',
      url: 'https://kpsgroups.net',
      telephone: '+91-44-45088099',
      email: 'info@kpsgroups.net',
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

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
      <ContactContent />
    </>
  );
}
