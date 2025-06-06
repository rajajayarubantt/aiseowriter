import React from "react";
import UseCaseCard from "../ui/UseCaseCard";

const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      title: "E-commerce Blogs",
      description:
        "Boost product visibility and drive sales with engaging blog content that ranks highly in search results.",
      image:
        "https://images.pexels.com/photos/6214475/pexels-photo-6214475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/blog",
    },
    {
      title: "SaaS Companies",
      description:
        "Establish thought leadership and educate potential customers with in-depth, technically accurate content.",
      image:
        "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/blog",
    },
    {
      title: "Digital Marketing Agencies",
      description:
        "Scale content production for multiple clients without expanding your team or compromising quality.",
      image:
        "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/blog",
    },
    {
      title: "Small Businesses",
      description:
        "Compete with larger competitors by maintaining a consistent content schedule with minimal resources.",
      image:
        "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/blog",
    },
  ];

  return (
    <section id="usecases" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Use Cases
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Perfect for Every Industry
          </h2>
          <p className="text-lg text-gray-700">
            See how different businesses leverage Ai SEO Writer to achieve their
            content marketing goals.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, index) => (
            <UseCaseCard
              key={index}
              title={useCase.title}
              description={useCase.description}
              image={useCase.image}
              link={useCase.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
