'use client';

import { useState, useEffect, useMemo } from 'react';
import { Camera, Video, Play, X, ZoomIn, MapPin, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '@/components/common/PageHero';
import { galleryCms } from '@/lib/cms-firestore';
import { cmsApi } from '@/lib/cms-api';

export default function GalleryContent() {
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [cmsItems, setCmsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadGallery() {
      try {
        const items = await galleryCms.getPublished();
        if (isMounted) {
          setCmsItems(items || []);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load gallery items from CMS:', err);
        if (isMounted) {
          setCmsItems([]);
          setLoading(false);
        }
      }
    }
    loadGallery();
    return () => { isMounted = false; };
  }, []);

  const photos = useMemo(() => {
    return cmsItems.filter(item => item.mediaType === 'image');
  }, [cmsItems]);

  const videos = useMemo(() => {
    return cmsItems.filter(item => item.mediaType === 'video');
  }, [cmsItems]);

  const currentItems = activeTab === 'photos' ? photos : videos;

  const categories = useMemo(() => {
    const set = new Set();
    currentItems.forEach(item => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [currentItems]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return currentItems;
    return currentItems.filter(i => i.category === selectedCategory);
  }, [currentItems, selectedCategory]);

  return (
    <div className="bg-white">
      <PageHero 
        title="Our Gallery" 
        description="A visual journey through our operations, milestones, and the people who make KPS a leader in logistics."
        bgImage="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          {/* Photos vs Videos Tabs */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => { setActiveTab('photos'); setSelectedCategory('All'); }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold shadow-xs transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc107] cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-brand-green text-white ring-2 ring-brand-green ring-offset-2'
                  : 'bg-brand-gray-light text-brand-gray-dark hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C]'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Photos ({photos.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('videos'); setSelectedCategory('All'); }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold shadow-xs transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc107] cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-brand-green text-white ring-2 ring-brand-green ring-offset-2'
                  : 'bg-brand-gray-light text-brand-gray-dark hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C]'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Videos ({videos.length})</span>
            </button>
          </div>

          {/* Category Filter Chips */}
          {categories.length > 2 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ffc107] ${
                    selectedCategory === cat
                      ? 'bg-[#006B4F] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-3 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-brand-gray font-medium">Loading gallery media...</p>
            </div>
          ) : currentItems.length === 0 ? (
            /* Empty State for current tab */
            <div className="text-center py-20 border-2 border-dashed border-brand-gray-muted rounded-2xl bg-brand-gray-light max-w-2xl mx-auto">
              {activeTab === 'photos' ? (
                <Camera className="w-12 h-12 text-brand-gray mx-auto mb-4" />
              ) : (
                <Video className="w-12 h-12 text-brand-gray mx-auto mb-4" />
              )}
              <h3 className="text-lg font-bold text-brand-green-dark">
                {activeTab === 'photos' ? 'No photos available yet.' : 'No videos available yet.'}
              </h3>
              <p className="text-[14.5px] text-[#4b5563] mt-1 max-w-sm mx-auto font-normal">
                {activeTab === 'photos'
                  ? 'Check back soon for high-resolution operational photographs.'
                  : 'Check back soon for video briefings and showcase recordings.'}
              </p>
            </div>
          ) : filteredItems.length > 0 ? (
            /* Photos / Videos Grid */
            <AnimatePresence mode="wait">
              {activeTab === 'photos' ? (
                <motion.div
                  key="photos-grid"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredItems.map((photo) => {
                    const mediaSrc = cmsApi.resolveMediaUrl(photo.mediaUrl);
                    return (
                      <div
                        key={photo.id}
                        className="relative bg-brand-gray-light rounded-xl overflow-hidden shadow-md aspect-[4/3] group cursor-pointer border border-brand-gray-muted"
                        onClick={() => setLightboxItem(photo)}
                      >
                        <img
                          src={mediaSrc}
                          alt={photo.altText || photo.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-brand-green-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                          <div className="p-3 bg-brand-yellow text-brand-green-dark rounded-full mb-3 transform scale-90 group-hover:scale-100 transition-transform">
                            <ZoomIn className="w-5 h-5" />
                          </div>
                          <h4 className="text-white font-bold text-sm drop-shadow">{photo.title}</h4>
                          {photo.category && (
                            <span className="text-[11px] text-brand-yellow font-medium mt-1">
                              {photo.category}
                            </span>
                          )}
                          {photo.location && (
                            <div className="flex items-center space-x-1 text-[10.5px] text-gray-200 mt-1">
                              <MapPin className="w-3 h-3 text-brand-yellow" />
                              <span>{photo.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="videos-grid"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredItems.map((video) => {
                    const videoSrc = cmsApi.resolveMediaUrl(video.mediaUrl);
                    return (
                      <div
                        key={video.id}
                        className="bg-brand-gray-light rounded-xl overflow-hidden shadow-md border border-brand-gray-muted flex flex-col"
                      >
                        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                          {video.isEmbed || (video.mediaUrl && (video.mediaUrl.includes('youtube.com') || video.mediaUrl.includes('youtu.be') || video.mediaUrl.includes('vimeo.com'))) ? (
                            <iframe
                              src={video.mediaUrl}
                              title={video.title}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : videoSrc ? (
                            <video
                              src={`${videoSrc}#t=0.001`}
                              controls
                              preload="metadata"
                              playsInline
                              className="w-full h-full object-contain"
                            >
                              <source src={videoSrc} type="video/mp4" />
                              Your browser does not support HTML5 video streaming.
                            </video>
                          ) : (
                            <div className="w-full h-full bg-brand-green-dark/80 flex items-center justify-center">
                              <Video className="w-10 h-10 text-white/50" />
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="font-bold text-sm text-brand-green-dark line-clamp-1">{video.title}</h4>
                              {video.category && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                                  {video.category}
                                </span>
                              )}
                            </div>
                            {video.description && (
                              <p className="text-xs text-gray-600 line-clamp-2 mt-1">{video.description}</p>
                            )}
                          </div>
                          {(video.location || video.date) && (
                            <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
                              {video.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-brand-yellow-dark" />
                                  <span className="truncate max-w-[150px]">{video.location}</span>
                                </div>
                              )}
                              {video.date && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3 text-brand-yellow-dark" />
                                  <span>{video.date}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            /* Category Filter yielded no results */
            <div className="text-center py-20 border-2 border-dashed border-brand-gray-muted rounded-2xl bg-brand-gray-light max-w-2xl mx-auto">
              <Tag className="w-12 h-12 text-brand-gray mx-auto mb-4" />
              <h3 className="text-lg font-bold text-brand-green-dark">No Matching Items Found</h3>
              <p className="text-[14.5px] text-[#4b5563] mt-1 max-w-sm mx-auto font-normal">
                Try selecting a different category filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox for Photos */}
      <AnimatePresence>
        {lightboxItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl relative border border-gray-200"
            >
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] transition-colors duration-200 z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-[16/10] bg-black flex items-center justify-center">
                <img
                  src={cmsApi.resolveMediaUrl(lightboxItem.mediaUrl)}
                  alt={lightboxItem.altText || lightboxItem.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-5 bg-white space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-extrabold text-base text-brand-green-dark">{lightboxItem.title}</h4>
                  {lightboxItem.category && (
                    <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {lightboxItem.category}
                    </span>
                  )}
                </div>
                {lightboxItem.description && (
                  <p className="text-[13.5px] sm:text-sm text-gray-700 font-normal leading-relaxed">{lightboxItem.description}</p>
                )}
                {lightboxItem.caption && (
                  <p className="text-[11px] text-gray-500 italic">{lightboxItem.caption}</p>
                )}
                <div className="pt-2 flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100">
                  {lightboxItem.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-yellow-dark" />
                      <span>{lightboxItem.location}</span>
                    </div>
                  )}
                  {lightboxItem.date && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-yellow-dark" />
                      <span>{lightboxItem.date}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-black rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl relative aspect-video flex items-center justify-center border border-gray-800"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] transition-colors duration-200 z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {activeVideo.isEmbed || (activeVideo.mediaUrl && (activeVideo.mediaUrl.includes('youtube.com') || activeVideo.mediaUrl.includes('youtu.be') || activeVideo.mediaUrl.includes('vimeo.com'))) ? (
                <iframe
                  src={activeVideo.mediaUrl}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={cmsApi.resolveMediaUrl(activeVideo.mediaUrl)}
                  poster={activeVideo.posterUrl ? cmsApi.resolveMediaUrl(activeVideo.posterUrl) : undefined}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  className="w-full h-full object-contain"
                >
                  <source src={cmsApi.resolveMediaUrl(activeVideo.mediaUrl)} type="video/mp4" />
                  Your browser does not support HTML5 video streaming.
                </video>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
