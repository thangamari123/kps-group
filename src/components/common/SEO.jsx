import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SEO({ title, description, keywords, schema }) {
  const location = useLocation();

  useEffect(() => {
    // 1. Title
    const defaultTitle = "KPS Worldwide Logistics Pvt. Ltd. | Global Supply Chains. Engineered to Scale.";
    document.title = title ? (title.includes('KPS Worldwide') ? title : `${title} | KPS Worldwide Logistics`) : defaultTitle;

    // 2. Meta Description
    const defaultDesc = "KPS Worldwide Logistics Pvt. Ltd. is a premier logistics and freight forwarding company in Chennai, India, providing containerized cargo (FCL/LCL), project cargo, break bulk, RoRo, ODC heavy transport, licensed customs brokerage, and industrial warehousing.";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description || defaultDesc;

    // 3. Meta Keywords
    const defaultKeywords = "KPS Worldwide Logistics, logistics company in Chennai, container shipping services, FCL and LCL shipping, freight forwarding company India, project cargo logistics services, break bulk shipping, RoRo shipping, over dimensional cargo transportation, ODC route survey, licensed customs brokerage services, tariff classification services, industrial warehousing Chennai";
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = Array.isArray(keywords) ? keywords.join(', ') : (keywords || defaultKeywords);

    // 4. Open Graph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = document.title;

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = description || defaultDesc;

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = window.location.href;

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // 6. Twitter Card Tags
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.name = "twitter:title";
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.content = document.title;

    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta');
      twitterDesc.name = "twitter:description";
      document.head.appendChild(twitterDesc);
    }
    twitterDesc.content = description || defaultDesc;

    // 7. Dynamic JSON-LD Schema Injection
    let schemaScript = document.getElementById('json-ld-schema');
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'json-ld-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }

    return () => {
      const existingScript = document.getElementById('json-ld-schema');
      if (existingScript) {
        existingScript.remove();
      }
    };

  }, [title, description, keywords, schema, location]);

  return null;
}

