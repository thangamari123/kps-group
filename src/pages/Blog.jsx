import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FolderOpen, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import PageHero from '../components/common/PageHero';

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showArchitectureMock, setShowArchitectureMock] = useState(true);

  const categories = ["All", "Customs Brokerage", "Logistics", "FTWZ", "Company News"];

  // Mock architectural templates (clearly labeled as placeholders to avoid fake content creation)
  const mockArticles = [
    {
      id: "template-customs-rules",
      title: "Upcoming Customs Regulations Update",
      category: "Customs Brokerage",
      shortDescription: "This structural card is configured to display future regulatory updates, HSN modifications, and custom compliance rules in India.",
      date: "August 26, 2026",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "template-fleet-logistics",
      title: "Operational Logistics & Transit Innovations",
      category: "Logistics",
      shortDescription: "This structural card is configured to display upcoming reports on national transit networks, BS6 fleet updates, and tracking technology.",
      date: "August 20, 2026",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white">
      {/* Page Hero */}
      <PageHero 
        title="News & Updates" 
        description="Industry insights, regulatory changes, logistics briefings, and client feedback logs."
        bgImage="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Blog Listing Controls */}
      <section className="py-16 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          
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
                placeholder="Search updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brand-gray-muted rounded-md text-xs focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:outline-none"
              />
            </div>
          </div>

          {/* Toggle mock templates */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => setShowArchitectureMock(!showArchitectureMock)}
              className="text-xs font-semibold text-brand-green hover:underline flex items-center space-x-1.5"
            >
              <BookOpen className="w-4 h-4 text-brand-yellow" />
              <span>{showArchitectureMock ? "Hide Archive Grid Architecture" : "Show Archive Grid Architecture"}</span>
            </button>
          </div>

          {/* Blog Grid Content */}
          {showArchitectureMock && filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredArticles.map((article) => (
                <article 
                  key={article.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-brand-gray-muted group flex flex-col h-full"
                >
                  {/* Featured Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-brand-green-dark">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <span className="absolute top-4 left-4 bg-brand-yellow text-brand-green-dark text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded shadow">
                      {article.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div className="space-y-3">
                      {/* Date */}
                      <div className="flex items-center space-x-1.5 text-xs text-brand-gray font-light">
                        <Calendar className="w-4 h-4" />
                        <span>{article.date}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-brand-green-dark group-hover:text-brand-green transition-colors leading-snug">
                        {article.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-brand-gray leading-relaxed font-light">
                        {article.shortDescription}
                      </p>
                    </div>

                    {/* Read More button */}
                    <div className="pt-6 border-t border-brand-gray-muted mt-6">
                      <Link
                        to={`/blogs/${article.id}`}
                        className="inline-flex items-center space-x-2 text-xs font-bold text-brand-green hover:text-brand-green-light transition-colors group/link"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-brand-gray-muted rounded-xl bg-brand-gray-light">
              <FolderOpen className="w-12 h-12 text-brand-gray mx-auto mb-4" />
              <h3 className="text-lg font-bold text-brand-green-dark">No Articles Published</h3>
              <p className="text-sm text-brand-gray mt-1 max-w-sm mx-auto font-light">
                Our company blog architecture is ready. Future logistics briefings and corporate announcements will be posted here.
              </p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
