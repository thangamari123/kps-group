// Navigation Links for KPS Worldwide Logistics Pvt. Ltd.
// Maps navigation links to exact website routes

export const navigationData = {
  header: [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
    {
      name: "Services",
      path: "/services",
      dropdown: [
        { name: "Containerized Cargo (FCL & LCL)", path: "/services/containerized-cargo" },
        { name: "Multimodal Freight Forwarding", path: "/services/freight-forwarding" },
        { name: "Project Cargo & Maritime", path: "/services/project-logistics" },
        { name: "Over Dimensional Cargo (ODC)", path: "/services/odc" },
        { name: "Customs Brokerage", path: "/services/customs-brokerage" },
        { name: "Industrial Warehousing", path: "/services/warehousing" },
        { name: "FTWZ Solutions", path: "/services/ftwz" }
      ]
    },
    {
      name: "Corporate",
      path: "#",
      dropdown: [
        { name: "Awards & Recognitions", path: "/corporate/awards" },
        { name: "CSR Initiatives", path: "/corporate/csr" },
        { name: "Gallery & Media", path: "/corporate/gallery" },
        { name: "Client Testimonials", path: "/testimonial" },
        { name: "Downloads & Forms", path: "/corporate/downloads" },
        { name: "Privacy Policy", path: "/corporate/privacy-policy" }
      ]
    },
    { name: "Careers", path: "/career" },
    { name: "Blog", path: "/blogs" },
    { name: "Contact Us", path: "/contact-us" }
  ],
  
  footer: {
    quickLinks: [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about-us" },
      { name: "All Services", path: "/services" },
      { name: "Careers", path: "/career" },
      { name: "Contact Us", path: "/contact-us" },
      { name: "Downloads", path: "/corporate/downloads" },
      { name: "Gallery", path: "/corporate/gallery" }
    ],
    services: [
      { name: "Containerized Cargo (FCL/LCL)", path: "/services/containerized-cargo" },
      { name: "Multimodal Freight", path: "/services/freight-forwarding" },
      { name: "Project Cargo & Break Bulk", path: "/services/project-logistics" },
      { name: "Over Dimensional Cargo (ODC)", path: "/services/odc" },
      { name: "Customs Brokerage", path: "/services/customs-brokerage" },
      { name: "Industrial Warehousing", path: "/services/warehousing" }
    ],
    company: [
      { name: "Privacy Policy", path: "/corporate/privacy-policy" },
      { name: "Awards", path: "/corporate/awards" },
      { name: "News & Insights", path: "/blogs" },
      { name: "CSR Initiatives", path: "/corporate/csr" }
    ],
    legal: [
      { name: "Privacy Policy", path: "/corporate/privacy-policy" },
      { name: "Terms of Service", path: "/terms-of-service" },
      { name: "Cookie Policy", path: "/cookie-policy" }
    ]
  }
};
