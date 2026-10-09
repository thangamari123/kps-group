import type { Metadata } from 'next';
import BlogDetailContent from '@/components/blogs/BlogDetailContent';

export function generateStaticParams() {
  return [
    { blogId: 'template-customs-rules' },
    { blogId: 'template-fleet-logistics' },
    { blogId: 'chennai-logistics-solutions' },
    { blogId: 'default' },
  ];
}

interface PageProps {
  params: Promise<{ blogId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { blogId } = await params;
  const isCustoms = blogId === 'template-customs-rules';
  const title = isCustoms 
    ? 'Upcoming Customs Regulations Update | KPS Worldwide Logistics'
    : 'News & Operational Updates | KPS Worldwide Logistics';

  return {
    title,
    description: isCustoms
      ? 'Future regulatory updates, HSN modifications, and custom compliance rules in India.'
      : 'National transit networks, BS6 fleet updates, and tracking technology in India.',
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { blogId } = await params;
  return <BlogDetailContent blogId={blogId} />;
}
