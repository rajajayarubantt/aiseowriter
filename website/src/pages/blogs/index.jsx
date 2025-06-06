import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

/*Assets */
import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

/*Component */
import BlogReference from '../../components/BlogReference'
import Testimonials from '../../components/Testimonials'
import Pricing from '../../components/Pricing'
import FAQ from '../../components/FAQ'
import FooterBanner from '../../components/FooterBanner'

const Index = () => {

  const navigator = useNavigate()

  const [Blogs, setBlogs] = useState([
    {
      id: 'blog_01',
      title: 'Use AI to generate relevant content ideas',
      banner: Images.banners.usecase,
      category: 'AI automation',
      tags: ['AI', 'GenAI', 'AGI', 'Blogs'],
      url: '/blog/kasjhd'
    }
  ])

  const handlePricingCallback = (duration, id) => {
    navigator(`/early-bird-program?price_id=${id}&price_duration=${duration}`)

  }

  return (
    <div className="home-container-main">

      <BlogReference
        title="Articles & Resources"
        desc="Welcome to the Zenblogs's Blog"
        filters={[
          'AI automation', 'Leads', 'SaaS', 'Health care', 'Support', 'Marketing', 'Finance', 'HR'
        ]}
        items={Blogs}
      />

      <Pricing
        title="Budget pricing for all use cases"
        desc="Enhance your blogging workflow with fluid & user-first AI-generated content."
        discount="Use Discount Code 'GREAT50OFF' 🎉"
        pricing_items={[
          {
            id: 'free',
            header_label: 'Free',
            header_tag: '',
            amount: {
              monthly: "$0",
              yearly: "$0"
            },
            callback: handlePricingCallback,
            recommented: false,
            free_plan: true,
            features_title: "",
            features: [
              '3 AI Blog Articles',
              'Infography Generation for Blog',
              'AI-powered Autoblogger',
              '10+ Apps Integration',
              'Email Support',
            ]

          },
          {
            id: 'lite',
            header_label: 'Lite',
            header_tag: 'Starter',
            amount: {
              monthly: "$15",
              yearly: "$7.5"
            },
            callback: handlePricingCallback,
            recommented: false,
            features_title: "",
            features: [
              '25 AI Blog Articles / Month',
              'Infography Generation for Blog',
              '100+ languages supported',
              'AI-powered Autoblogger',
              '10+ Apps Integration',
              '1 User Account',
              'Email Support',
            ]

          },
          {
            id: 'pro',
            header_label: 'Pro',
            header_tag: '⭐ Recommended',
            amount: {
              monthly: "$30",
              yearly: "$15"
            },
            callback: handlePricingCallback,
            recommented: true,
            features_title: "",
            features: [
              '100 AI Blog Articles / Month',
              '100 AI Image Generations for Blog',
              'Infography Generation for Blog',
              '100+ languages supported',
              'AI-powered Autoblogger',
              '10+ Apps Integration',
              'Add upto 5 users',
              'Priority Email Support',
              'Live Chat Support',
            ]

          },
        ]}
      />

      {/* <Testimonials
        title="Wall of Love"
        desc="Join thousands of happy creators using Zenblogs"
        items={{
          full_item: {
            message: `
              I found ZenBlog.ai and now it's my go-to tool for making sure I never miss a blog post, content update, or SEO opportunity! It lets me pick the topics I want, adjust the writing style to match my brand voice, and make any edits where needed before publishing. I've gone from needing a writer, an SEO specialist, and a full-time editor to being able to create, optimize, and schedule high-quality blogs completely on my own. It’s crazy how much time and money this tool has saved me. I used to struggle just to get one blog post out every two weeks — now I'm posting twice a week without breaking a sweat.
              <br /><br />
              Before ZenBlog.ai, my site barely crossed 100 organic visitors a month, and most posts just sat there with no traction. Since using it, my blog traffic has more than tripled, and I'm finally seeing real engagement and leads from my content. The built-in SEO features and smart topic suggestions have made a massive difference for my overall marketing strategy. If you're serious about building a brand, driving organic traffic, and staying consistent with content, ZenBlog.ai is an absolute game-changer. If you aren't using it yet, you're seriously missing out. Huge shoutout to the ZenBlog team — keep up the amazing work!
            `,
            author_profile: Images.creators[3],
            author_name: 'Olivia Chen',
            author_role: 'Content Marketing Manager at BrightWave'
          },
          items: [
            {
              message: `
                  "ZenBlog.ai has cut our content production time by almost 80%. The consistency it's brought to our blog has directly boosted our inbound leads. It’s like having a full-time content team on autopilot!"
                `,
              author_profile: Images.creators[2],
              author_name: 'Marcus Reed',
              author_role: 'Founder of ScaleUp Agency'
            },
            {
              message: `
                "Coming up with new blog topics used to be our team's biggest bottleneck. ZenBlog.ai’s AI topic suggestions are scarily good — it feels like it understands my niche better than some of our writers!"
                `,
              author_profile: Images.creators[1],
              author_name: 'Priya Sharma',
              author_role: 'Content Marketing Manager at Clarity Digital'
            }
          ]
        }}
      /> */}

      <FAQ
        subtitle="Got Questions?"
        title="Frequently Asked Questions"
        desc="Can't find what you're looking for? Contact our support team for more help."
        items={[
          {
            question: 'What is your refund policy?',
            answer: 'Refunds are only available for yearly plans. Please contact us within 30 days of purchase.'
          },
          {
            question: `Can I use the generated blogs for commercial purposes?`,
            answer: 'Yes, you own full rights to the generated infographics. Please refer to our terms of use for more details.'
          },
          {
            question: `What is the LLM model behind Zenblog?`,
            answer: 'Currently, we are using Custom Top-Layer Anlyzer + GPT-4o-mini, which is well-suited for our use case. However, the LLM model will be changed/optimized based on trends and technologies.'
          },
          {
            question: `Are there any special discounts for non-profits/educational institutions?`,
            answer: 'Yes, we value your work and provide you with up to a 30% discount! Contact us with the details of your organization.'
          },
          {
            question: `How can I contact Zenblog?`,
            answer: 'You can send an email to zenblogs.ai@gmail.com'
          },

        ]}
      />

      <FooterBanner />



    </div>
  );
};

export default Index;
