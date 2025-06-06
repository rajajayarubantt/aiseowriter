import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

/*Assets */
import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

/*Component */
import ButtonsWrapper from '../../components/ButtonsWrapper'
import Buttons from '../../components/Buttons'
import BotPatternBG from '../../components/BotPatternBG'
import CreatorWrapper from '../../components/CreatorWrapper'
import CompaniesWrapper from '../../components/CompaniesWrapper'
import ProductDemo from '../../components/ProductDemo'
import UseCase from '../../components/UseCase'
import Integrations from '../../components/Integrations'
import WhySection from '../../components/WhySection'
import BlogReference from '../../components/BlogReference'
import Testimonials from '../../components/Testimonials'
import Pricing from '../../components/Pricing'
import FAQ from '../../components/FAQ'
import FooterBanner from '../../components/FooterBanner'

/*Sub Pages */
import EarlybirdForm from '../earlybirdform'

const Index = () => {

  const navigator = useNavigate()

  const [ProductHuntVotes, setProductHuntVotes] = useState(500)
  const ProductHuntSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="250" height="54" viewBox="0 0 250 54" version="1.1">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-130.000000, -73.000000)">
          <g transform="translate(130.000000, 73.000000)">
            <rect stroke="#FF6154" stroke-width="1" fill="#FFFFFF" x="0.5" y="0.5" width="249" height="53" rx="10"/>
            <text font-family="Helvetica-Bold, Helvetica" font-size="9" font-weight="bold" fill="#FF6154">
              <tspan x="53" y="20">FEATURED ON</tspan>
            </text>
            <text font-family="Helvetica-Bold, Helvetica" font-size="21" font-weight="bold" fill="#FF6154">
              <tspan x="52" y="40">Product Hunt</tspan>
            </text>
                <g transform="translate(201.000000, 13.000000)" fill="#FF6154">
          <g>
            <polygon points="26.0024997 10 15 10 20.5012498 0"/>
            <text font-family="Helvetica-Bold, Helvetica" font-size="13" font-weight="bold" line-spacing="20">
              <tspan x="9.100000000000001" y="27">${ProductHuntVotes}</tspan>
            </text>
          </g>
        </g>
    
            <g transform="translate(11.000000, 12.000000)"><path d="M31,15.5 C31,24.0603917 24.0603917,31 15.5,31 C6.93960833,31 0,24.0603917 0,15.5 C0,6.93960833 6.93960833,0 15.5,0 C24.0603917,0 31,6.93960833 31,15.5" fill="#FF6154"/><path d="M17.4329412,15.9558824 L17.4329412,15.9560115 L13.0929412,15.9560115 L13.0929412,11.3060115 L17.4329412,11.3060115 L17.4329412,11.3058824 C18.7018806,11.3058824 19.7305882,12.3468365 19.7305882,13.6308824 C19.7305882,14.9149282 18.7018806,15.9558824 17.4329412,15.9558824 M17.4329412,8.20588235 L17.4329412,8.20601152 L10.0294118,8.20588235 L10.0294118,23.7058824 L13.0929412,23.7058824 L13.0929412,19.0560115 L17.4329412,19.0560115 L17.4329412,19.0558824 C20.3938424,19.0558824 22.7941176,16.6270324 22.7941176,13.6308824 C22.7941176,10.6347324 20.3938424,8.20588235 17.4329412,8.20588235" fill="#FFFFFF"/></g>
          </g>
        </g>
      </g>
    </svg>
`

  const handleRedirection = (url) => {
    navigator(url)
  }

  const handlePricingCallback = (duration, id) => {
    navigator(`/early-bird-program?price_id=${id}&price_duration=${duration}`)

  }

  return (
    <>
      <Routes>
        <Route exact path={`/early-bird-program*`} element={<EarlybirdForm />}></Route>
      </Routes>
      <div className="home-container-main">
        <div className="home-hero-container-main">
          <BotPatternBG />
          <div className="home-hero-container-content">
            <div className="hero-tag-main animation-appear">
              <div className="tag-label">Automate Blog posting with</div>
              <div className="tag-chip">No Clicks 🚀</div>
            </div>
            <h1 className="hero-title">Turn Brand Insights into SEO-Optimized Blogs Posting<br /> — Autonomously</h1>
            <p className="hero-desc">
              Our AI agent creates and publishes high-ranking blogs using your brand
              profile — choosing trending keywords, writing SEO-friendly content, and auto-posting
              to LinkedIn, your website, and more — all in autopilot mode.
            </p>
            <ButtonsWrapper
              classes="animation-appear"
            >

              <Buttons
                width='auto'
                type='dark'
                icon={Icons.default.rocket}
                label='Get Early Access!'
                callback={() => handleRedirection('/early-bird-program')}
              />
              <Buttons
                width='auto'
                type='outline'
                icon={Icons.default.circle_play}
                label='Watch demo'
              />

            </ButtonsWrapper>
            {/* <div className="featured-wrapper animation-appear">
              <div className="featured-item"
                dangerouslySetInnerHTML={{ __html: ProductHuntSVG }}
              ></div>
            </div> */}

            <CreatorWrapper
              title="More than 500+ requested"
              images={Images.creators}
            />
            {/* <CompaniesWrapper
            classes="animation-appear-container"
            title="700+ companies already joined ZenBlogs!"
            images={Images.companies}
          /> */}

          </div>
        </div>

        <ProductDemo
          classes="animation-appear-container"
          type="height_auto"
          image={Images.demo_gif_01}
        />

        <UseCase
          header={{
            subtitle: 'Use cases',
            title: 'Build SEO-Optimized Blog Instantly <br /> — No Hassle, Just Results',
            desc: `Our AI Blog Agent transforms brand insights into publish-ready content in minutes. With smart topic discovery, seamless multi-platform publishing, and zero manual effort, it’s the fastest way to keep your brand visible, relevant, and trusted—everywhere your audience is.`,
            actions: [
              {
                type: 'dark',
                icon: Icons.default.magic_stick,
                label: 'Get Early Access!',
                callback: () => handleRedirection('/early-bird-program')
              },
              {
                type: 'primary',
                icon: Icons.default.docs,
                label: 'Read more',
                callback: () => { }
              },
            ]
          }}
          usecases={[
            {
              title: 'Consistent Blogging Without Hassle',
              desc: `Keeping your blog active takes hours and a dedicated team. Our AI writes, optimizes, and publishes for you—saving up to 90% of content effort. Never miss a posting schedule again.`,
              icon: Icons.default.recycle,
              link: '#'
            },
            {
              title: 'Rank on Google with Zero Effort',
              desc: `Struggling to rank despite writing regularly? Our system picks trending keywords and crafts SEO-optimized blogs—helping you grow organic traffic 3x faster without an SEO expert.`,
              icon: Icons.default.ranking,
              link: '#'
            },
            {
              title: 'Auto-Publish Across All Platforms',
              desc: `Manually sharing blogs to LinkedIn, Medium, and websites wastes time. We distribute your content instantly and everywhere—boosting visibility and reach by up to 70%.`,
              icon: Icons.default.ai,
              link: '#'
            },
            {
              title: 'Convert Visitors with Authority Content',
              desc: `Building trust through content is hard when you’re busy. Our blogs explain your domain value with clarity—helping convert readers to leads 5x better than generic AI content.`,
              icon: Icons.default.customer,
              link: '#'
            },
          ]}
          banner={Images.banners.usecase}
        />

        <Integrations />

        <ProductDemo
          classes="animation-appear-container"
          type="fullsreen"
          _video={Images.demo_gif}
        />

        <WhySection />

        <BlogReference
          title="See Our Agent Generated Blogs — That Drive Real Results"
          desc="Explore high-ranking, SEO-optimized blog examples created from real brand data. Our AI-Agent turns brand insights into traffic-driving content published across platforms."
          filters={[
            'AI automation', 'Leads', 'SaaS', 'Health care', 'Support', 'Marketing', 'Finance', 'HR'
          ]}
          items={[
            {
              id: 'blog_01',
              title: 'Use AI to generate relevant content ideas',
              banner: Images.banners.usecase,
              category: 'AI automation',
              tags: ['AI', 'GenAI', 'AGI', 'Blogs'],
              url: '/blog/kasjhd'
            }
          ]}
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
    </>
  );
};

export default Index;
