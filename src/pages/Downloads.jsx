import { useState } from 'react';
import { Search, Download, FileText, ExternalLink, FolderOpen, ShieldCheck } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import SEO from '../components/common/SEO';

// Real PDF asset imports
import kpsProfilePdf from '../assets/download/KPS ppt (1).pdf';
import ciiCertPdf from '../assets/download/CII Membership Certificate 2025 (1).pdf';
import fffiCertPdf from '../assets/download/member-certificate.pdf';
import aeoCertPdf from '../assets/download/KPS AEO CERTIFICATE.pdf';
import bcbaCertPdf from '../assets/download/KPS & Co certificate (2).pdf';
import ccbaCertPdf from '../assets/download/ccba-membership.pdf';

export default function Downloads() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ["All", "Company Profile", "Memberships & Certifications", "Accreditations"];

  const downloadItems = [
    {
      id: 1,
      title: "KPS COMPANY PROFILE",
      subtext: "Click below to download the resource",
      category: "Company Profile",
      file: kpsProfilePdf,
      downloadName: "KPS-Company-Profile.pdf",
      fileType: "PDF",
      fileSize: "940 KB"
    },
    {
      id: 2,
      title: "CII MEMBERSHIP CERTIFICATE 2025",
      subtext: "Click below to download the resource",
      category: "Memberships & Certifications",
      file: ciiCertPdf,
      downloadName: "CII-Membership-Certificate-2025.pdf",
      fileType: "PDF",
      fileSize: "200 KB"
    },
    {
      id: 3,
      title: "FFFI MEMBERSHIP 2026",
      subtext: "Click below to download the resource",
      category: "Memberships & Certifications",
      file: fffiCertPdf,
      downloadName: "FFFI-Membership-2026.pdf",
      fileType: "PDF",
      fileSize: "618 KB"
    },
    {
      id: 4,
      title: "KPS AEO CERTIFICATE",
      subtext: "Click below to download the resource",
      category: "Accreditations",
      file: aeoCertPdf,
      downloadName: "KPS-AEO-Certificate.pdf",
      fileType: "PDF",
      fileSize: "1.5 MB"
    },
    {
      id: 5,
      title: "BCBA",
      subtext: "Click below to download the resource",
      category: "Memberships & Certifications",
      file: bcbaCertPdf,
      downloadName: "BCBA-Certificate.pdf",
      fileType: "PDF",
      fileSize: "431 KB"
    },
    {
      id: 6,
      title: "CCBA MEMBERSHIP FY 26-27",
      subtext: "Click below to download the resource",
      category: "Memberships & Certifications",
      file: ccbaCertPdf,
      downloadName: "CCBA-Membership-FY-26-27.pdf",
      fileType: "PDF",
      fileSize: "400 KB"
    }
  ];

  const filteredFiles = downloadItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subtext.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title="Downloads & Corporate Resources | KPS Worldwide Logistics"
        description="Download KPS company profiles, CII membership certificates, FFFI certificates, AEO credentials, and customs broker associations documentation."
        keywords={["KPS downloads", "KPS company profile pdf", "AEO certificate", "CII membership", "CCBA membership", "BCBA"]}
      />

      {/* Page Hero */}
      <PageHero 
        title="Downloads" 
        description="Access and download official KPS corporate presentations, statutory credentials, and industry membership certificates."
        bgImage="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Downloads Section */}
      <section className="py-14 sm:py-20 text-brand-gray-dark bg-[#fafcfb]">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#e5e9e7]">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-green text-white shadow-sm'
                      : 'bg-white border border-[#e5e9e7] text-brand-gray-dark hover:border-brand-green/40 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gray">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5e9e7] rounded-xl text-xs focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Grid of Downloadable Resource Cards */}
          {filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredFiles.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#e5e9e7] hover:border-brand-green/60 rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
                >
                  <div>
                    {/* Top Metadata Badges */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-[#eaf4ef] text-brand-green font-mono font-bold text-[10px] px-2.5 py-1 rounded-lg border border-brand-green/15">
                        {item.fileType} • {item.fileSize}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-[#eaf4ef] text-brand-green flex items-center justify-center group-hover:bg-brand-green group-hover:text-brand-yellow transition-colors duration-300">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-brand-green-dark leading-snug group-hover:text-brand-green transition-colors mb-2">
                      {item.title}
                    </h3>

                    {/* Description Subtext */}
                    <p className="text-xs sm:text-sm text-brand-gray font-light">
                      {item.subtext}
                    </p>
                  </div>

                  {/* Bottom Download Strip */}
                  <div className="pt-5 mt-6 border-t border-gray-100 flex items-center gap-2.5">
                    <a
                      href={item.file}
                      download={item.downloadName}
                      className="flex-1 inline-flex items-center justify-center space-x-2 bg-brand-green hover:bg-brand-green-light text-white font-bold py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition-all duration-300 text-xs sm:text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </a>

                    <a
                      href={item.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 hover:bg-[#eaf4ef] border border-gray-200 hover:border-brand-green text-brand-green transition-all"
                      title="Preview document in browser"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-2xl bg-white max-w-xl mx-auto p-8">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-brand-green-dark">No Documents Found</h3>
              <p className="text-xs text-brand-gray mt-1 font-light">
                No files matched your search criteria. Try adjusting your search query or selected category filter.
              </p>
            </div>
          )}

          {/* Bottom Accreditation Note */}
          <div className="mt-14 max-w-3xl mx-auto text-center bg-white border border-[#e5e9e7] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-brand-green" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-green-dark">
                Official Corporate Documents
              </span>
            </div>
            <p className="text-xs text-brand-gray font-light">
              All credentials and membership certificates provided above are authentic certified documents issued to M/s. KPS & Co. / KPS Worldwide Logistics Pvt. Ltd. For specific statutory verifications, please contact our compliance desk.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
