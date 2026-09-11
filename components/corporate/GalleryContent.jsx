'use client';

import { useState } from 'react';
import { Camera, Video, Play, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '@/components/common/PageHero';

export default function GalleryContent() {
  const [activeTab, setActiveTab] = useState('photos');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);

  const photos = [
    { id: 1, title: "Container Terminal Operations", url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80" },
    { id: 2, title: "Air Freight Cargo Loading", url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" },
    { id: 3, title: "FTWZ Strategic Storage Facility", url: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80" },
    { id: 4, title: "Ocean Freight Cargo Vessel", url: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80" },
    { id: 5, title: "Specialized Project Logistics Crane", url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80" },
    { id: 6, title: "BS6 Transport Fleet Network", url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80" }
  ];

  const videos = [
    { id: 1, title: "KPS & Co. Corporate Showcase", thumbnail: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 2, title: "End-to-End Customs & Transport Fleet", thumbnail: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 3, title: "Free Trade Warehousing Operations", thumbnail: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
  ];

  return (
    <div className="bg-white">
      <PageHero 
        title="Our Gallery" 
        description="A visual journey through our operations, milestones, and the people who make K.P.S & Co. a leader in logistics."
        bgImage="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-center space-x-4 mb-12">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold shadow transition-all duration-300 focus:outline-none ${
                activeTab === 'photos'
                  ? 'bg-brand-green text-white ring-2 ring-brand-green ring-offset-2'
                  : 'bg-brand-gray-light text-brand-gray-dark hover:bg-brand-gray-muted'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Photos</span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold shadow transition-all duration-300 focus:outline-none ${
                activeTab === 'videos'
                  ? 'bg-brand-green text-white ring-2 ring-brand-green ring-offset-2'
                  : 'bg-brand-gray-light text-brand-gray-dark hover:bg-brand-gray-muted'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Videos</span>
            </button>
          </div>

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
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative bg-brand-gray-light rounded-xl overflow-hidden shadow-md aspect-[4/3] group cursor-pointer border border-brand-gray-muted"
                    onClick={() => setLightboxImage(photo)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-brand-green-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                      <div className="p-3 bg-brand-yellow text-brand-green-dark rounded-full mb-3 transform scale-90 group-hover:scale-100 transition-transform">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                      <h4 className="text-white font-bold text-sm">{photo.title}</h4>
                    </div>
                  </div>
                ))}
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
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="relative bg-brand-gray-light rounded-xl overflow-hidden shadow-md aspect-video group cursor-pointer border border-brand-gray-muted"
                    onClick={() => setActiveVideoUrl(video.url)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-brand-green-dark/50 flex flex-col items-center justify-center p-4 text-center group-hover:bg-brand-green-dark/40 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-brand-yellow text-brand-green-dark flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform mb-3">
                        <Play className="w-5 h-5 ml-1 fill-current" />
                      </div>
                      <h4 className="text-white font-bold text-sm drop-shadow">{video.title}</h4>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox for Photos */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl overflow-hidden max-w-3xl w-full shadow-2xl relative border border-brand-gray-muted"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-[16/10] bg-black">
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 bg-white text-center">
                <h4 className="font-bold text-brand-green-dark">{lightboxImage.title}</h4>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-black rounded-xl overflow-hidden max-w-4xl w-full shadow-2xl relative aspect-video"
            >
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <iframe
                src={activeVideoUrl}
                title="Video Player"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
