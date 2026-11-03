import type { Metadata } from 'next';
import Link from 'next/link';
import { servicesData } from '@/data/services';
import CTASection from '@/components/common/CTASection';
import ServiceHero from '@/components/services/ServiceHero';
import GeoEntityCard from '@/components/services/GeoEntityCard';
import AeoFaqSection from '@/components/services/AeoFaqSection';
import ServiceSidebar from '@/components/services/ServiceSidebar';
import ContainerizedCargoView from '@/components/services/ContainerizedCargoView';

export const metadata: Metadata = {
  title: 'FCL & LCL Container Shipping Chennai | KPS Logistics',
  description: 'FCL and LCL container shipping from Chennai, with open top, flat rack and reefer options. Customs, port and inland delivery coordinated. Get a quote.',
  alternates: {
    canonical: 'https://kpsgroups.net/services/containerized-cargo',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Containerized Cargo Shipping (FCL & LCL)',
      serviceType: 'Container shipping',
      url: 'https://kpsgroups.net/services/containerized-cargo',
      provider: {
        '@type': 'Organization',
        name: 'KPS Worldwide Logistics Pvt. Ltd.',
        url: 'https://kpsgroups.net',
      },
      areaServed: [
        { '@type': 'City', name: 'Chennai' },
        { '@type': 'Country', name: 'India' },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kpsgroups.net/' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://kpsgroups.net/services' },
        { '@type': 'ListItem', position: 3, name: 'Containerized Cargo', item: 'https://kpsgroups.net/services/containerized-cargo' },
      ],
    },
  ],
};

const service = servicesData.containerizedCargo;
const bgImage = "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80";
const stats = [
  { label: "FCL / LCL On-Time", value: "99.8%", sub: "Global Ocean Lines" },
  { label: "Direct Sea Lanes", value: "100+", sub: "Worldwide Connectivity" },
  { label: "Specialized Equipment", value: "20/40/HC", sub: "Reefer & Flat Racks" },
  { label: "Corporate Trust", value: "40+ Yrs", sub: "Since 1985" }
];

export default function ContainerizedCargoPage() {
  return (
    <div className="bg-white">
      {/* Structured JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      {/* Dynamic Ultra-Premium Hero with Live Category Strip and Floating Metric Pills */}
      <ServiceHero 
        service={service} 
        bgImage={bgImage} 
        stats={stats}
      />

      {/* Main Details Section with Bespoke UI Per Service */}
      <section className="py-16 md:py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Breadcrumb Trail */}
          <nav className="flex items-center space-x-2 text-xs text-brand-gray mb-8">
            <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-brand-green transition-colors">Services</Link>
            <span>/</span>
            <span className="text-brand-green-dark font-bold truncate">{service.sectionLabel}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            
            {/* Left Sidebar */}
            <aside className="lg:col-span-4">
              <ServiceSidebar currentPath="/services/containerized-cargo" bgImage={bgImage} />
            </aside>

            {/* Right Core Content with Custom Bespoke Persona Rendering */}
            <main className="lg:col-span-8 space-y-10">
              
              {/* GEO Verified Entity Citation Box */}
              {service.entityPositioning && (
                <GeoEntityCard entityText={service.entityPositioning} />
              )}

              {/* Dynamic Service Persona View */}
              <ContainerizedCargoView service={service} />

              {/* Interactive AEO FAQ Accordion */}
              {service.faqs && service.faqs.length > 0 && (
                <AeoFaqSection 
                  faqs={service.faqs} 
                  serviceTitle={service.title} 
                />
              )}

            </main>

          </div>
        </div>
      </section>

      {/* Website-Wide Unified CTA */}
      <CTASection />
    </div>
  );
}
