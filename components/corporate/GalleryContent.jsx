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

  const fallbackPhotos = [
    { id: 'fb-p1', title: 'Container Terminal Operations', mediaUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80', mediaType: 'image', category: 'Port Operations', location: 'Chennai Port', altText: 'Container Terminal' },
    { id: 'fb-p2', title: 'Air Freight Cargo Loading', mediaUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', mediaType: 'image', category: 'Air Freight', location: 'Airport Cargo Terminal', altText: 'Air cargo loading' },
    { id: 'fb-p3', title: 'FTWZ Strategic Storage Facility', mediaUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80', mediaType: 'image', category: 'Warehousing', location: 'FTWZ Hub', altText: 'FTWZ Warehousing' },
    { id: 'fb-p4', title: 'Ocean Freight Cargo Vessel', mediaUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80', mediaType: 'image', category: 'Ocean Freight', location: 'Kattupalli Port', altText: 'Ocean Freight' },
    { id: 'fb-p5', title: 'Specialized Project Logistics Crane', mediaUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', mediaType: 'image', category: 'Heavy Lift', location: 'Project Site', altText: 'Project Logistics' },
    { id: 'fb-p6', title: 'BS6 Transport Fleet Network', mediaUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80', mediaType: 'image', category: 'Transportation', location: 'National Highway', altText: 'Fleet network' }
  ];

  const fallbackVideos = [
    { id: 'fb-v1', title: 'K.P.S Corporate Showcase', posterUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80', mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', mediaType: 'video', category: 'Corporate', isEmbed: true },
    { id: 'fb-v2', title: 'End-to-End Customs & Transport Fleet', posterUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80', mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', mediaType: 'video', category: 'Fleet', isEmbed: true },
    { id: 'fb-v3', title: 'Free Trade Warehousing Operations', posterUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80', mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', mediaType: 'video', category: 'Warehousing', isEmbed: true }
  ];

  useEffect(() => {
    let isMounted = true;
    async function loadGallery() {
      try {
        const items = await galleryCms.getPublished();
        if (isMounted) {
          if (items && items.length > 0) {
            setCmsItems(items);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load gallery items from CMS:', err);
        if (isMounted) setLoading(false);
      }
    }
    loadGallery();
    return () => { isMounted = false; };
  }, []);

  const photos = useMemo(() => {
    const list = cmsItems.filter(item => item.mediaType === 'image');
    return list.length > 0 ? list : fallbackPhotos;
  }, [cmsItems]);

  const videos = useMemo(() => {
    const list = cmsItems.filter(item => item.mediaType === 'video');
    return list.length > 0 ? list : fallbackVideos;
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
        description="A visual journey through our operations, milestones, and the people who make K.P.S a leader in logistics."
        bgImage="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Photos vs Videos Tabs */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => { setActiveTab('photos'); setSelectedCategory('All'); }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold shadow transition-all duration-300 focus:outline-none ${
                activeTab === 'photos'
                  ? 'bg-brand-green text-white ring-2 ring-brand-green ring-offset-2'
                  : 'bg-brand-gray-light text-brand-gray-dark hover:bg-brand-gray-muted'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Photos ({photos.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('videos'); setSelectedCategory('All'); }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold shadow transition-all duration-300 focus:outline-none ${
                activeTab === 'videos'
                  ? 'bg-brand-green text-white ring-2 ring-brand-green ring-offset-2'
                  : 'bg-brand-gray-light text-brand-gray-dark hover:bg-brand-gray-muted'
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#006B4F] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

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
                  const posterSrc = cmsApi.resolveMediaUrl(video.posterUrl) || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80';
                  return (
                    <div
                      key={video.id}
                      className="relative bg-brand-gray-light rounded-xl overflow-hidden shadow-md aspect-video group cursor-pointer border border-brand-gray-muted"
                      onClick={() => setActiveVideo(video)}
                    >
                      <img
                        src={posterSrc}
                        alt={video.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-brand-green-dark/50 flex flex-col items-center justify-center p-4 text-center group-hover:bg-brand-green-dark/40 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-brand-yellow text-brand-green-dark flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform mb-3">
                          <Play className="w-5 h-5 ml-1 fill-current" />
                        </div>
                        <h4 className="text-white font-bold text-sm drop-shadow">{video.title}</h4>
                        {video.category && (
                          <span className="text-[10.5px] text-brand-yellow mt-1">{video.category}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
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
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
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
                  <p className="text-xs text-gray-600 font-light leading-relaxed">{lightboxItem.description}</p>
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
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-20"
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
                  poster={cmsApi.resolveMediaUrl(activeVideo.posterUrl)}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
