"use client";
import React, { useState, useEffect } from "react";
import BlogPostCard from "./BlogPostCard";

import LoaderUi from "../ui/LoaderUi";
import ToastersUi from "../ui/ToastersUi";

import Utils from "../../helpers/utils";
import PublicBlogsHandler from "../../handlers/publicblogs/publicblogs";

import type { BlogPostCardProps } from "./BlogPostCard";

interface BlogPageSectionProps {
  params?: { page_idx?: number };
  searchParams?: object;
}

const BlogPageSection: React.FC<BlogPageSectionProps> = ({ params }) => {
  const publicBlogsHandler = new PublicBlogsHandler();

  const [isLoading, setIsLoading] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);
  const [warningAlertType, setWarningAlertType] = useState("warning");
  const [warningAlertMessage, setWarningAlertMessage] = useState(
    "Something went wrong"
  );

  const [PageIdx, setPageIdx] = useState<number>(1);
  const [PaginationLength, setPaginationLength] = useState<number>(1);
  const PaginationLimit = 10;

  const [BlogPosts, setBlogPosts] = useState<BlogPostCardProps[]>([]);

  const getBlogs = async (params?: { page_idx?: number }) => {
    const payload: { limit: number; page?: number } = {
      limit: PaginationLimit,
    };

    if (params?.page_idx) payload.page = params.page_idx;

    setIsLoading(true);
    const response = await publicBlogsHandler.get(payload);
    setIsLoading(false);

    if (!response.success) {
      setWarningAlert(true);
      setWarningAlertType("error");
      setWarningAlertMessage(
        response.message || "Failed to get, Please try again!"
      );
      return;
    }

    const { data } = response;

    const blogs: BlogPostCardProps[] = data.items.map((item: any) => ({
      title: item.title || "Untitled",
      excerpt: item.description || "",
      date:
        Utils.formateDateLabel({ ms: parseInt(item.createdAt || "0") }) || "",
      image: item.coverImage?.url || "",
      image_alt: item.coverImage?.alt || "Blog Cover Image",
      category: item.category || "Trending",
      link: `/blog/${item.url || "#"}`,
    }));

    setBlogPosts(blogs);
    setPaginationLength(data.total_pages || 1);
  };

  useEffect(() => {
    const pageIndex = params?.page_idx ? Number(params.page_idx) : 1;
    setPageIdx(pageIndex);
    getBlogs({ page_idx: pageIndex });
  }, [params]);

  const goNext = (page: number) => Math.min(page + 1, PaginationLength);
  const goPrev = (page: number) => Math.max(page - 1, 1);

  return (
    <>
      {isLoading ? (
        <LoaderUi
          props={{
            isLabel: true,
          }}
        />
      ) : null}

      {warningAlert ? (
        <ToastersUi
          props={{
            type: warningAlertType,
            message: warningAlertMessage,
            callback: () => setWarningAlert(false),
          }}
        />
      ) : null}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Blog posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

          <div className="mt-10 flex justify-center w-full">
            <ul className="hidden overflow-x-auto justify-start mx-auto border border-gray-200 divide-x divide-gray-200 md:inline-flex">
              <li>
                {PageIdx <= 1 ? (
                  <div className="block p-3 px-2 font-medium bg-white opacity-50">
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-6 h-6 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"></path>
                      </svg>
                      <span className="hidden text-sm font-semibold text-gray-900 xl:block">
                        Previous
                      </span>
                    </div>
                  </div>
                ) : (
                  <a
                    className="block p-3 px-2 font-medium bg-white"
                    href={`/blog/page/${goPrev(PageIdx)}`}
                  >
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-6 h-6 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"></path>
                      </svg>
                      <span className="hidden text-sm font-semibold text-gray-900 xl:block">
                        Previous
                      </span>
                    </div>
                  </a>
                )}
              </li>

              {[...Array(PaginationLength)].map((_, idx) => (
                <li
                  key={`pagination-page-${PageIdx}-${idx}`}
                  className={
                    idx + 1 == PageIdx
                      ? `block p-3 px-4 font-semibold ring-1 ring-inset ring-primary-300 bg-primary-50 text-primary-600`
                      : ""
                  }
                >
                  {idx + 1 == PageIdx ? (
                    <span>{idx + 1}</span>
                  ) : (
                    <a
                      className="block p-3 px-4 font-medium text-gray-700 bg-white"
                      href={`/blog/page/${idx + 1}`}
                    >
                      {idx + 1}
                    </a>
                  )}
                </li>
              ))}

              {/* <li className="block p-3 px-4 font-medium text-gray-700 bg-white disabled">
                            <span>...</span>
                        </li> */}

              <li>
                {PageIdx >= PaginationLength ? (
                  <div className="block p-3 px-4 font-medium text-gray-700 bg-white opacity-50">
                    <div className="flex items-center space-x-1">
                      <span className="hidden text-sm font-semibold text-gray-900 xl:block">
                        Next
                      </span>
                      <svg
                        className="w-6 h-6 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"></path>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <a
                    className="block p-3 px-4 font-medium text-gray-700 bg-white"
                    href={`/blog/page/${goNext(PageIdx)}`}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="hidden text-sm font-semibold text-gray-900 xl:block">
                        Next
                      </span>
                      <svg
                        className="w-6 h-6 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"></path>
                      </svg>
                    </div>
                  </a>
                )}
              </li>
            </ul>
            <ul className="inline-flex justify-center mx-auto border border-gray-200 divide-x divide-gray-200 md:hidden">
              <li>
                <div className="block p-3 px-4 font-medium text-gray-700 bg-white opacity-50">
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-6 h-6 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"></path>
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">
                      Previous
                    </span>
                  </div>
                </div>
              </li>

              <li>
                <a
                  className="block p-3 px-4 font-medium text-gray-700 bg-white"
                  href="/blog/page/2"
                >
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-semibold text-gray-900">
                      Next
                    </span>
                    <svg
                      className="w-6 h-6 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"></path>
                    </svg>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPageSection;
