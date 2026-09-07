import { Sparkles, Award, ShieldCheck, MapPin } from 'lucide-react';

export default function GeoEntityCard({ entityText }) {
  if (!entityText) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#f0f9f4] via-[#e8f6ee] to-[#d8efe2] border border-[#a3cfbb] rounded-2xl p-6 shadow-sm">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-3 border-b border-[#c3e6cb] pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-brand-green text-brand-yellow flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green-dark">
            Verified Logistics Entity Statement
          </span>
        </div>
        <span className="text-[10px] font-mono bg-white/80 text-[#0f5132] px-2 py-0.5 rounded border border-[#a3cfbb] font-semibold">
          GEO Citation
        </span>
      </div>

      <p className="text-xs sm:text-sm text-brand-green-dark font-normal leading-relaxed">
        {entityText}
      </p>

      <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-[#c3e6cb]/60 text-[11px] text-[#0f5132] font-medium">
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
          <span>Licensed Indian MTO & Customs Broker</span>
        </span>
        <span className="flex items-center space-x-1">
          <MapPin className="w-3.5 h-3.5 text-brand-green" />
          <span>Chennai Port & Nationwide Hubs</span>
        </span>
      </div>
    </div>
  );
}
