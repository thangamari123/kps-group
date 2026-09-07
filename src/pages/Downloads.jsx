import { useState } from 'react';
import { Search, FileDown, FolderOpen, ArrowDownToLine, Download } from 'lucide-react';
import PageHero from '../components/common/PageHero';

export default function Downloads() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showBlueprints, setShowBlueprints] = useState(true);

  const categories = ["All", "Customs Forms", "KYC Checklists", "Transit Standard Operating Procedures"];

  // Mock template files (clearly labeled as structural architecture mocks to avoid inventing downloadable files)
  const templateFiles = [
    {
      id: 1,
      fileName: "Import Customs Clearance Checklist (Template)",
      category: "Customs Forms",
      fileType: "PDF",
      fileSize: "1.2 MB"
    },
    {
      id: 2,
      fileName: "Client KYC Verification Document (Template)",
      category: "KYC Checklists",
      fileType: "DOCX",
      fileSize: "450 KB"
    }
  ];

  const filteredFiles = templateFiles.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white">
      {/* Page Hero */}
      <PageHero 
        title="Downloads" 
        description="Download corporate shipping documents, KYC checklists, and customs clearing forms."
        bgImage="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Downloads Section */}
      <section className="py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-6 border-b border-brand-gray-muted">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4.5 py-2 rounded text-xs font-semibold shadow-sm transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-green text-white'
                      : 'bg-brand-gray-light text-brand-gray hover:bg-brand-gray-muted'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-gray">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brand-gray-muted rounded-md text-xs focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:outline-none"
              />
            </div>
          </div>

          {/* Toggle mock templates */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => setShowBlueprints(!showBlueprints)}
              className="text-xs font-semibold text-brand-green hover:underline flex items-center space-x-1.5"
            >
              <FileDown className="w-4.5 h-4.5 text-brand-yellow" />
              <span>{showBlueprints ? "Hide Grid Card Blueprints" : "Show Grid Card Blueprints"}</span>
            </button>
          </div>

          {/* Grid Layouts */}
          {showBlueprints && filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-brand-gray-light border border-brand-gray-muted rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-brand-green text-white rounded-lg flex-shrink-0 group-hover:bg-brand-yellow group-hover:text-brand-green-dark transition-colors duration-300">
                      <FileDown className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-green-dark text-sm leading-snug group-hover:text-brand-green transition-colors">
                        {file.fileName}
                      </h4>
                      <div className="flex items-center space-x-3 text-xs text-brand-gray mt-1.5 font-light">
                        <span className="bg-brand-gray-muted px-2 py-0.5 rounded uppercase font-semibold text-[9px]">
                          {file.fileType}
                        </span>
                        <span>{file.fileSize}</span>
                        <span>|</span>
                        <span>Category: {file.category}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="p-3 bg-white hover:bg-brand-green text-brand-green hover:text-white rounded-full shadow-sm border border-brand-gray-muted group-hover:border-brand-green transition-all duration-300 focus:outline-none flex-shrink-0"
                    title="Download document mockup template"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-brand-gray-muted rounded-xl bg-brand-gray-light max-w-2xl mx-auto">
              <FolderOpen className="w-12 h-12 text-brand-gray mx-auto mb-4" />
              <h3 className="text-lg font-bold text-brand-green-dark">No Downloads Available</h3>
              <p className="text-sm text-brand-gray mt-1 max-w-sm mx-auto font-light">
                No downloadable files have been provided. We are building a secure repository for shipping forms, regulatory checklists, and customs clearing drafts. They will be uploaded soon.
              </p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
