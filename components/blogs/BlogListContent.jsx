'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, FolderOpen, Calendar, ArrowRight, User } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import { blogsCms } from '@/lib/cms-firestore';
import { cmsApi } from '@/lib/cms-api';

export default function BlogListContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cmsBlogs, setCmsBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadBlogs() {
      try {
        const published = await blogsCms.getPublished();
        if (isMounted) {
          setCmsBlogs(published || []);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load published blogs from Firestore:', err);
        if (isMounted) {
          setCmsBlogs([]);
          setLoading(false);
        }
      }
    }
    loadBlogs();
    return () => { isMounted = false; };
  }, []);

  const articles = cmsBlogs;

  const categories = useMemo(() => {
    const set = new Set();
    articles.forEach(a => {
      if (a.category) set.add(a.category);
    });
    return ['All', ...Array.from(set)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (article.title && article.title.toLowerCase().includes(q)) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(q)) ||
        (article.author && article.author.toLowerCase().includes(q)) ||
        (article.tags && article.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(q)));
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  const formatDate = (dateVal) => {
    if (!dateVal) return 'Recent';
    try {
      if (typeof dateVal === 'string') {
        const d = new Date(dateVal.includes('T') ? dateVal : `${dateVal}T00:00:00`);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        }
        return dateVal;
      }
      if (typeof dateVal.toDate === 'function') {
        return dateVal.toDate().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
      if (dateVal.seconds) {
        return new Date(dateVal.seconds * 1000).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
      return new Date(dateVal).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="bg-white">
      <PageHero
        title="News & Updates"
        description="Industry insights, regulatory changes, logistics briefings, and operational announcements from KPS Worldwide Logistics."
        bgImage="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-16 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-brand-gray-muted">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ffc107] ${
                    selectedCategory === cat
                      ? 'bg-brand-green text-white'
                      : 'bg-brand-gray-light text-brand-gray hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-gray">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search articles & topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-brand-gray-muted rounded-xl text-xs focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:outline-none bg-white text-brand-gray-dark placeholder:text-brand-gray/60"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-3 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-brand-gray font-medium">Loading published articles...</p>
            </div>
          ) : articles.length === 0 ? (
            /* Empty State: No Blogs in Firestore */
            <div className="text-center py-20 border-2 border-dashed border-brand-gray-muted rounded-2xl bg-brand-gray-light">
              <FolderOpen className="w-12 h-12 text-brand-gray mx-auto mb-4" />
              <h3 className="text-lg font-bold text-brand-green-dark">No blog posts available yet.</h3>
              <p className="text-[14.5px] text-[#4b5563] mt-1 max-w-sm mx-auto font-normal">
                Check back soon for the latest news, regulatory updates, and industry insights from KPS Worldwide Logistics.
              </p>
            </div>
          ) : filteredArticles.length > 0 ? (
            /* Article Cards Grid (3 cols on desktop, 2 on tablet, 1 on mobile) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => {
                const imageSrc =
                  cmsApi.resolveMediaUrl(article.featuredImageUrl || article.featuredImageKey || article.mediaUrl) ||
                  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80';
                const articleSlug = article.slug || article.id;
                return (
                  <article
                    key={article.id}
                    className="bg-white rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200/80 group flex flex-col h-full hover:-translate-y-1"
                  >
                    {/* Top Thumbnail Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 border-b border-gray-100">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={article.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-green/10 text-brand-green font-bold text-xs">
                          KPS Logistics
                        </div>
                      )}
                      {article.category && (
                        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#006B4F] text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-lg shadow-xs border border-gray-200/70">
                          {article.category}
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
                      <div className="space-y-3">
                        {/* Publication Date & Author */}
                        <div className="flex items-center justify-between text-[11px] text-gray-500 font-normal">
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#006B4F]" />
                            <span>{formatDate(article.publishedAt)}</span>
                          </div>
                          {article.author && (
                            <div className="flex items-center space-x-1 font-medium truncate max-w-[130px]">
                              <User className="w-3 h-3 text-gray-400 shrink-0" />
                              <span className="truncate">{article.author}</span>
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-[#17211E] group-hover:text-[#006B4F] transition-colors leading-snug">
                          <Link href={`/blogs/view?slug=${encodeURIComponent(articleSlug)}`} className="hover:underline">
                            {article.title}
                          </Link>
                        </h3>

                        {/* Excerpt */}
                        {article.excerpt && (
                          <p className="text-[13.5px] text-gray-700 leading-relaxed font-normal line-clamp-3">
                            {article.excerpt}
                          </p>
                        )}

                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {article.tags.slice(0, 3).map((t, idx) => (
                              <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Read More Link */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <Link
                          href={`/blogs/view?slug=${encodeURIComponent(articleSlug)}`}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#006B4F] hover:text-[#073B2C] hover:bg-[#ffc107] active:bg-[#e0a800] active:text-[#073B2C] px-3 py-1.5 rounded-lg transition-all duration-250 group/link focus-visible:ring-2 focus-visible:ring-[#ffc107]"
                        >
                          <span>Read More</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Search / Filter yielded no results */
            <div className="text-center py-20 border-2 border-dashed border-brand-gray-muted rounded-2xl bg-brand-gray-light">
              <Search className="w-12 h-12 text-brand-gray mx-auto mb-4" />
              <h3 className="text-lg font-bold text-brand-green-dark">No Matching Articles Found</h3>
              <p className="text-[14.5px] text-[#4b5563] mt-1 max-w-sm mx-auto font-normal">
                Try adjusting your search criteria or category filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
