"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";
import Button from "../ui/Button";
import Link from "next/link";
import Image from "next/image";

import Images from "../../assets/Images";
const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? "bg-white/50 shadow-sm py-3 backdrop-blur-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-md flex items-center gap-1.5"
            >
              <Image
                src={Images.Logo}
                width={40}
                height={40}
                alt="ai seo writer logo"
              />
              <span>Ai</span>
              <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                SEO Writer
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/#features"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Features
            </a>
            <a
              href="/#usecases"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Use Cases
            </a>
            <a
              href="/#pricing"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Pricing
            </a>
            <a
              href="/#blog"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Blog
            </a>
          </nav>

          <div className="hidden md:block">
            <Button href="/#early-access" variant="primary">
              Unlock Early Access
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-indigo-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4" onClick={handleMenuClick}>
            <nav className="flex flex-col space-y-4">
              <a
                href="/#features"
                className="text-gray-700 hover:text-indigo-600 font-medium py-2"
              >
                Features
              </a>
              <a
                href="/#usecases"
                className="text-gray-700 hover:text-indigo-600 font-medium py-2"
              >
                Use Cases
              </a>
              <a
                href="/#pricing"
                className="text-gray-700 hover:text-indigo-600 font-medium py-2"
              >
                Pricing
              </a>
              <a
                href="/#blog"
                className="text-gray-700 hover:text-indigo-600 font-medium py-2"
              >
                Blog
              </a>
              <Button href="/#early-access" variant="primary" fullWidth>
                Unlock Early Access
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
