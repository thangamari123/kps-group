import type { Metadata } from 'next';
import PageHero from '@/components/common/PageHero';
import CareerApplicationForm from '@/components/forms/CareerApplicationForm';
import { TrendingUp, Cpu, Heart } from 'lucide-react';
import { companyDetails } from '@/data/company';

export const metadata: Metadata = {
  title: 'Careers | KPS Worldwide Logistics',
  description: 'Join KPS Worldwide Logistics. Explore career opportunities in customs brokerage, freight forwarding, and project cargo logistics.',
  keywords: ['KPS careers', 'logistics jobs Chennai', 'customs broker job India', 'freight forwarding hiring'],
};

export default function CareersPage() {
  return (
    <div className="bg-white">
      <PageHero 
        title="Careers" 
        description="At KPS Logistics, we believe in moving not just goods, but careers."
        bgImage="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="text-brand-green font-bold text-xs uppercase tracking-wider block">
                Work With Us
              </span>
              <h2 className="text-3xl font-bold tracking-tight leading-snug text-brand-green-dark">
                Join K.P.S & Co. Logistics
              </h2>
              <p className="text-base text-brand-gray leading-relaxed">
                {companyDetails.careers.intro}
              </p>
            </div>

            <div className="lg:col-span-5 bg-brand-gray-light border border-brand-gray-muted rounded-xl p-6 md:p-8 space-y-6">
              <h3 className="text-base font-semibold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
                Why Build a Career at KPS?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-brand-green text-white rounded mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-green-dark text-sm">Growth Opportunities</h4>
                    <p className="text-xs text-brand-gray mt-1 leading-normal">We invest in our personnel, helping team members acquire certifications and leadership credentials.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-brand-green text-white rounded mt-0.5">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-green-dark text-sm">Technology & Innovation</h4>
                    <p className="text-xs text-brand-gray mt-1 leading-normal">Work with cutting-edge AI documentation clearance models and advanced transport dispatch platforms.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-brand-green text-white rounded mt-0.5">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-green-dark text-sm">People-First Culture</h4>
                    <p className="text-xs text-brand-gray mt-1 leading-normal">A highly supportive work environment with competitive allowances and healthy work-life integration policies.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-gray-light border-t border-brand-gray-muted text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <CareerApplicationForm />
          </div>
        </div>
      </section>
    </div>
  );
}
