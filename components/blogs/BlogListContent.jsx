'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, FolderOpen, Calendar, ArrowRight, BookOpen, User, Tag, Sparkles } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import { blogsCms } from '@/lib/cms-firestore';
import { cmsApi } from '@/lib/cms-api';

export default function BlogListContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cmsBlogs, setCmsBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackArticles = [
    {
      id: "template-customs-rules",
      slug: "template-customs-rules",
      title: "Upcoming Customs Regulations Update",
      category: "Customs Brokerage",
      excerpt: "Comprehensive briefing on future regulatory updates, HSN modifications, and custom compliance rules in India.",
      author: "KPS Compliance Desk",
      publishedAt: { toDate: () => new Date('2026-08-26') },
      featuredImageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      featured: true,
      tags: ["Customs", "Compliance", "Tariffs"]
    },
    {
      id: "template-fleet-logistics",
      slug: "template-fleet-logistics",
      title: "Operational Logistics & Transit Innovations",
      category: "Logistics",
      excerpt: "Strategic report on national transit networks, BS6 fleet updates, and automated tracking technology in India.",
      author: "Fleet Operations Team",
      publishedAt: { toDate: () => new Date('2026-08-20') },
      featuredImageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
      featured: false,
      tags: ["Fleet", "BS6", "Operations"]
    }
  ];

  useEffect(() => {
    let isMounted = true;
    async function loadBlogs() {
      try {
        const published = await blogsCms.getPublished();
        if (isMounted) {
          if (published && published.length > 0) {
            setCmsBlogs(published);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load published blogs from Firestore:', err);
        if (isMounted) setLoading(false);
      }
    }
    loadBlogs();
    return () => { isMounted = false; };
  }, []);

  const articles = cmsBlogs.length > 0 ? cmsBlogs : fallbackArticles;

  const categories = useMemo(() => {
    const set = new Set();
    articles.forEach(a => {
      if (a.category) set.add(a.category);
    });
    return ['All', ...Array.from(set)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (article.title && article.title.toLowerCase().includes(q)) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(q)) ||
        (article.author && article.author.toLowerCase().includes(q)) ||
        (article.tags && article.tags.some(t => t.toLowerCase().includes(q)));
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  const featuredArticle = useMemo(() => {
    return articles.find(a => a.featured) || articles[0];
  }, [articles]);

  const formatDate = (dateVal) => {
    if (!dateVal) return 'Recent';
    if (typeof dateVal === 'string') return dateVal;
    if (dateVal.toDate) {
      return dateVal.toDate().toLocaleDateString('en-US', {
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
          {/* Featured Header Banner */}
          {featuredArticle && !searchQuery && selectedCategory === 'All' && (
            <div className="mb-14 bg-gradient-to-br from-[#004D3A] to-[#006B4F] rounded-2xl overflow-hidden shadow-xl text-white">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 p-6 sm:p-10 space-y-4">
                  <div className="inline-flex items-center space-x-1.5 bg-brand-yellow/20 text-brand-yellow px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Featured Insight</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-sm text-gray-200 leading-relaxed font-light line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-gray-300">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-yellow" />
                      <span>{formatDate(featuredArticle.publishedAt)}</span>
                    </div>
                    {featuredArticle.author && (
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-brand-yellow" />
                        <span>{featuredArticle.author}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-4">
                    <Link
                      href={`/blogs/${featuredArticle.slug || featuredArticle.id}`}
                      className="inline-flex items-center space-x-2 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-bold px-5 py-2.5 rounded-xl shadow-md transition-all text-xs"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5 h-64 lg:h-full relative min-h-[280px]">
                  <img
                    src={cmsApi.resolveMediaUrl(featuredArticle.featuredImageUrl) || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#004D3A] via-transparent to-transparent" />
                </div>
              </div>
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-brand-gray-muted">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-green text-white'
                      : 'bg-brand-gray-light text-brand-gray hover:bg-brand-gray-muted'
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
                className="w-full pl-10 pr-4 py-2 border border-brand-gray-muted rounded-xl text-xs focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:outline-none"
              />
            </div>
          </div>

          {/* Article Cards Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => {
                const imageSrc = cmsApi.resolveMediaUrl(article.featuredImageUrl) || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80';
                const articleSlug = article.slug || article.id;
                return (
                  <article
                    key={article.id}
                    className="bg-white rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden border border-brand-gray-muted group flex flex-col h-full hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-brand-green-dark">
                      <img
                        src={imageSrc}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {article.category && (
                        <span className="absolute top-3 left-3 bg-[#004D3A]/90 backdrop-blur-md text-brand-yellow text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-lg shadow-xs border border-brand-yellow/30">
                          {article.category}
                        </span>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-brand-gray font-light">
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-brand-yellow-dark" />
                            <span>{formatDate(article.publishedAt)}</span>
                          </div>
                          {article.author && (
                            <span className="truncate max-w-[120px] font-medium">{article.author}</span>
                          )}
                        </div>

                        <h3 className="text-base font-extrabold text-brand-green-dark group-hover:text-brand-green transition-colors leading-snug">
                          {article.title}
                        </h3>

                        <p className="text-xs text-brand-gray leading-relaxed font-light line-clamp-3">
                          {article.excerpt}
                        </p>

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

                      <div className="pt-4 border-t border-brand-gray-muted">
                        <Link
                          href={`/blogs/${articleSlug}`}
                          className="inline-flex items-center space-x-2 text-xs font-bold text-brand-green hover:text-brand-green-light transition-colors group/link"
                        >
                          <span>Read Full Story</span>
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-brand-gray-muted rounded-2xl bg-brand-gray-light">
              <FolderOpen className="w-12 h-12 text-brand-gray mx-auto mb-4" />
              <h3 className="text-lg font-bold text-brand-green-dark">No Matching Articles Found</h3>
              <p className="text-sm text-brand-gray mt-1 max-w-sm mx-auto font-light">
                Try adjusting your search criteria or category filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
