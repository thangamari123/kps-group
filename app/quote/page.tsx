import type { Metadata } from 'next';
import PageHero from '@/components/common/PageHero';
import LeadForm from '@/components/forms/LeadForm';

export const metadata: Metadata = {
  title: 'Get a Custom Logistics Quote | KPS Worldwide Logistics',
  description: 'Request an itemized freight, customs clearance, warehousing, or project cargo logistics quote from KPS Worldwide Logistics.',
  keywords: ['request logistics quote', 'customs clearance rate Chennai', 'freight forwarding estimate India'],
};

export default function QuotePage() {
  return (
    <div className="bg-white">
      <PageHero 
        title="Get a Custom Quote" 
        description="Fill out the detailed logistics form below, and our compliance experts will review your cargo requirements."
        bgImage="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-20 bg-brand-gray-light text-brand-gray-dark border-t border-brand-gray-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <LeadForm />
          </div>
        </div>
      </section>
    </div>
  );
}
