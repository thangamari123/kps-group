import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.kpsgroups.net';
  const currentDate = new Date().toISOString().split('T')[0];

  const routes = [
    '',
    '/about-us',
    '/services',
    '/services/customs-brokerage',
    '/services/containerized-cargo',
    '/services/freight-forwarding',
    '/services/transportation',
    '/services/warehousing',
    '/services/project-logistics',
    '/services/odc',
    '/services/ftwz',
    '/industries/automotive-logistics',
    '/industries/automotive-parts-logistics',
    '/industries/fmcg-logistics',
    '/industries/manufacturing-industrial-logistics',
    '/industries/healthcare-logistics',
    '/industries/project-cargo-logistics',
    '/corporate/awards',
    '/corporate/csr',
    '/corporate/downloads',
    '/corporate/gallery',
    '/corporate/privacy-policy',
    '/blogs',
    '/blogs/template-customs-rules',
    '/blogs/template-fleet-logistics',
    '/career',
    '/testimonial',
    '/contact-us',
    '/quote',
    '/terms-of-service',
    '/cookie-policy',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/services') ? 0.9 : 0.8,
  }));
}
