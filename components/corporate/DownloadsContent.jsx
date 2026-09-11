'use client';

import { useState } from 'react';
import { Search, Download, FileText, ExternalLink, FolderOpen, ShieldCheck } from 'lucide-react';
import PageHero from '@/components/common/PageHero';

export default function DownloadsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ["All", "Company Profile", "Memberships & Certifications", "Accreditations"];

  const downloadItems = [
    {
      id: 1,
      title: "KPS COMPANY PROFILE",
      subtext: "Click below to download the resource",
      category: "Company Profile",
      file: "/downloads/kps-company-profile.pdf",
      downloadName: "KPS-Company-Profile.pdf",
      fileType: "PDF",
      fileSize: "940 KB"
    },
    {
      id: 2,
      title: "CII MEMBERSHIP CERTIFICATE 2025",
      subtext: "Click below to download the resource",
      category: "Memberships & Certifications",
      file: "/downloads/cii-membership-certificate-2025.pdf",
      downloadName: "CII-Membership-Certificate-2025.pdf",
      fileType: "PDF",
      fileSize: "200 KB"
    },
    {
      id: 3,
      title: "FFFI MEMBERSHIP 2026",
      subtext: "Click below to download the resource",
      category: "Memberships & Certifications",
      file: "/downloads/fffi-membership-2026.pdf",
      downloadName: "FFFI-Membership-2026.pdf",
      fileType: "PDF",
      fileSize: "618 KB"
    },
    {
      id: 4,
      title: "KPS AEO CERTIFICATE",
      subtext: "Click below to download the resource",
      category: "Accreditations",
      file: "/downloads/kps-aeo-certificate.pdf",
      downloadName: "KPS-AEO-Certificate.pdf",
      fileType: "PDF",
      fileSize: "1.5 MB"
    },
    {
      id: 5,
      title: "BCBA",
      subtext: "Click below to download the resource",
      category: "Memberships & Certifications",
      file: "/downloads/kps-co-certificate.pdf",
      downloadName: "BCBA-Certificate.pdf",
      fileType: "PDF",
      fileSize: "431 KB"
    },
    {
      id: 6,
      title: "CCBA MEMBERSHIP FY 26-27",
      subtext: "Click below to download the resource",
      category: "Memberships & Certifications",
      file: "/downloads/ccba-membership.pdf",
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
      <PageHero 
        title="Downloads" 
        description="Access and download our official corporate documents, company profile presentations, and institutional membership certificates."
        bgImage="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-16 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto mb-12 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search official company documents, accreditations, or certificates..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-brand-gray-light border border-brand-gray-muted rounded-xl focus:outline-none focus:border-brand-green text-sm transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-brand-gray mr-2 flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5" /> Filter by Category:
              </span>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    selectedCategory === cat 
                      ? 'bg-brand-green text-white shadow-xs' 
                      : 'bg-brand-gray-light text-brand-gray-dark hover:bg-brand-gray-muted'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((doc) => (
                <div 
                  key={doc.id} 
                  className="bg-[#fafcfb] border border-[#e2e8e5] hover:border-brand-green rounded-xl p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-brand-green/10 text-brand-green rounded-lg group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-gray-light text-brand-gray border border-brand-gray-muted">
                        {doc.fileType} • {doc.fileSize}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-brand-green font-semibold uppercase tracking-wider block mb-1">
                        {doc.category}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-brand-green-dark leading-snug group-hover:text-brand-green transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-brand-gray mt-1 font-light">
                        {doc.subtext}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between gap-3">
                    <a 
                      href={doc.file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-brand-gray hover:text-brand-green font-medium transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </a>

                    <a 
                      href={doc.file} 
                      download={doc.downloadName}
                      className="inline-flex items-center space-x-2 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-brand-gray">
                <FolderOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-base font-semibold text-brand-gray-dark">No documents match your query.</p>
                <p className="text-xs text-brand-gray mt-1 font-light">Try checking your spelling or choosing a different category filter.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
