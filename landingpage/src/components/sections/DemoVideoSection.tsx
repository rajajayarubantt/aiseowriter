"use client";

import React, { useState, useRef } from "react";
import { Play } from "lucide-react";
import { motion, useInView } from "framer-motion";

import Image from "next/image";

import Images from "../../assets/Images";

const DemoVideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <section id="demo" className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Grow organic traffic in auto-pilot
          </h2>
          <p className="text-lg text-gray-700">
            Watch how easy it is to generate and publish high-quality blog
            content with no-clicks.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
            {!isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10">
                <Image
                  src={Images.demo_banner}
                  alt="Demo video thumbnail"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 "></div>
                <button
                  onClick={handlePlayVideo}
                  className="relative z-10 w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center text-indigo-600 hover:text-indigo-700 transition-all duration-300 hover:scale-105"
                  aria-label="Play demo video"
                >
                  <Play size={36} fill="currentColor" />
                </button>
              </div>
            ) : (
              <iframe
                src="https://www.youtube.com/embed/R7QLf3RyuXs?si=hh72J3PzN-7Stzg2"
                title="Ai SEO Writer  Demo"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>

        <motion.div
          className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {[
            {
              label: "Average time to generate blog post",
              value: "< 5 minutes",
            },
            { label: "Languages supported", value: "31+" },
            { label: "SEO improvement", value: "Up to 72%" },
            { label: "Time saved vs manual writing", value: "95%" },
          ].map((stat, index) => (
            <div key={index} className="flex-1 min-w-[200px]">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DemoVideoSection;
