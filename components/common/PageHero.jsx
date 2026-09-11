import Breadcrumbs from './Breadcrumbs';

export default function PageHero({ title, description, bgImage }) {
  return (
    <section className="relative min-h-[220px] sm:min-h-[260px] md:min-h-[300px] flex items-center bg-brand-green-dark text-white overflow-hidden pt-24 pb-8 sm:pt-28 sm:pb-10">
      {bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 opacity-25 mix-blend-overlay"
          style={{ backgroundImage: `url('${bgImage}')` }}
        ></div>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark via-brand-green-dark/95 to-brand-green-dark/75"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm md:text-base text-gray-200 font-light leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
