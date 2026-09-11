import Link from 'next/link';
import { Ship, Home, Phone } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-16 sm:py-24">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-[#e8f0ec] text-[#0f5132] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Ship className="w-8 h-8 text-[#0f5132]" />
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#ffc107]">
            404 Error
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a3622] tracking-tight">
            Shipment Route Not Found
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            The page or logistics resource you are looking for may have been moved, renamed, or is currently unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#0f5132] hover:bg-[#146c43] text-white font-bold px-6 py-3 rounded-xl transition-all shadow text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/contact-us"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-[#0a3622] font-semibold px-6 py-3 rounded-xl transition-all text-sm"
          >
            <Phone className="w-4 h-4" />
            <span>Contact Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
