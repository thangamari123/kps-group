import { Quote, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { testimonialsData } from '../data/testimonials';

export default function Testimonials() {
  return (
    <div className="bg-white">
      {/* Page Hero */}
      <PageHero 
        title="Client Testimonials" 
        description="Direct feedback and evaluations from industrial manufacturers, energy enterprises, and global logistics clients."
        bgImage="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Testimonials Body */}
      <section className="py-16 sm:py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-brand-green font-bold text-xs uppercase tracking-wider block">
              CLIENT EXPERIENCE & APPRECIATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-green-dark">
              Trusted Partnerships. Proven Reliability.
            </h2>
            <p className="text-xs sm:text-sm text-brand-gray mt-2 font-light">
              We gather feedback from our shipping and brokerage clients periodically to uphold world-class service standards.
            </p>
            <div className="w-12 h-[3px] bg-brand-yellow mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {testimonialsData.map((card) => (
              <div 
                key={card.id} 
                className="bg-brand-gray-light border border-brand-gray-muted rounded-2xl p-6 sm:p-8 relative hover:shadow-lg hover:border-brand-green/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="absolute top-6 right-6 text-brand-green/10 group-hover:text-brand-green/20 transition-colors pointer-events-none">
                  <Quote className="w-12 h-12 fill-current" />
                </div>

                <div className="space-y-4 relative z-10">
                  {/* Stars */}
                  <div className="flex items-center space-x-1 text-brand-yellow">
                    {[...Array(card.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="ml-1.5 text-xs font-bold text-gray-500">5.0</span>
                  </div>

                  {/* Feedback */}
                  <p className="text-xs sm:text-sm text-brand-gray-dark italic leading-relaxed font-normal">
                    &ldquo;{card.text}&rdquo;
                  </p>
                </div>

                {/* Profile info */}
                <div className="flex items-center space-x-3.5 border-t border-brand-gray-muted pt-4 mt-6 relative z-10">
                  <div className="w-10 h-10 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:bg-brand-green group-hover:text-white transition-colors">
                    {card.author.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-brand-green-dark text-xs sm:text-sm truncate">{card.author}</h4>
                    <p className="text-[10px] sm:text-xs text-brand-gray uppercase font-semibold tracking-wider mt-0.5 truncate">{card.company}</p>
                    <div className="flex items-center space-x-1 mt-1 text-[10px] text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                      <span>Verified Client</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
