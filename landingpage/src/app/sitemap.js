import React from "react";

export const revalidate = 60;

import PublicBlogsHandler from "../handlers/publicblogs/publicblogs";

const sitemap = async () => {

  const BASE_URL = "https://aiseowrite.in"

  const publicBlogsHandler = new PublicBlogsHandler();
  const blogs_response = await publicBlogsHandler.get({ projection: 'url' });
  const BlogPosts = blogs_response.success
    ? blogs_response.data.items.map(item => ({

      url: `${BASE_URL}/blog/${item.url || "#"}`,
      changeFrequency: 'monthly',
      priority: 0.5,
    }))
    : [];

  return [
    {
      url: BASE_URL,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: BASE_URL + '/blog',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: BASE_URL + '/terms-of-use',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: BASE_URL + '/privacy-policy',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...BlogPosts
  ];
}

export default sitemap