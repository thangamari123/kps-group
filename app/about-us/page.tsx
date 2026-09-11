import type { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: 'About Us | KPS Worldwide Logistics - 40+ Years of Maritime Excellence',
  description: 'Learn about KPS Worldwide Logistics Pvt. Ltd., our four-decade legacy since 1985, executive leadership, port infrastructure, and pan-India multi-modal logistics reach.',
  keywords: [
    'About KPS Worldwide Logistics',
    'logistics company Chennai history',
    'Customs House Agent Chennai 1985',
    'B.S. Prassanna logistics leader',
    'KPS company profile'
  ],
};

export default function AboutPage() {
  return <AboutContent />;
}
