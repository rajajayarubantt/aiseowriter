import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";

import ReactMarkdown from "react-markdown";

/*Assets */
import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const ViewSingleBlog = () => {

  const { blog_id } = useParams()
  const navigator = useNavigate()

  const [LatestBlogs, setLatestBlogs] = useState([
    {
      id: '1',
      icon: Icons.default.blogs,
      title: 'BlogSEO vs ChatGPT: Which is Right Your',
      url: '/blog/12334'
    },
    {
      id: '1',
      icon: Icons.default.blogs,
      title: 'BlogSEO vs ChatGPT: Which is Right Your',
      url: '/blog/12334'
    },
    {
      id: '1',
      icon: Icons.default.blogs,
      title: 'BlogSEO vs ChatGPT: Which is Right Your',
      url: '/blog/12334'
    },
    {
      id: '1',
      icon: Icons.default.blogs,
      title: 'BlogSEO vs ChatGPT: Which is Right Your',
      url: '/blog/12334'
    },
    {
      id: '1',
      icon: Icons.default.blogs,
      title: 'BlogSEO vs ChatGPT: Which is Right Your',
      url: '/blog/12334'
    },
  ])
  const [FeatureBanners, setFeatureBanners] = useState([
    {
      id: '1',
      img: Images.banners.usecase,
      url: '/blog/12334'
    },
    {
      id: '1',
      img: Images.banners.usecase,
      url: '/blog/12334'
    },
    {
      id: '1',
      img: Images.banners.usecase,
      url: '/blog/12334'
    },
  ])

  const [BlogThumbnail, setBlogThumbnail] = useState(Images.banners.usecase)
  const [BlogTitle, setBlogTitle] = useState('BlogSEO vs ChatGPT: Which is Right Your Content Strategy in 2025?')
  const [BlogFeatured, setBlogFeatured] = useState(true)
  const [BlogPostedAt, setBlogPostedAt] = useState('December 1, 2024')
  const [BlogContent, setBlogContent] = useState(`
  # Elevate Your SaaS & Tech Presence: Automate Blogging with Zenblogs ai

**Engage, Convert, Expand: Transform Your Blogging Strategy**

Are you struggling to stay top of the game in your SaaS & Tech industry? Do you want to rank higher on Google without spending too much time or money? Turn Brand Insights into SEO-Optimized Blogs Posting—Autonomously! 🚀  

**Hook:**  
Imagine this: every blog post takes just a few minutes, and your brand stays ahead. Zenblogs ai is here to help you automate the blogging process, ensuring consistency and boosting visibility for all platforms.  

**Why Zenblogs ai?**  
- **Consistent Blogging Without Hassle**: Automate posting with zero clicks, saving time and reducing stress.  
- **Rank on Google with Zero Effort**: Ensure your content is authoritative to boost search rankings.  
- **Auto-Publish Across All Platforms**: Max efficiency by publishing seamlessly across all mediums.  
- **Convert Visitors with Authority Content**: Craft engaging, keyword-rich content that drives traffic.  

**How It Works**: Automate blog posting while maintaining a natural flow. Use Zenblogs ai's AI to generate high-quality, SEO-Optimized posts, boosting your visibility and conversion rates.

**Examples & Benefits**: Whether you're launching a new SaaS product or expanding into Tech innovation, Zenblogs ai helps you post consistently with no manual effort. From initial blog creation to long-form content, it ensures your brand stays relevant and effective.

**Conclusion**: Elevate your strategy today. Automate blogging with Zenblogs ai—start building a stronger presence in the competitive market. Engage your audience, convert visitors, and expand your brand's visibility without the stress of manual effort.
    `)

  const handleBack = () => {
    navigator('/blog')
  }

  return (
    <div className="viewblog-page-main">
      <div className="viewblog-page-content">
        <div className="viewblog-header-main">
          <div className="viewblog-header-content">
            <div className="header-thumbnail">
              <img src={BlogThumbnail} alt={blog_id} />
            </div>
            <div className="header-details">
              <div
                className="details-back-btn"
                onClick={() => handleBack()}
              >
                <div className="back-btn-icon"
                  dangerouslySetInnerHTML={{ __html: Icons.default.dropdown_arrow }}
                ></div>
                <div className="back-btn-label">Blogs & News</div>
              </div>
              <div className="details-title">{BlogTitle}</div>
              <div className="details-tags">
                {BlogFeatured &&
                  <div className="details-featured-tag">
                    <div className="featured-icon"
                      dangerouslySetInnerHTML={{ __html: Icons.default.featured }}
                    ></div>
                    <div className="featured-label">Featured</div>
                  </div>
                }
                <div className="details-tag">{BlogPostedAt}</div>

              </div>
            </div>
          </div>
        </div>
        <div className="viewblog-container-sections">
          <div className="viewblog-container-sections-content">
            <div className="blog_content-section">
              <div className="blog_content-section-content">
                <ReactMarkdown>{BlogContent}</ReactMarkdown>
              </div>
            </div>
            <div className="sidebar_content-section">
              <div className="sidebar_content-blogs">
                <div className="sidebar_content-blogs-title">Latest articles</div>
                <div className="sidebar_content-blogs-items">
                  {LatestBlogs?.map((blog, idx) => (
                    <a
                      key={`sidebar_content-blogs-item-${idx}`}
                      href={blog.url || '#'}
                      className="sidebar_content-blogs-item"
                    >
                      <div className="blog-item-icon"
                        dangerouslySetInnerHTML={{ __html: blog.icon }}
                      ></div>
                      <div className="blog-item-label">{blog.title}</div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="sidebar_content-banners">
                <div className="sidebar_content-banners-title">Features & Benefits</div>
                <div className="sidebar_content-banners-items">
                  {FeatureBanners?.map((blog, idx) => (
                    <a
                      key={`sidebar_content-banners-item-${idx}`}
                      href={blog.url || '#'}
                      className="sidebar_content-banners-item"
                    >
                      <img src={blog.img} alt="" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSingleBlog;
