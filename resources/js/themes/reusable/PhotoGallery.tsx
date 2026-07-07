import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Photo {
    id: string;
    url: string;
    order?: number;
}

interface PhotoGalleryProps {
    photos: Photo[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    // Keyboard navigation
    useEffect(() => {
        if (currentIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setCurrentIndex(null);
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, photos]);

    const handlePrev = () => {
        if (currentIndex === null) return;
        setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev! - 1));
    };

    const handleNext = () => {
        if (currentIndex === null) return;
        setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev! + 1));
    };

    if (!photos || photos.length === 0) {
        return (
            <p className="py-8 text-center font-sans text-xs italic text-charcoal/40">
                Belum ada foto galeri.
            </p>
        );
    }

    return (
        <div className="space-y-4 font-sans">
            <motion.div
                className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.08 } },
                }}
            >
                {photos.map((photo, idx) => (
                    <motion.div
                        key={photo.id}
                        variants={{
                            hidden: { opacity: 0, y: 20, scale: 0.96 },
                            visible: { opacity: 1, y: 0, scale: 1 },
                        }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentIndex(idx)}
                        className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-sand/30 bg-cream/10 shadow-sm"
                    >
                        <img
                            src={photo.url}
                            alt={`Gallery ${idx}`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="absolute bottom-3 left-3 right-3 h-px scale-x-0 bg-white/70 transition-transform duration-500 group-hover:scale-x-100" />
                    </motion.div>
                ))}
            </motion.div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {currentIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setCurrentIndex(null)}
                            className="absolute right-4 top-4 cursor-pointer rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                        >
                            <X size={24} />
                        </button>

                        {/* Left navigation */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 cursor-pointer rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        {/* Main Image Container */}
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="flex max-h-[80vh] max-w-4xl select-none items-center justify-center"
                        >
                            <img
                                src={photos[currentIndex].url}
                                alt={`Gallery Large ${currentIndex}`}
                                className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
                            />
                        </motion.div>

                        {/* Right navigation */}
                        <button
                            onClick={handleNext}
                            className="absolute right-4 cursor-pointer rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                        >
                            <ChevronRight size={24} />
                        </button>

                        {/* Index Display */}
                        <div className="absolute bottom-4 font-mono text-xs text-white/60">
                            {currentIndex + 1} / {photos.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PhotoGallery;
