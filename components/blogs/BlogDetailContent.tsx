'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Calendar, ChevronLeft, User, Folder, Tag, ArrowRight, AlertCircle } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import { blogsCms } from '@/lib/cms-firestore';
import { cmsApi } from '@/lib/cms-api';

interface BlogDetailProps {
  blogId?: string;
}

export default function BlogDetailContent({ blogId }: BlogDetailProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [article, setArticle] = useState<any>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Determine effective slug from search params, props, or pathname
  const effectiveSlug = useMemo(() => {
    // 1. Query parameters: ?slug=..., ?id=..., ?blog=...
    const q = searchParams?.get('slug') || searchParams?.get('id') || searchParams?.get('blog');
    if (q && q.trim() && q.trim() !== 'view' && q.trim() !== 'default') return q.trim();

    // 2. Props if passed
    if (blogId && blogId.trim() && blogId.trim() !== 'view' && blogId.trim() !== 'default') return blogId.trim();

    // 3. Pathname segments (e.g. /blogs/customs-update on Cloudflare Pages)
    if (pathname) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length >= 2 && (parts[0] === 'blogs' || parts[0] === 'blog') && parts[1] !== 'view' && parts[1] !== 'default') {
        return decodeURIComponent(parts[1].trim());
      }
    }

    // 4. Browser window location fallback
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSlug = urlParams.get('slug') || urlParams.get('id') || urlParams.get('blog');
      if (urlSlug && urlSlug.trim() && urlSlug.trim() !== 'view' && urlSlug.trim() !== 'default') {
        return urlSlug.trim();
      }
      const parts = window.location.pathname.split('/').filter(Boolean);
      if (parts.length >= 2 && (parts[0] === 'blogs' || parts[0] === 'blog') && parts[1] !== 'view' && parts[1] !== 'default') {
        return decodeURIComponent(parts[1].trim());
      }
    }

    return '';
  }, [blogId, pathname, searchParams]);

  useEffect(() => {
    let isMounted = true;
    async function fetchArticle() {
      if (!effectiveSlug) {
        setArticle(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let found = await blogsCms.getBySlug(effectiveSlug);
        if (!found) {
          found = await blogsCms.getById(effectiveSlug);
        }

        if (isMounted) {
          if (found) {
            setArticle(found);
            // Fetch related published blogs
            const published = await blogsCms.getPublished();
            if (isMounted && published) {
              setRelatedBlogs(published.filter((b) => b.slug !== effectiveSlug && b.id !== effectiveSlug).slice(0, 3));
            }
          } else {
            setArticle(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load article detail:', err);
        if (isMounted) {
          setArticle(null);
          setLoading(false);
        }
      }
    }

    fetchArticle();
    return () => { isMounted = false; };
  }, [effectiveSlug]);

  const formatDate = (dateVal: any) => {
    if (!dateVal) return 'Recent';
    try {
      if (typeof dateVal === 'string') return new Date(dateVal).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-white space-y-3">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-brand-gray font-medium">Loading article details...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white px-4 text-center py-20">
        <div className="p-4 bg-amber-50 rounded-full mb-4">
          <AlertCircle className="w-10 h-10 text-[#D97706]" />
        </div>
        <h2 className="text-xl font-bold text-brand-green-dark mb-2">Article Not Found</h2>
        <p className="text-xs text-brand-gray max-w-md mb-6 leading-relaxed">
          The requested blog post could not be found or has not been published yet.
        </p>
        <Link
          href="/blogs"
          className="inline-flex items-center space-x-2 bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to All Updates</span>
        </Link>
      </div>
    );
  }

  const heroImage = cmsApi.resolveMediaUrl(article.featuredImageUrl || article.featuredImageKey || article.mediaUrl) || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="bg-white">
      <PageHero
        title={article.title}
        description={article.excerpt || "Logistics & Corporate Updates from KPS Worldwide Logistics"}
        bgImage={heroImage}
      />

      <section className="py-16 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blogs"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-green hover:text-brand-green-light mb-8 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to All Updates</span>
            </Link>

            <div className="rounded-2xl overflow-hidden shadow-xl aspect-[21/9] bg-brand-green-dark mb-8 border border-gray-100">
              <img
                src={heroImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-brand-gray border-y border-brand-gray-muted py-4 mb-8">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-brand-yellow-dark" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                {article.category && (
                  <div className="flex items-center space-x-1.5 font-medium">
                    <Folder className="w-4 h-4 text-brand-yellow-dark" />
                    <span>Category: {article.category}</span>
                  </div>
                )}
                {article.author && (
                  <div className="flex items-center space-x-1.5 font-medium">
                    <User className="w-4 h-4 text-brand-yellow-dark" />
                    <span>Written by: {article.author}</span>
                  </div>
                )}
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-gray-400" />
                  {article.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="prose max-w-none text-sm text-brand-gray leading-relaxed space-y-6 font-light">
              {article.excerpt && (
                <p className="font-semibold text-brand-green-dark text-base border-l-4 border-emerald-600 pl-4 py-1 bg-emerald-50/50 rounded-r-lg">
                  {article.excerpt}
                </p>
              )}

              <div className="whitespace-pre-line text-sm text-gray-700 leading-relaxed space-y-4">
                {article.content}
              </div>
            </div>

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <div className="mt-16 pt-12 border-t border-brand-gray-muted">
                <h3 className="text-xl font-extrabold text-brand-green-dark mb-6">
                  Related Insights & Updates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((rel) => {
                    const relImg = cmsApi.resolveMediaUrl(rel.featuredImageUrl || rel.featuredImageKey || rel.mediaUrl) || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80';
                    return (
                      <Link
                        key={rel.id}
                        href={`/blogs/view?slug=${encodeURIComponent(rel.slug || rel.id)}`}
                        className="group bg-[#fafcfb] border border-gray-200 hover:border-emerald-500 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                          <img
                            src={relImg}
                            alt={rel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                              {rel.category || 'Logistics'}
                            </span>
                            <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 line-clamp-2 mt-1">
                              {rel.title}
                            </h4>
                          </div>
                          <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 pt-2">
                            <span>Read article</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
