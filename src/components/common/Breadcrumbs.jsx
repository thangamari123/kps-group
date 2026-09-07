import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-300 font-medium" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-brand-yellow flex items-center transition-colors">
        <Home className="w-4.5 h-4.5 mr-1" />
        <span>Home</span>
      </Link>
      {pathnames.map((value, index) => {
        // Handle nested paths like /corporate/awards or /services/customs-brokerage
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        // Human readable display names
        let displayName = value
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        if (value.toLowerCase() === 'csr') displayName = 'CSR Initiatives';
        if (value.toLowerCase() === 'ftwz') displayName = 'FTWZ Solutions';

        return (
          <div key={to} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-gray-500" />
            {isLast ? (
              <span className="text-brand-yellow font-semibold" aria-current="page">{displayName}</span>
            ) : (
              <Link to={to} className="hover:text-brand-yellow transition-colors">
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
