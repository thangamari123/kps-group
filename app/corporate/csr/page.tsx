import type { Metadata } from 'next';
import PageHero from '@/components/common/PageHero';
import CTASection from '@/components/common/CTASection';
import { Heart, Landmark, Gift } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CSR Initiatives | KPS Worldwide Logistics',
  description: 'Our Corporate Social Responsibility Initiatives - making a positive impact through sustainability, community engagement, and responsible business practices.',
  keywords: ['KPS CSR', 'corporate social responsibility', 'Bala Vihar sponsorship', 'logistics community outreach'],
};

export default function CSRPage() {
  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
      caption: "Supporting children community initiatives"
    },
    {
      url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=600&q=80",
      caption: "Distributing hot nutritious meals"
    },
    {
      url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80",
      caption: "Uplifting communities and bring positive change"
    }
  ];

  return (
    <div className="bg-white">
      <PageHero 
        title="CSR Initiatives" 
        description="Our Corporate Social Responsibility Initiatives"
        bgImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-16 text-brand-gray-dark border-b border-brand-gray-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-brand-green font-bold text-xs uppercase tracking-wider block">
              Social Impact
            </span>
            <p className="text-xl md:text-2xl font-semibold text-brand-green-dark leading-relaxed">
              At KPS & Co., we are committed to making a positive impact through our CSR programs that focus on sustainability, community engagement, and responsible business practices.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-10">
              <div className="space-y-4">
                <span className="text-brand-yellow font-bold text-xs uppercase tracking-wider bg-brand-green px-3.5 py-1.5 rounded-full inline-block">
                  Community Action 2025
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-brand-green-dark">
                  Lunch Sponsorship at GOS Bala Vihar, Kilpauk
                </h3>
                <p className="text-sm text-brand-gray leading-relaxed font-light">
                  As part of our commitment to responsible corporate citizenship, KPS & CO sponsored lunch for 50 children at GOS Bala Vihar, Kilpauk, on Sunday, 30th June 2025. This initiative reflects our deep-rooted belief in giving back to the community and supporting those who need it most.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-xl font-bold text-brand-green-dark">
                  KPS & CO's Role in the Community
                </h4>
                <p className="text-sm text-brand-gray leading-relaxed font-light">
                  At KPS & CO, our core values extend beyond business. We strongly believe in sustainable and inclusive growth, and through our CSR initiatives, we aim to uplift communities and bring positive change. Our association with GOS Bala Vihar is one such meaningful step in that direction.
                </p>
                <p className="text-sm text-brand-gray leading-relaxed font-light">
                  Providing nutritious meals may seem simple, but for these children, it was a moment of warmth, care, and joy. Our team was humbled by the smiles and gratitude shared by the children and staff during this special lunch.
                </p>
              </div>

              <blockquote className="border-l-4 border-brand-yellow bg-brand-gray-light p-6 rounded-r-lg italic text-gray-700 font-medium text-lg leading-relaxed">
                &ldquo;We view CSR not just as a responsibility but as a core part of our identity. From education and healthcare to social welfare and empowerment, KPS & CO is committed to making a lasting difference.&rdquo;
              </blockquote>

              <div className="space-y-4 pt-4">
                <h4 className="text-xl font-bold text-brand-green-dark">
                  Looking Ahead
                </h4>
                <p className="text-sm text-brand-gray leading-relaxed font-light">
                  This sponsorship is just one of the many initiatives under our CSR framework. We will continue to engage in impactful activities that strengthen our bond with the society we serve. We thank GOS Bala Vihar for the opportunity to support their mission and look forward to more such collaborations in the future.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-brand-gray-light border border-brand-gray-muted rounded-xl p-6 space-y-6">
                <h4 className="text-base font-bold text-brand-green-dark pb-2 border-b border-brand-gray-muted uppercase tracking-wider">
                  Our Focus Pillars
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2 bg-brand-green text-white rounded mt-0.5">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-brand-green-dark text-sm">Social Welfare</h5>
                      <p className="text-xs text-brand-gray mt-1 leading-normal font-light">Providing direct nutritional, health, and development support to marginalized children.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="p-2 bg-brand-green text-white rounded mt-0.5">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-brand-green-dark text-sm">Inclusive Growth</h5>
                      <p className="text-xs text-brand-gray mt-1 leading-normal font-light">Aligning logistical growth paths with community advancement models.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="p-2 bg-brand-green text-white rounded mt-0.5">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-brand-green-dark text-sm">Community Outreach</h5>
                      <p className="text-xs text-brand-gray mt-1 leading-normal font-light">Direct engagement initiatives and long-term partnership with NGOs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-gray-light border-y border-brand-gray-muted text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h4 className="text-xl font-bold text-brand-green-dark uppercase tracking-wider">
              CSR Initiative Gallery
            </h4>
            <p className="text-xs text-brand-gray mt-1 font-light">Visual logs from our community lunch sponsorship and engagement programs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-md border border-brand-gray-muted group">
                <div className="aspect-[4/3] overflow-hidden bg-brand-green-dark">
                  <img 
                    src={img.url} 
                    alt={img.caption} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 bg-white text-center">
                  <p className="text-xs font-semibold text-brand-green-dark">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
