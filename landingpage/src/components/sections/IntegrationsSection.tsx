import React from "react";
import Images from "../../assets/Images";
import Image from "next/image";

interface IntegrationCardProps {
  name: string;
  logo: string;
  description: string;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  name,
  logo,
  description,
}) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 text-center">
      <Image
        src={logo}
        alt={`${name} logo`}
        className="h-16 w-16 mb-4 object-contain"
      />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

const IntegrationsSection: React.FC = () => {
  const integrations = [
    {
      name: "LinkedIn",
      logo: Images.integrations.linkedin,
      description:
        "Share articles as LinkedIn posts and articles to grow your professional audience.",
    },
    {
      name: "Instagram",
      logo: Images.integrations.instagram,
      description: "Share articles in posts/stories to grow your audience.",
    },
    {
      name: "X (Twitter)",
      logo: Images.integrations.twitter,
      description: "Post articles to build your professional following.",
    },
    {
      name: "WordPress",
      logo: Images.integrations.wordpress,
      description:
        "Direct publishing to WordPress blogs with full formatting and media support.",
    },
    {
      name: "Shopify",
      logo: Images.integrations.shopify,
      description:
        "Create product descriptions and blog posts for your Shopify store.",
    },
    {
      name: "Webflow",
      logo: Images.integrations.webflow,
      description: "Seamlessly publish content to your Webflow CMS collection.",
    },
    {
      name: "Wix",
      logo: Images.integrations.wix,
      description: "Auto-publish to Wix blogs with full formatting support.",
    },
    {
      name: "G-Host",
      logo: Images.integrations.ghost,
      description: "Auto-publish to Wix blogs with full formatting support.",
    },
    {
      name: "Blogger",
      logo: Images.integrations.blogger,
      description: "Auto-publish to Wix blogs with full formatting support.",
    },
    {
      name: "Google Analytics",
      logo: Images.integrations.g_analytics,
      description:
        "Track content performance with detailed analytics integration.",
    },
    {
      name: "Zapier",
      logo: Images.integrations.zapier,
      description:
        "Connect Ai SEO Writer  with thousands of other apps and services.",
    },
    {
      name: "Notion",
      logo: Images.integrations.notion,
      description:
        "Sync Ai SEO Writer with Notion to manage content effortlessly.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Seamless Integrations
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simplify publishing with AI SEO Writer
          </h2>
          <p className="text-lg text-gray-700">
            Ai SEO Writer integrates with popular platforms to fit seamlessly
            into your existing workflow.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {integrations.map((integration, index) => (
            <IntegrationCard
              key={index}
              name={integration.name}
              logo={integration.logo}
              description={integration.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
