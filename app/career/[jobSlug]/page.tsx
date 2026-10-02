import type { Metadata } from 'next';
import JobDetailView from '@/components/careers/JobDetailView';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [
    { jobSlug: 'customs-documentation-executive' },
    { jobSlug: 'freight-forwarding-operations-specialist' },
    { jobSlug: 'view' },
  ];
}

interface JobPageProps {
  params: Promise<{ jobSlug: string }>;
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { jobSlug } = await params;
  const formattedTitle = jobSlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${formattedTitle} | Careers | KPS Worldwide Logistics`,
    description: `Apply for ${formattedTitle} at KPS Worldwide Logistics. Explore responsibilities, qualifications, benefits, and submit your resume directly.`,
    keywords: ['logistics careers Chennai', 'KPS jobs', formattedTitle, 'customs broker job India'],
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { jobSlug } = await params;
  return <JobDetailView initialSlug={jobSlug} />;
}
