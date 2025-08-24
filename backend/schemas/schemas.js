require('dotenv');

const ALLOWED_PLATFORMS = String(process.env.ALLOWED_PLATFORMS).split(',');

const Joi = require('joi')

const Auth_Schemas = {

  register: Joi.object({
    email: Joi.string().email().required(),
  }),

  verifylogin: Joi.object({
    email: Joi.string().email().required(),
    token: Joi.string().required(),
  }),

  onboard: Joi.object({
    details: Joi.object().required(),
  }),

}

const Schedules_Schemas = {

  get_schedules: Joi.object({
    id: Joi.string().allow('', null),
    columns: Joi.string().allow('', null),
    search: Joi.string().allow('', null),

    industry: Joi.string().allow('', null),
    category: Joi.string().allow('', null),
    language: Joi.string().allow('', null),

    start_date: Joi.string().allow('', null),
    end_date: Joi.string().allow('', null),

    time: Joi.string().allow('', null),

    media: Joi.string().allow('', null),
  }),
  create_schedules: Joi.object({
    name: Joi.string().required(),
    brand_id: Joi.number().allow(null),
    description: Joi.string().allow('', null),
    industry: Joi.string().required(),
    category: Joi.string().required(),
    language: Joi.string().required(),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    posts: Joi.array().required(),
    days: Joi.string().required(),
    keywords: Joi.string().required(),
    tone: Joi.string().allow('', null),
    media: Joi.string().required(),
    call_to_action: Joi.string().allow('', null),
  }),
  update_schedules: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    brand_id: Joi.number().allow(null),
    description: Joi.string().allow('', null),
    industry: Joi.string().required(),
    category: Joi.string().required(),
    language: Joi.string().required(),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    posts: Joi.array().required(),
    days: Joi.string().required(),
    keywords: Joi.string().required(),
    tone: Joi.string().allow('', null),
    media: Joi.string().required(),
    call_to_action: Joi.string().allow('', null),

    status: Joi.number().allow('', 0, 1),

  }),
  delete_schedules: Joi.object({
    id: Joi.string().required(),
  }),


}
const Articles_Schemas = {


  get_articles: Joi.object({
    id: Joi.string().allow('', null),
    columns: Joi.string().allow('', null),
    search: Joi.string().allow('', null),
    slug: Joi.string().allow('', null),
    category: Joi.string().allow('', null),
    page: Joi.number().allow(null),
    limit: Joi.number().allow(null),
  }),
  generate_title: Joi.object({
    id: Joi.string().allow(null, ''),
    keywords: Joi.array(),
    cover_image: Joi.string().allow(null, ''),
    language: Joi.string().required(),
    brand_id: Joi.number().allow(null),
    brand_name: Joi.string().allow(null),
    description: Joi.string().allow('', null),
  }),
  generate_content: Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    keywords: Joi.array(),
    title_options: Joi.array(),
    outlines: Joi.array(),
    description: Joi.string().allow(null, ''),
    language: Joi.string().allow(null, ''),
    brand_name: Joi.string().allow(null, ''),
    tone: Joi.string().allow(null, ''),
    view: Joi.string().allow(null, ''),
    length: Joi.string().allow(null, ''),
    inter_links: Joi.boolean(),
  }),
  update_article: Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    cover_image: Joi.object()
  }),
  delete_article: Joi.object({
    id: Joi.string().required(),
  }),

}
const Campaigns_Schemas = {


  get_campaigns: Joi.object({
    id: Joi.string().allow('', null),
    columns: Joi.string().allow('', null),
    search: Joi.string().allow('', null),
    page: Joi.number().allow(null),
    limit: Joi.number().allow(null),
  }),
  create_campaign: Joi.object({
    keywords: Joi.array(),
    cover_image: Joi.string().required(),
    language: Joi.string().required(),
    brand_id: Joi.number().allow(null),
    brand_name: Joi.string().allow(null),
    description: Joi.string().allow('', null),

    name: Joi.string().required(),
    tone: Joi.string().allow('', null),
    view: Joi.string().allow('', null),
    length: Joi.string().allow('', null),
    schedule_type: Joi.string().allow('', null),
    post_count: Joi.string().allow('', null),
    post_daily: Joi.boolean(),
    inter_links: Joi.boolean(),
    time_zone: Joi.string().allow('', null),
    platforms: Joi.array(),
    post_custom_time_zones: Joi.array(),

  }),
  delete_campaign: Joi.object({
    id: Joi.string().required(),
  }),

}


const Integration_Schemas = {
  auth_integration: Joi.object({
    app: Joi.string().required().allow(...ALLOWED_PLATFORMS),
    details: Joi.string().allow(null, '')
  }),
  update_integration: Joi.object({
    app: Joi.string().required().allow(...ALLOWED_PLATFORMS),
    details: Joi.object().required()
  }),
  get_schema: Joi.object({
    app: Joi.string().required().allow(...ALLOWED_PLATFORMS),
    details: Joi.object().required()
  }),
  linkedin_auth_callback: Joi.object({
    code: Joi.string().required(),
    state: Joi.string().required()
  }),
  wordpressorg_auth_callback: Joi.object({
    code: Joi.string().required(),
    state: Joi.string().required()
  }),
  notion_auth_callback: Joi.object({
    code: Joi.string().required(),
    state: Joi.string().required()
  }),
  webflow_auth_callback: Joi.object({
    code: Joi.string().required(),
    state: Joi.string().required()
  }),
  shopify_auth_callback: Joi.object({
    code: Joi.string().required(),
    state: Joi.string().required(),
    shop: Joi.string().allow(null, ''),
    hmac: Joi.string().allow(null, ''),
    timestamp: Joi.string().allow(null, ''),
    host: Joi.string().allow(null, ''),
  }),
  delete_connection: Joi.object({
    id: Joi.string().required(),
  }),
}

const Brands_Schemas = {

  get_brands: Joi.object({
    id: Joi.string().allow('', null),
    columns: Joi.string().allow('', null),
    search: Joi.string().allow('', null),

    industry: Joi.string().allow('', null),
    category: Joi.string().allow('', null),

  }),
  create_brand: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    category: Joi.string().required(),
    website: Joi.string().required(),
    brand_template: Joi.string().allow('', null),
    logo: Joi.string().allow(''),
  }),
  update_brand: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    category: Joi.string().required(),
    website: Joi.string().required(),
    brand_template: Joi.string().allow('', null),
    logo: Joi.string().allow(''),
  }),
  delete_brand: Joi.object({
    id: Joi.string().required(),
  }),


}
const Platforms_Schemas = {

  post_platform: Joi.object({
    article_id: Joi.string().required(),
    platform: Joi.string().required()
  }),


}
const Sitemap_Schemas = {

  get_sitemaps: Joi.object({
    id: Joi.string().allow('', null),
    columns: Joi.string().allow('', null),
    search: Joi.string().allow('', null),


  }),
  update_sitemap: Joi.object({
    id: Joi.string().required(),
    data: Joi.object().required(),
  }),
  activate_sitemap: Joi.object({
    id: Joi.string().required(),
  }),
  import_sitemap: Joi.object({
    sitemap_url: Joi.string().required(),

  }),
  refresh_sitemap: Joi.object({
    id: Joi.string().required(),

  }),

  delete_sitemap: Joi.object({
    id: Joi.string().required(),
  }),


}

const Users_Schemas = {

  get_users: Joi.object({
    id: Joi.string().allow('', null),
    columns: Joi.string().allow('', null),
    search: Joi.string().allow('', null),
  }),
  create_user: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
  }),
  update_user: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
  }),
  delete_user: Joi.object({
    id: Joi.string().required(),
  }),


}
const Earlybirds_Schemas = {

  get_earlybirds_lists: Joi.object({
    email: Joi.string().allow('', null),


  }),
  create_earlybirds_list: Joi.object({
    email: Joi.string().required(),
    params: Joi.string().allow('', null),
  }),
  update_earlybirds_list: Joi.object({
    id: Joi.string().required(),
    email: Joi.string().required(),
    name: Joi.string().allow('', null),
    status: Joi.string().allow('', null),
  })

}
const PublicBlogs_Schemas = {

  get_public_blogs_lists: Joi.object({
    id: Joi.string().allow('', null),
    slug: Joi.string().allow('', null),
    search: Joi.string().allow('', null),
    category: Joi.string().allow('', null),
    projection: Joi.string().allow('', null),
    page: Joi.number().allow(null),
    limit: Joi.number().allow(null),
  })


}

const Subscriptions_Schemas = {
  get_subscription_plans: Joi.object({
    id: Joi.string().allow('', null),
    search: Joi.string().allow('', null),
    projection: Joi.string().allow('', null),
    page: Joi.number().allow(null),
    limit: Joi.number().allow(null),
  }),
}

const Admin_Schemas = {

  admin_register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  admin_get_articles: Joi.object({
    id: Joi.string().allow('', null),
    slug: Joi.string().allow('', null),
    search: Joi.string().allow('', null),
    category: Joi.string().allow('', null),
    projection: Joi.string().allow('', null),
    page: Joi.number().allow(null),
    limit: Joi.number().allow(null),
  }),
  admin_generate_title: Joi.object({
    keywords: Joi.array(),
    cover_image: Joi.string().required(),
    language: Joi.string().required(),
    brand_id: Joi.number().allow(null),
    description: Joi.string().allow('', null),

  }),
  admin_delete_article: Joi.object({
    id: Joi.string().required(),
  }),

  admin_get_plans: Joi.object({
    id: Joi.string().allow('', null),
    search: Joi.string().allow('', null),
    projection: Joi.string().allow('', null),
    page: Joi.number().allow(null),
    limit: Joi.number().allow(null),
  }),
  admin_create_plans: Joi.object({
    name: Joi.string().required(),
    monthly_plan_id: Joi.string().required(),
    yearly_plan_id: Joi.string().required(),
    blog_count: Joi.string().required(),
    image_count: Joi.string().required(),
    keywords_count: Joi.string().required(),
    monthly_price: Joi.string().required(),
    sitemap_count: Joi.string().required(),
    status: Joi.string().required(),
    users_count: Joi.string().required(),
    recommended: Joi.boolean().required(),
    is_freeplan: Joi.boolean().required(),
    features: Joi.array(),
  }),
  admin_update_plans: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    monthly_plan_id: Joi.string().required(),
    yearly_plan_id: Joi.string().required(),
    blog_count: Joi.string().required(),
    image_count: Joi.string().required(),
    keywords_count: Joi.string().required(),
    monthly_price: Joi.string().required(),
    sitemap_count: Joi.string().required(),
    status: Joi.string().required(),
    users_count: Joi.string().required(),
    recommended: Joi.boolean().required(),
    is_freeplan: Joi.boolean().required(),
    features: Joi.array(),
  }),
  admin_delete_plans: Joi.object({
    id: Joi.string().required()
  }),

  admin_create_subscription: Joi.object({
    subscription_id: Joi.string().required(),
    status: Joi.string().required(),
  }),
}

module.exports = { ...Auth_Schemas, ...Admin_Schemas, ...Subscriptions_Schemas, ...Platforms_Schemas, ...Schedules_Schemas, ...Sitemap_Schemas, ...Articles_Schemas, ...Campaigns_Schemas, ...Integration_Schemas, ...Brands_Schemas, ...Users_Schemas, ...Earlybirds_Schemas, ...PublicBlogs_Schemas };