module.exports = {
	production: process.env.PRODUCTION,
	hostname: process.env.HOSTNAME,
	port: process.env.PORT,
	appSecret: process.env.APP_SECRET,
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
	},
	redis: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASSWORD
	}
};