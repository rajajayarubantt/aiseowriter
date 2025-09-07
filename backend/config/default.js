module.exports = {
	production: process.env.PRODUCTION,
	hostname: process.env.HOSTNAME,
	port: process.env.PORT,
	appSecret: process.env.APP_SECRET,

	BASE_URL: process.env.BASE_URL,

	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,

	PAYMENT_GATEWAY_BASE_URL: process.env.PAYMENT_GATEWAY_BASE_URL,
	PAYMENT_GATEWAY_API_KEY: process.env.PAYMENT_GATEWAY_API_KEY,

	GOOGLE_GEMINI_APIKEY: process.env.GOOGLE_GEMINI_APIKEY,

	AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
	AWS_REGION: process.env.AWS_REGION,
	AWS_BUCKET: process.env.AWS_BUCKET,

	X_SECRET_KEY: process.env.X_SECRET_KEY,

	authConfig: {
		EMAIL_LENGTH: 40,
		PASSWORD_LENGTH: 25,
		NAME_LENGTH: 25,
		AUTH_SECRET: process.env.AUTH_SECRET,
		AUTH_COOKIE_EXPIRE_TIME: "1200s",
		AUTH_COOKIE_ALGORITHM: "HS384",
		ACCESS_TOKEN: process.env.ACCESS_TOKEN
	},
	aws: {
		bucket: process.env.AWS_BUCKET,
		accessKey: process.env.AWS_ACCESS_KEY,
		secretKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION,
	},
	reverseProxy: {
		frontendBaseUrl: "",
	},
	mysqlConfig: {
		DB_SERVER: process.env.MYSQL_URI,
		DB_USER: process.env.MYSQL_USER,
		DB_PASSWORD: process.env.MYSQL_PASS,
		DB_NAME: process.env.MYSQL_DB,
		DEMO_DB_NAME: process.env.MYSQL_DEMO_DB,
	},
	mongoDBConfig: {
		URI: process.env.MONGO_URI,
		DB: process.env.MONGO_DB
	},
	mysqlTables: {
		USERS: `users`,
		SCHEDULES: `schedules`,
		ARTICLES: `articles`,
		CAMPAIGNS: `campaigns`,
		BLOG_PLATFORMS: `blog_platforms`,
		BRANDS: `brands`,
		EARLYBIRD_LISTS: `earlybirds_lists`,

		ADMIN_USERS: `admin_users`,
		PUBLIC_BLOGS: `public_blogs`,
		MONGO_BLOGS: `blogs`,
		SITEMAPS: `sitemaps`,
		MONGO_CAMPAIGNS: `campaigns`,
		INTEGRATION: `integration`,

		SUBSCRIPTION_PLANS: `subscription_plans`,
		SUBSCRIPTIONS: `subscriptions`,
	},
	redis: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASSWORD
	},
	integrations: {
		linkedin: {
			base_url: process.env.LINKEDIN_BASE_URL,
			client_id: process.env.LINKEDIN_CLIENT_ID,
			client_secret: process.env.LINKEDIN_CLIENT_SECRET,
			scope: process.env.LINKEDIN_SCOPE,
			redirection_url: process.env.LINKEDIN_REDIRECT_URI,
		},
		wordpress: {
			base_url: process.env.WORDPRESS_BASE_URL,
			auth_url: process.env.WORDPRESS_AUTH_URL,
			client_id: process.env.WORDPRESS_CLIENT_ID,
			client_secret: process.env.WORDPRESS_CLIENT_SECRET,
			scope: process.env.WORDPRESS_SCOPE,
			redirection_url: process.env.WORDPRESS_REDIRECT_URI,
		},
		notion: {
			base_url: process.env.NOTION_BASE_URL,
			client_id: process.env.NOTION_CLIENT_ID,
			client_secret: process.env.NOTION_CLIENT_SECRET,
			redirection_url: process.env.NOTION_REDIRECT_URI,
		},
		webflow: {
			base_url: process.env.WEBFLOW_BASE_URL,
			auth_url: process.env.WEBFLOW_AUTH_URL,
			client_id: process.env.WEBFLOW_CLIENT_ID,
			client_secret: process.env.WEBFLOW_CLIENT_SECRET,
			redirection_url: process.env.WEBFLOW_REDIRECT_URI,
		},
		shopify: {
			base_url: process.env.SHOPIFY_BASE_URL,
			client_id: process.env.SHOPIFY_CLIENT_ID,
			client_secret: process.env.SHOPIFY_CLIENT_SECRET,
			scope: process.env.SHOPIFY_SCOPE,
			redirection_url: process.env.SHOPIFY_REDIRECT_URI,
		},
	},
	services: {
		base_url: process.env.GENERATOR_BASE_URL,
	}
};