import Breadcrumbs from './Breadcrumbs';
import SEO from './SEO';

export default function PageHero({ title, description, bgImage }) {
  const defaultBg = "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80"; // Cargo containers
  
  return (
    <section className="relative bg-brand-green-dark text-white pt-24 pb-8 sm:pt-28 sm:pb-12 md:py-16 overflow-hidden border-b border-brand-green/30">
      <SEO title={title} description={description} />
      {/* Dark overlay & logistics visual background */}
      <div 
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25" 
        style={{ backgroundImage: `url('${bgImage || defaultBg}')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/95 via-brand-green-dark/80 to-transparent"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <Breadcrumbs />
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mt-2 sm:mt-3 tracking-tight leading-[1.2] text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-gray-200 max-w-3xl leading-relaxed font-light">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

