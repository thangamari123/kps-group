import type { Metadata } from 'next';
import Link from 'next/link';
import { servicesData } from '@/data/services';
import CTASection from '@/components/common/CTASection';
import ServiceHero from '@/components/services/ServiceHero';
import GeoEntityCard from '@/components/services/GeoEntityCard';
import AeoFaqSection from '@/components/services/AeoFaqSection';
import ServiceSidebar from '@/components/services/ServiceSidebar';
import ProjectCargoView from '@/components/services/ProjectCargoView';

export const metadata: Metadata = {
  title: 'Project Cargo Logistics in India | Break Bulk, RoRo | KPS',
  description: 'Project cargo logistics in India from Chennai: break bulk, RoRo, heavy lift, port handling and heavy machinery transport for industry. Get a quote.',
  alternates: {
    canonical: 'https://kpsgroups.net/services/project-logistics',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Project Cargo Logistics',
      serviceType: 'Project cargo and break bulk logistics',
      description: 'End-to-end project cargo logistics covering break bulk, RoRo, port handling, heavy machinery and static cargo transportation.',
      url: 'https://kpsgroups.net/services/project-logistics',
      provider: { '@id': 'https://kpsgroups.net/#org' },
      areaServed: [
        { '@type': 'City', name: 'Chennai' },
        { '@type': 'Country', name: 'India' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Project & Maritime Capabilities',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Project Cargo Logistics' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Break Bulk Operations' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Port Handling & Stevedoring' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'RoRo Shipping' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Heavy Machinery Transportation' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Static Cargo Transportation' } },
        ],
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kpsgroups.net/' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://kpsgroups.net/services' },
        { '@type': 'ListItem', position: 3, name: 'Project Cargo Logistics', item: 'https://kpsgroups.net/services/project-logistics' },
      ],
    },
  ],
};

const service = servicesData.projectCargo;
const bgImage = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80";
const stats = [
  { label: "Heavy Lift Capacity", value: "500+ Tons", sub: "Single Unit Lifts" },
  { label: "Break Bulk Charters", value: "Global", sub: "Vessel Chartering" },
  { label: "RoRo Operations", value: "Turnkey", sub: "Rolling Stock & Units" },
  { label: "Port Stevedoring", value: "Certified", sub: "Supervised Lashing" }
];

export default function ProjectLogisticsPage() {
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
              <ServiceSidebar currentPath="/services/project-logistics" bgImage={bgImage} />
            </aside>

            {/* Right Core Content with Custom Bespoke Persona Rendering */}
            <main className="lg:col-span-8 space-y-10">
              
              {/* GEO Verified Entity Citation Box */}
              {service.entityPositioning && (
                <GeoEntityCard entityText={service.entityPositioning} />
              )}

              {/* Dynamic Service Persona View */}
              <ProjectCargoView service={service} />

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

