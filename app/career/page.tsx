import type { Metadata } from 'next';
import CareerHero from '@/components/careers/CareerHero';
import OpenJobsList from '@/components/careers/OpenJobsList';
import { TrendingUp, Cpu, Heart } from 'lucide-react';
import { companyDetails } from '@/data/company';

export const metadata: Metadata = {
  title: 'Careers | KPS Worldwide Logistics',
  description: 'Join KPS Worldwide Logistics. Explore career opportunities in customs brokerage, freight forwarding, and project cargo logistics.',
  keywords: ['KPS careers', 'logistics jobs Chennai', 'customs broker job India', 'freight forwarding hiring'],
};

const benefits = [
  {
    icon: TrendingUp,
    title: 'Growth Opportunities',
    text: 'We invest in our personnel, helping team members acquire certifications and leadership credentials.',
  },
  {
    icon: Cpu,
    title: 'Technology & Innovation',
    text: 'Work with cutting-edge AI documentation clearance models and advanced transport dispatch platforms.',
  },
  {
    icon: Heart,
    title: 'People-First Culture',
    text: 'A highly supportive work environment with competitive allowances and healthy work-life integration policies.',
  },
];

export default function CareersPage() {
  return (
    <div className="bg-white">
      <CareerHero />

      {/* Why join KPS */}
      <section id="why-kps" className="py-16 sm:py-20 text-brand-gray-dark bg-white scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-2.5 text-brand-green text-[11px] font-bold uppercase tracking-[0.18em]">
                <span aria-hidden="true" className="h-px w-8 bg-brand-yellow" />
                Work With Us
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug text-brand-green-dark">
                Join KPS Family Logistics
              </h2>
              <p className="mt-4 text-[15px] text-brand-gray leading-relaxed">
                {companyDetails.careers.intro}
              </p>
            </div>

            <div className="lg:col-span-7">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-green-dark pb-3 border-b-2 border-brand-green-dark">
                Why Build a Career at KPS?
              </h3>

              <ul className="divide-y divide-brand-gray-muted border-b border-brand-gray-muted">
                {benefits.map(({ icon: Icon, title, text }, index) => (
                  <li key={title} className="flex items-start gap-4 sm:gap-5 py-5 sm:py-6">
                    <span
                      aria-hidden="true"
                      className="hidden sm:block w-7 pt-0.5 text-xs font-bold tabular-nums text-brand-yellow-dark"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-brand-green/20 bg-brand-green-bg text-brand-green">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-brand-green-dark">{title}</h4>
                      <p className="mt-1 text-sm text-brand-gray leading-relaxed">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Published jobs list. The Candidate Portal application form is hidden until Apply is clicked on an open job. */}
      <OpenJobsList />
    </div>
  );
}
