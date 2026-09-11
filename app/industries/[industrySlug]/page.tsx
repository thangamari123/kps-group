import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { industriesData } from '@/data/industries';
import IndustryContent from '@/components/industries/IndustryContent';

export function generateStaticParams() {
  return Object.keys(industriesData).map(slug => ({
    industrySlug: slug,
  }));
}

interface PageProps {
  params: Promise<{ industrySlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { industrySlug } = await params;
  const industry = (industriesData as Record<string, any>)[industrySlug];
  
  if (!industry) {
    return {
      title: 'Industry Not Found | KPS Worldwide Logistics',
    };
  }

  return {
    title: `${industry.title} | KPS Worldwide Logistics`,
    description: industry.shortDesc,
    keywords: [
      industry.title,
      `${industry.title} India`,
      "automotive logistics Chennai",
      "FMCG distribution logistics",
      "healthcare pharmaceutical logistics",
      "project cargo logistics India",
      "industrial machinery transport"
    ],
  };
}

export default async function IndustryDetailPage({ params }: PageProps) {
  const { industrySlug } = await params;
  const industry = (industriesData as Record<string, any>)[industrySlug];

  if (!industry) {
    notFound();
  }

  return <IndustryContent industry={industry} />;
}
