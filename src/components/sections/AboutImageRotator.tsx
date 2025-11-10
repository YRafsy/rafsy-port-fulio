
'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import placeholderData from '@/app/lib/placeholder-images.json';

const images = placeholderData.aboutSectionImages || [];

const imageVariants = {
    initial: { opacity: 0, scale: 0.9, x: 50 },
    animate: {
        opacity: 1,
        scale: 1,
        x: 0,
        transition: {
            opacity: { duration: 0.8, ease: "easeOut" },
            scale: { duration: 0.8, ease: "easeOut" },
            x: { duration: 0.8, ease: "easeOut" },
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        x: -50,
        transition: {
            opacity: { duration: 0.8, ease: "easeIn" },
            scale: { duration: 0.8, ease: "easeIn" },
            x: { duration: 0.8, ease: "easeIn" },
        }
    },
};

const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function AboutImageRotator() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isHovering) {
        intervalRef.current = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);
    } else if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }

    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };
  }, [isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
      className="relative h-96 w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={currentImageIndex}
          className="absolute inset-0 rounded-lg overflow-hidden shadow-xl"
          variants={imageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Image
            src={images[currentImageIndex].src}
            alt={images[currentImageIndex].hint}
            fill
            className="object-cover"
            data-ai-hint={images[currentImageIndex].hint}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
