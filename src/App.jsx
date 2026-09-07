import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';

// Page Imports
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import CustomsBrokerage from './pages/CustomsBrokerage';
import CSR from './pages/CSR';
import Awards from './pages/Awards';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Careers from './pages/Careers';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import Downloads from './pages/Downloads';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import CookiePolicy from './pages/CookiePolicy';
import Quote from './pages/Quote';
import IndustryDetail from './pages/IndustryDetail';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Scroll behavior resets */}
        <ScrollToTop />

        {/* Global sticky header */}
        <Header />

        {/* Main page content area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<About />} />
            
            {/* Industries Routes */}
            <Route path="/industries/:industrySlug" element={<IndustryDetail />} />
            
            {/* Services Routes */}
            <Route path="/services" element={<Services />} />
            <Route path="/services/containerized-cargo" element={<ServiceDetail />} />
            <Route path="/services/freight-forwarding" element={<ServiceDetail />} />
            <Route path="/services/customs-brokerage" element={<CustomsBrokerage />} />
            <Route path="/services/transportation" element={<ServiceDetail />} />
            <Route path="/services/warehousing" element={<ServiceDetail />} />
            <Route path="/services/project-logistics" element={<ServiceDetail />} />
            <Route path="/services/odc" element={<ServiceDetail />} />
            <Route path="/services/ftwz" element={<ServiceDetail />} />
            
            {/* Corporate Routes */}
            <Route path="/corporate" element={<About />} />
            <Route path="/corporate/csr" element={<CSR />} />
            <Route path="/corporate/awards" element={<Awards />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/corporate/gallery" element={<Gallery />} />
            <Route path="/corporate/downloads" element={<Downloads />} />
            <Route path="/corporate/privacy-policy" element={<PrivacyPolicy />} />
            
            {/* News and Career Routes */}
            <Route path="/blogs" element={<Blog />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blogs/:blogId" element={<BlogDetail />} />
            <Route path="/blog/:blogId" element={<BlogDetail />} />
            <Route path="/career" element={<Careers />} />
            <Route path="/testimonial" element={<Testimonials />} />
            
            {/* Contact and Quote Leads */}
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/lead-form" element={<Quote />} />
            <Route path="/quote" element={<Quote />} />
            
            {/* Other Legal Policies */}
            <Route path="/terms-of-service" element={<Terms />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
          </Routes>
        </main>

        {/* Global corporate footer */}
        <Footer />
      </div>
    </Router>
  );
}
