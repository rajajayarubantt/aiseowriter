"use client";

import Button from "../ui/Button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PenLine, Bot, Rocket, TrendingUp } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50 pointer-events-none" />

        {/* Animated background elements */}
        <div className="absolute top-0 left-0 right-0 h-[500px] opacity-20 ">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-24 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-48 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <motion.div
            className="flex-1 text-center lg:text-left space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-muted px-3 py-1 rounded-full text-sm mb-4">
              <span className="bg-blue-600 h-2 w-2 rounded-full mr-2"></span>
              <span className="font-medium">Early Access Program Now Open</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              AI{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                SEO Writer
              </span>{" "}
              that <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                Auto-Publishes
              </span>{" "}
              to all your Platforms
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Generate holistic SEO content in 31 languages that drives organic
              traffic. Automate your blog with AI content that readers and
              search engines love.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Button href="https://app.aiseowrite.in/signup" size="lg">
                Get started for free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button href="/#demo" variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 pt-4 text-sm">
              <div className="flex items-center">
                <PenLine className="h-4 w-4 mr-2 text-blue-600" />
                <span>31 Languages</span>
              </div>
              <div className="flex items-center">
                <Bot className="h-4 w-4 mr-2 text-blue-600" />
                <span>SEO Optimized</span>
              </div>
              <div className="flex items-center">
                <Rocket className="h-4 w-4 mr-2 text-blue-600" />
                <span>Auto-Publishing</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                <span>Traffic Focused</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 max-w-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative bg-background rounded-2xl shadow-xl border border-border overflow-hidden">
              {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div> */}
              <div className="p-1">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/8439091/pexels-photo-8439091.jpeg"
                    alt="Ai SEO Writer AI Dashboard"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
