import React from "react";
import { ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import BlogPostCard from "../ui/BlogPostCard";

/*Helpers */
import Utils from "../../helpers/utils";

import PublicBlogsHandler from "../../handlers/publicblogs/publicblogs";

interface BlogItem {
  title: string;
  description: string;
  createdAt: string;
  coverImage: {
    url: string;
    alt: string;
  };
  category?: string;
  url?: string;
}

const BlogSection: React.FC = async () => {
  const publicBlogsHandler = new PublicBlogsHandler();
  const relatedResponse = await publicBlogsHandler.get({ page: 1, limit: 3 });
  const BlogPosts = relatedResponse.success
    ? (relatedResponse.data.items as BlogItem[]).map((item: BlogItem) => ({
        title: item.title,
        excerpt: item.description,
        date: Utils.formateDateLabel({ ms: parseInt(item.createdAt) }),
        image: item.coverImage.url,
        image_alt: item.coverImage.alt,
        category: item.category || "Trending",
        link: `/blog/${item.url || "#"}`,
      }))
    : [];

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Our Blog
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Articles
          </h2>
          <p className="text-lg text-gray-700">
            Expert insights on content marketing, SEO, and AI-powered solutions.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {BlogPosts.map((post, index) => (
            <BlogPostCard
              key={index}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              image={post.image}
              image_alt={post.image_alt}
              category={post.category}
              link={post.link}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" href="/blog">
            View all articles <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
