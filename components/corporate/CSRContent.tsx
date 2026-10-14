'use client';

import { useState, useEffect } from 'react';
import PageHero from '@/components/common/PageHero';
import CTASection from '@/components/common/CTASection';
import { Heart, Landmark, Gift, ArrowRight, Play, Sparkles } from 'lucide-react';
import { csrCms } from '@/lib/cms-firestore';
import { cmsApi } from '@/lib/cms-api';

export default function CSRContent() {
  const [cmsSections, setCmsSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackImages = [
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

  useEffect(() => {
    let isMounted = true;
    async function loadCSR() {
      try {
        const sections = await csrCms.getPublished();
        if (isMounted) {
          if (sections && sections.length > 0) {
            setCmsSections(sections);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load published CSR sections:', err);
        if (isMounted) setLoading(false);
      }
    }
    loadCSR();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="bg-white">
      <PageHero
        title="CSR Initiatives"
        description="Our Corporate Social Responsibility Initiatives - making a positive impact through sustainability, community engagement, and responsible business practices."
        bgImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Social Impact Banner */}
      <section className="py-16 text-brand-gray-dark border-b border-brand-gray-muted bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-brand-green font-bold text-xs uppercase tracking-wider block">
              Social Impact & Sustainability
            </span>
            <p className="text-xl md:text-2xl font-semibold text-brand-green-dark leading-relaxed">
              At KPS, we are committed to making a positive impact through our CSR programs that focus on sustainability, community engagement, and responsible business practices.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Sections or Fallback Content */}
      <section className="py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-12">
              {cmsSections.length > 0 ? (
                cmsSections.map((section, idx) => {
                  const mediaSrc = cmsApi.resolveMediaUrl(section.mediaUrl);
                  return (
                    <div key={section.id || idx} className="space-y-6 pb-8 border-b border-gray-100 last:border-0">
                      {section.subtitle && (
                        <span className="text-brand-yellow font-bold text-xs uppercase tracking-wider bg-brand-green px-3.5 py-1.5 rounded-full inline-block">
                          {section.subtitle}
                        </span>
                      )}

                      <h3 className="text-2xl md:text-3xl font-extrabold text-brand-green-dark">
                        {section.title}
                      </h3>

                      {mediaSrc && (
                        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 aspect-[16/9] bg-gray-900">
                          {section.mediaType === 'video' ? (
                            <video
                              src={mediaSrc}
                              controls
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={mediaSrc}
                              alt={section.title}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      )}

                      <div className="whitespace-pre-line text-[15px] sm:text-base text-[#374151] leading-[1.75] font-normal space-y-4">
                        {section.content}
                      </div>

                      {section.ctaText && section.ctaUrl && (
                        <div className="pt-2">
                          <a
                            href={section.ctaUrl}
                            className="inline-flex items-center space-x-2 bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                          >
                            <span>{section.ctaText}</span>
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                /* Default Curated CSR Story */
                <div className="space-y-10">
                  <div className="space-y-4">
                    <span className="text-brand-yellow font-bold text-xs uppercase tracking-wider bg-brand-green px-3.5 py-1.5 rounded-full inline-block">
                      Community Action
                    </span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-brand-green-dark">
                      Lunch Sponsorship at GOS Bala Vihar, Kilpauk
                    </h3>
                    <p className="text-[15px] sm:text-base text-[#374151] leading-[1.75] font-normal">
                      As part of our commitment to responsible corporate citizenship, KPS sponsored lunch for <strong className="font-semibold text-brand-green-dark">50 children</strong> at <strong className="font-semibold text-brand-green-dark">GOS Bala Vihar, Kilpauk</strong>. This initiative reflects our deep-rooted belief in giving back to the community and supporting those who need it most.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h4 className="text-xl font-bold text-brand-green-dark">
                      KPS's Role in the Community
                    </h4>
                    <p className="text-[14.5px] sm:text-[15.5px] text-[#4b5563] leading-[1.72] font-normal">
                      At KPS, our core values extend beyond business. We strongly believe in <strong className="font-semibold text-brand-green-dark">sustainable and inclusive growth</strong>, and through our CSR initiatives, we aim to uplift communities and bring positive change. Our association with GOS Bala Vihar is one such meaningful step in that direction.
                    </p>
                    <p className="text-[14.5px] sm:text-[15.5px] text-[#4b5563] leading-[1.72] font-normal">
                      Providing nutritious meals may seem simple, but for these children, it was a moment of warmth, care, and joy. Our team was humbled by the smiles and gratitude shared by the children and staff during this special lunch.
                    </p>
                  </div>

                  <blockquote className="border-l-4 border-brand-yellow bg-brand-gray-light p-6 rounded-r-xl italic text-gray-700 font-medium text-lg leading-relaxed">
                    &ldquo;We view CSR not just as a responsibility but as a core part of our identity. From education and healthcare to social welfare and empowerment, KPS is committed to making a lasting difference.&rdquo;
                  </blockquote>

                  <div className="space-y-4 pt-4">
                    <h4 className="text-xl font-bold text-brand-green-dark">
                      Looking Ahead
                    </h4>
                    <p className="text-[14.5px] sm:text-[15.5px] text-[#4b5563] leading-[1.72] font-normal">
                      This sponsorship is just one of the many initiatives under our CSR framework. We will continue to engage in impactful activities that strengthen our bond with the society we serve.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Pillars & Partner Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-brand-gray-light border border-brand-gray-muted rounded-2xl p-6 space-y-6">
                <h4 className="text-base font-bold text-brand-green-dark pb-2 border-b border-brand-gray-muted uppercase tracking-wider">
                  Our Focus Pillars
                </h4>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2 bg-brand-green text-white rounded-lg mt-0.5">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-brand-green-dark text-sm">Child Welfare & Nutrition</h5>
                      <p className="text-xs text-brand-gray mt-1 leading-normal">Supporting child care homes and ensuring access to healthy nutrition and care.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="p-2 bg-brand-green text-white rounded-lg mt-0.5">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-brand-green-dark text-sm">Community Outreach</h5>
                      <p className="text-xs text-brand-gray mt-1 leading-normal">Active participation in local welfare programs and social upliftment drives.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="p-2 bg-brand-green text-white rounded-lg mt-0.5">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-brand-green-dark text-sm">Sustained Giving</h5>
                      <p className="text-xs text-brand-gray mt-1 leading-normal">Long-term commitment to continuous support and meaningful social impact.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#004D3A] to-[#006B4F] text-white rounded-2xl p-6 text-center space-y-3 shadow-md">
                <span className="text-xs font-bold text-brand-yellow uppercase tracking-wider">Join Hands</span>
                <h4 className="text-base font-extrabold text-white">Partner With Our Initiatives</h4>
                <p className="text-xs sm:text-[13px] text-gray-100 leading-relaxed font-normal">
                  Interested in collaborating with our community outreach programs? Connect with our team today.
                </p>
                <a
                  href="/contact-us"
                  className="inline-block w-full py-2.5 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-bold text-xs rounded-xl transition-colors shadow-xs"
                >
                  Contact Outreach Team
                </a>
              </div>
            </div>
          </div>

          {/* Glimpses Section */}
          <div className="mt-16 pt-12 border-t border-brand-gray-muted">
            <h4 className="text-xl font-bold text-brand-green-dark mb-6 text-center">Glimpses of Community Action</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fallbackImages.map((img, idx) => (
                <div key={idx} className="group relative rounded-2xl overflow-hidden border border-brand-gray-muted shadow-xs aspect-[4/3]">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                    <p className="text-xs font-semibold text-white">{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
