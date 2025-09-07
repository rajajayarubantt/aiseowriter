import React from "react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import {
  ArrowLeft,
  Twitter,
  MessageCircle,
  Calendar,
  User,
} from "lucide-react";

import BlogPostCard from "../../../components/ui/BlogPostCard";
import Button from "../../../components/ui/Button";
import Separator from "../../../components/ui/Separator";

/*Helpers */
import Utils from "../../../helpers/utils";

/*handler*/
import PublicBlogsHandler from "../../../handlers/publicblogs/publicblogs";

interface ViewBlogProps {
  params: { slug: string };
}

// Define the structure of a blog item.
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

const ViewBlog: React.FC<ViewBlogProps> = async ({ params }) => {
  const publicBlogsHandler = new PublicBlogsHandler();

  const blogResponse = await publicBlogsHandler.get({ slug: params.slug });
  if (!blogResponse?.success || !blogResponse?.data?.items.length)
    return notFound();

  const BlogData = blogResponse?.data?.items[0];

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

  const ShareBlogPlatforms = [
    {
      id: "twitter",
      icon: <Twitter className="h-4 w-4" />,
    },
    {
      id: "whatsapp",
      icon: <MessageCircle className="h-4 w-4" />,
    },
  ];

  const shareBlogLink = (type: string, url: string) => {
    const encodedUrl = encodeURIComponent(`https://aiseowriter.in/blog/${url}`);
    let shareUrl = "";

    switch (type) {
      case "twitter":
        shareUrl = `https://x.com/intent/post?url=${encodedUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedUrl}`;
        break;
      default:
        return "#";
    }

    return shareUrl;
  };

  return (
    <article className="pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="text"
            className="pl-0 hover:bg-transparent"
            href="/blog"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>

          {/* Article header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                {BlogData?.industry || ""}
              </span>
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                {BlogData?.category || ""}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-5">{BlogData?.title || ""}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              {BlogData?.author?.name && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>By {BlogData.author.name}</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {Utils.formateDateLabel({
                    ms: parseInt(BlogData?.createdAt),
                  })}
                </span>
              </div>
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-xl mb-8">
              <img
                src={BlogData?.coverImage?.url}
                alt={BlogData?.coverImage?.alt || BlogData?.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Article content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: BlogData.content }}
          ></div>

          {/* Share buttons */}
          <div className="flex items-center gap-4 mt-12 pt-6 border-t">
            <p className="font-medium">Share this article:</p>
            {ShareBlogPlatforms?.map((platform) => (
              <Button
                key={platform.id}
                variant="outline"
                size="sm"
                className="w-10 h-10 rounded-full"
                href={shareBlogLink(platform.id, BlogData?.url)}
                target="_blank"
              >
                {platform.icon}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Related articles */}
      {BlogPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <Separator className="mb-12" />
          <h2 className="text-2xl font-bold mb-8">Related Articles</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        </div>
      )}
    </article>
  );
};

export default ViewBlog;
