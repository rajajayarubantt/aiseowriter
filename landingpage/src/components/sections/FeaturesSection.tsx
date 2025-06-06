import React from "react";
import {
  PenLine,
  Sparkles,
  Globe,
  ArrowUpRight,
  BarChart,
  RefreshCw,
  Zap,
  Clock,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <PenLine size={24} />,
      title: "AI Content Creation",
      description:
        "Generate high-quality, engaging blog posts tailored to your brand voice and industry.",
    },
    {
      icon: <Sparkles size={24} />,
      title: "SEO Optimization",
      description:
        "Automatically optimize content for search engines with strategic keywords and meta data.",
    },
    {
      icon: <Globe size={24} />,
      title: "Auto-Publishing",
      description:
        "Schedule and publish content directly to your WordPress, Shopify, or other CMS platforms.",
    },
    {
      icon: <ArrowUpRight size={24} />,
      title: "Content Distribution",
      description:
        "Syndicate your content across multiple platforms to maximize reach and visibility.",
    },
    {
      icon: <BarChart size={24} />,
      title: "Performance Analytics",
      description:
        "Track content performance with detailed analytics and actionable insights.",
    },
    {
      icon: <RefreshCw size={24} />,
      title: "Content Updates",
      description:
        "Keep your content fresh with automatic updates based on trending topics and SEO changes.",
    },
    {
      icon: <Zap size={24} />,
      title: "Bulk Generation",
      description:
        "Create multiple articles at once with batch processing for efficient content creation.",
    },
    {
      icon: <Clock size={24} />,
      title: "Time-Saving",
      description:
        "Save 20+ hours per week on content creation and focus on growing your business.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Powerful Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Need pros to take care of SEO? Hire Me 😎
          </h2>
          <p className="text-lg text-gray-700">
            Ai SEO Writer combines advanced AI writing with automated publishing
            and optimization tools to supercharge your content strategy.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
