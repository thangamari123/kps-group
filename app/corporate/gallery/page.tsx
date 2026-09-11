import type { Metadata } from 'next';
import GalleryContent from '@/components/corporate/GalleryContent';

export const metadata: Metadata = {
  title: 'Gallery & Operations Showcase | KPS Worldwide Logistics',
  description: 'A visual journey through KPS operations, milestones, terminal handlings, fleet network, and the team driving logistics excellence.',
  keywords: ['KPS gallery', 'logistics photos', 'customs operations images', 'freight forwarding pictures'],
};

export default function GalleryPage() {
  return <GalleryContent />;
}
