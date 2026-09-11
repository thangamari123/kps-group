import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { servicesData } from '@/data/services';
import CTASection from '@/components/common/CTASection';
import ServiceHero from '@/components/services/ServiceHero';
import GeoEntityCard from '@/components/services/GeoEntityCard';
import AeoFaqSection from '@/components/services/AeoFaqSection';
import ServiceSidebar from '@/components/services/ServiceSidebar';

import ContainerizedCargoView from '@/components/services/ContainerizedCargoView';
import FreightForwardingView from '@/components/services/FreightForwardingView';
import ProjectCargoView from '@/components/services/ProjectCargoView';
import ODCCargoView from '@/components/services/ODCCargoView';
import CustomsBrokerageView from '@/components/services/CustomsBrokerageView';
import WarehousingView from '@/components/services/WarehousingView';

export function getServiceData(slug: string) {
  if (slug === 'containerized-cargo') {
    return {
      service: servicesData.containerizedCargo,
      serviceType: 'containerized',
      bgImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80",
      stats: [
        { label: "FCL / LCL On-Time", value: "99.8%", sub: "Global Ocean Lines" },
        { label: "Direct Sea Lanes", value: "100+", sub: "Worldwide Connectivity" },
        { label: "Specialized Equipment", value: "20/40/HC", sub: "Reefer & Flat Racks" },
        { label: "Corporate Trust", value: "40+ Yrs", sub: "Since 1985" }
      ]
    };
  } else if (slug === 'freight-forwarding' || slug === 'multimodal' || slug === 'transportation') {
    return {
      service: servicesData.multimodalFreight,
      serviceType: 'freight',
      bgImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80",
      stats: [
        { label: "Multimodal Transit", value: "Sea+Air+Road", sub: "End-to-End Tracking" },
        { label: "Air Cargo Transit", value: "24-48 Hrs", sub: "Expedited Freight" },
        { label: "Inland Corridors", value: "Pan-India", sub: "First & Last-Mile" },
        { label: "Trade Lane Hubs", value: "50+ Hubs", sub: "Global Forwarding" }
      ]
    };
  } else if (slug === 'project-logistics' || slug === 'project-cargo') {
    return {
      service: servicesData.projectCargo,
      serviceType: 'project',
      bgImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80",
      stats: [
        { label: "Heavy Lift Capacity", value: "500+ Tons", sub: "Single Unit Lifts" },
        { label: "Break Bulk Charters", value: "Global", sub: "Vessel Chartering" },
        { label: "RoRo Operations", value: "Turnkey", sub: "Rolling Stock & Units" },
        { label: "Port Stevedoring", value: "Certified", sub: "Supervised Lashing" }
      ]
    };
  } else if (slug === 'odc') {
    return {
      service: servicesData.odcCargo,
      serviceType: 'odc',
      bgImage: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1920&q=80",
      stats: [
        { label: "Route Feasibility", value: "100% Surveyed", sub: "Bridge Load Checks" },
        { label: "Axle Flexibility", value: "Hydraulic", sub: "Modular Multi-Axle" },
        { label: "Highway Permits", value: "Complete", sub: "Civil Escort Clearance" },
        { label: "Safety Record", value: "Zero Incident", sub: "Engineered Transport" }
      ]
    };
  } else if (slug === 'customs-brokerage') {
    return {
      service: servicesData.customsBrokerage,
      serviceType: 'customs',
      bgImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80",
      stats: [
        { label: "Licensed Experience", value: "40+ Yrs", sub: "Direct Port Clearance" },
        { label: "ICEGATE Filing", value: "24/7 Digital", sub: "Paperless Gateway" },
        { label: "Tariff Compliance", value: "100%", sub: "HS / HTS Optimization" },
        { label: "Major Ports", value: "Pan-India", sub: "Sea, Air & ICD Hubs" }
      ]
    };
  } else if (slug === 'warehousing') {
    return {
      service: servicesData.warehousingLogistics,
      serviceType: 'warehousing',
      bgImage: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1920&q=80",
      stats: [
        { label: "Storage Formats", value: "Covered & Open", sub: "Industrial & ODC Yards" },
        { label: "Bonded Facilities", value: "Duty-Deferred", sub: "Customs Bond Storage" },
        { label: "Packing & Crating", value: "Export Ready", sub: "Heavy Lashing & ISPM" },
        { label: "Security Standards", value: "24/7 CCTV", sub: "WMS Inventory" }
      ]
    };
  } else if (slug === 'ftwz') {
    return {
      service: servicesData.ftwz,
      serviceType: 'warehousing',
      bgImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80",
      stats: [
        { label: "Duty Deferment", value: "100% Cashflow", sub: "Pay Only on Dispatch" },
        { label: "Foreign Currency", value: "Supported", sub: "Global Hub Invoicing" },
        { label: "Re-Export Relief", value: "Tax-Exempt", sub: "Zero Domestic Duty" },
        { label: "Strategic Zone", value: "Chennai SEZ", sub: "Special Economic Hub" }
      ]
    };
  }
  return null;
}

export function generateStaticParams() {
  return [
    { serviceSlug: 'containerized-cargo' },
    { serviceSlug: 'freight-forwarding' },
    { serviceSlug: 'transportation' },
    { serviceSlug: 'warehousing' },
    { serviceSlug: 'project-logistics' },
    { serviceSlug: 'odc' },
    { serviceSlug: 'ftwz' },
  ];
}

interface PageProps {
  params: Promise<{ serviceSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serviceSlug } = await params;
  const data = getServiceData(serviceSlug);
  if (!data || !data.service) {
    return {
      title: 'Service Not Found | KPS Worldwide Logistics',
    };
  }

  const { service } = data;
  return {
    title: service.seoTitle || `${service.title} | KPS Worldwide Logistics`,
    description: service.description,
    keywords: [service.primaryKeyword, ...(service.secondaryKeywords || [])],
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { serviceSlug } = await params;
  const data = getServiceData(serviceSlug);

  if (!data || !data.service) {
    notFound();
  }

  const { service, serviceType, bgImage, stats } = data;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": service.title,
        "serviceType": service.primaryKeyword || service.title,
        "description": service.description,
        "provider": {
          "@type": "LogisticsService",
          "name": "KPS Worldwide Logistics Pvt. Ltd.",
          "url": "https://www.kpsgroups.net",
          "telephone": "044 - 45088099",
          "email": "bsp@kpsgroups.net",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "No. 14, 6th Floor, A.K. Nayak Bhavan, Jahangir Street, Second Line Beach, Parrys",
            "addressLocality": "Chennai",
            "addressRegion": "Tamil Nadu",
            "postalCode": "600001",
            "addressCountry": "IN"
          }
        },
        "areaServed": ["Chennai", "Tamil Nadu", "India", "Global"]
      },
      ...(service.faqs && service.faqs.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": service.faqs.map((faq: { question: string; answer: string }) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }] : [])
    ]
  };

  return (
    <div className="bg-white">
      {/* Structured JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
              <ServiceSidebar currentPath={`/services/${serviceSlug}`} bgImage={bgImage} />
            </aside>

            {/* Right Core Content with Custom Bespoke Persona Rendering */}
            <main className="lg:col-span-8 space-y-10">
              
              {/* GEO Verified Entity Citation Box */}
              {service.entityPositioning && (
                <GeoEntityCard entityText={service.entityPositioning} />
              )}

              {/* Dynamic Service Persona View */}
              {serviceType === 'containerized' && (
                <ContainerizedCargoView service={service} />
              )}
              {serviceType === 'freight' && (
                <FreightForwardingView service={service} />
              )}
              {serviceType === 'project' && (
                <ProjectCargoView service={service} />
              )}
              {serviceType === 'odc' && (
                <ODCCargoView service={service} />
              )}
              {serviceType === 'customs' && (
                <CustomsBrokerageView service={service} />
              )}
              {serviceType === 'warehousing' && (
                <WarehousingView service={service} />
              )}

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
