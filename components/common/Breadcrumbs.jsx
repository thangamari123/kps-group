'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathnames = (pathname || '').split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-xs text-brand-gray py-4 border-b border-brand-gray-muted mb-8 overflow-x-auto">
      <Link href="/" className="hover:text-brand-green flex items-center space-x-1 flex-shrink-0 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = value
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return (
          <div key={to} className="flex items-center space-x-2 flex-shrink-0">
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted" />
            {isLast ? (
              <span className="text-brand-green-dark font-bold">{formattedName}</span>
            ) : (
              <Link href={to} className="hover:text-brand-green transition-colors">
                {formattedName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
