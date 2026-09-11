import type { Metadata } from 'next';
import BlogListContent from '@/components/blogs/BlogListContent';

export const metadata: Metadata = {
  title: 'News & Updates | KPS Worldwide Logistics',
  description: 'Industry insights, regulatory changes, logistics briefings, and client feedback logs from KPS Worldwide Logistics.',
  keywords: ['KPS logistics news', 'customs regulations updates', 'India trade insights', 'freight forwarding blog'],
};

export default function BlogListPage() {
  return <BlogListContent />;
}
