import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import Button from "./Button";
import Link from "next/link";

export interface BlogPostCardProps {
  title: string;
  excerpt: string;
  date?: string; // Optional date
  image: string;
  image_alt?: string;
  category: string;
  link: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  title,
  excerpt,
  date,
  image,
  image_alt,
  category,
  link,
}) => {
  return (
    <Link
      href={link}
      className="bg-white p-4 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={image_alt || title}
          className="w-full rounded-xl h-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
            {category}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{date}</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 flex-grow">{excerpt}</p>
        <Button variant="text" className="self-start">
          Read more <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </Link>
  );
};

export default BlogPostCard;
