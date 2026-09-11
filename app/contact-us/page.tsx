import type { Metadata } from 'next';
import ContactContent from '@/components/contact/ContactContent';

export const metadata: Metadata = {
  title: 'Contact KPS Worldwide Logistics | Chennai Corporate & Regional Offices',
  description: 'Connect with KPS Worldwide Logistics Pvt. Ltd. at our Corporate Office in Parrys, Chennai or Regional Office in Guindy, Chennai. Phone: 044 - 45088099, Email: bsp@kpsgroups.net.',
  keywords: [
    'Contact KPS Worldwide Logistics',
    'logistics company in Chennai',
    'logistics services in Chennai',
    'customs broker Chennai',
    'freight forwarding company Chennai',
    'Parrys Chennai logistics office',
    'Guindy Chennai logistics office',
    'ODC transport Chennai'
  ],
};

export default function ContactPage() {
  return <ContactContent />;
}
