import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ChevronLeft, User, Folder } from 'lucide-react';
import PageHero from '@/components/common/PageHero';

export function generateStaticParams() {
  return [
    { blogId: 'template-customs-rules' },
    { blogId: 'template-fleet-logistics' },
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
    : 'Operational Logistics & Transit Innovations | KPS Worldwide Logistics';

  return {
    title,
    description: isCustoms
      ? 'Future regulatory updates, HSN modifications, and custom compliance rules in India.'
      : 'National transit networks, BS6 fleet updates, and tracking technology in India.',
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { blogId } = await params;
  const isCustoms = blogId === 'template-customs-rules';

  const templateArticle = {
    title: isCustoms 
      ? "Upcoming Customs Regulations Update" 
      : "Operational Logistics & Transit Innovations",
    category: isCustoms 
      ? "Customs Brokerage" 
      : "Logistics",
    date: isCustoms 
      ? "August 26, 2026" 
      : "August 20, 2026",
    image: isCustoms 
      ? "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
      : "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80"
  };

  return (
    <div className="bg-white">
      <PageHero 
        title={templateArticle.title} 
        description="Architectural Template Layout for News & Updates Detail Views"
        bgImage={templateArticle.image}
      />

      <section className="py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blogs"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-green hover:text-brand-green-light mb-8 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to News & Updates</span>
            </Link>

            <div className="rounded-xl overflow-hidden shadow-lg aspect-[21/9] bg-brand-green-dark mb-8">
              <img
                src={templateArticle.image}
                alt={templateArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-brand-gray border-y border-brand-gray-muted py-4 mb-8">
              <div className="flex items-center space-x-1.5 font-light">
                <Calendar className="w-4 h-4 text-brand-yellow" />
                <span>{templateArticle.date}</span>
              </div>
              <div className="flex items-center space-x-1.5 font-light">
                <Folder className="w-4 h-4 text-brand-yellow" />
                <span>Category: {templateArticle.category}</span>
              </div>
              <div className="flex items-center space-x-1.5 font-light">
                <User className="w-4 h-4 text-brand-yellow" />
                <span>Written by: KPS Editorial Team</span>
              </div>
            </div>

            <div className="prose max-w-none text-sm text-brand-gray leading-relaxed space-y-6 font-light">
              <p className="font-semibold text-brand-green-dark text-base">
                This is a placeholder page layout showing how future articles will be formatted.
              </p>
              <p>
                When a new article is drafted, it will be mapped into this responsive template structure. Each post supports full rich-text layouts, bold headings, bullet indicators, blockquotes, and auxiliary charts or images.
              </p>
              <h4 className="text-lg font-bold text-brand-green-dark pt-4">
                Regulatory & Operational Highlights in India
              </h4>
              <p>
                The logistics infrastructure in India continues to adapt to newer digital tracking standards, customs ICEGATE portal updates, and BS6 freight mandates. K.P.S & Co. updates this news archive periodically to keep our logistics partners and clients aware of trade developments.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-brand-green-dark font-medium">
                <li>Regulatory customs policy developments.</li>
                <li>Strategic updates concerning Free Trade Warehousing Zones.</li>
                <li>Technological advancements in tracking and supply chain networks.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
