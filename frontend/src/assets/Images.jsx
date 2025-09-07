
import Logo from './images/logo.png'
import Login_Banner from './images/login_banner.png'
import Default from './images/default.png'

/*Integrations */
import Integ_Linkedin from './images/integrations/linkedin.png'
import Integ_Blogger from './images/integrations/blogger.png'
import Integ_Ghost from './images/integrations/ghost.jpg'
import Integ_Insta from './images/integrations/insta.png'
import Integ_Notion from './images/integrations/notion.jpg'
import Integ_Shopify from './images/integrations/shopify.svg'
import Integ_Twitter from './images/integrations/twitter.png'
import Integ_Webflow from './images/integrations/webflow.webp'
import Integ_Wordpress from './images/integrations/wordpress.webp'
import Integ_WordpressOrg from './images/integrations/wordpress.org.png'
import Integ_Zapier from './images/integrations/zapier.webp'
import Integ_WebHook from './images/integrations/webhook.png'



import Sitemap from './images/sitemaplinks.png'
import Loading from './images/loading.gif'


const Images = {
    Sitemap,
    Loading,
    Logo,
    Login_Banner,
    Default,
    apps: {
        Linkedin: Integ_Linkedin,
        Zapier: Integ_Zapier,
        Twitter: Integ_Twitter,
        Instagram: Integ_Insta,
        Shopify: Integ_Shopify,
        Webflow: Integ_Webflow,
        Wordpress: Integ_Wordpress,
        Wordpress_org: Integ_WordpressOrg,
        Ghost: Integ_Ghost,
        Blogger: Integ_Blogger,
        Notion: Integ_Notion,
        Webhook: Integ_WebHook,
    },
    integrations: [
        {
            label: 'Linkedin',
            value: 'linkedin',
            selected: true,
            img: Integ_Linkedin
        },
        {
            label: 'Ghost',
            value: 'ghost',
            selected: false,
            img: Integ_Ghost
        },
        {
            label: 'Zapier',
            value: 'zapier',
            selected: false,
            coming_soon: true,
            img: Integ_Zapier
        },
        {
            label: 'X (Twitter)',
            value: 'twitter',
            selected: true,
            coming_soon: true,
            img: Integ_Twitter
        },
        {
            label: 'Instagram',
            value: 'instagram',
            selected: false,
            coming_soon: true,
            img: Integ_Insta
        },
        {
            label: 'Shopify',
            value: 'shopify',
            selected: false,
            coming_soon: true,
            img: Integ_Shopify
        },

        {
            label: 'Wordpress',
            value: 'wordpress',
            selected: false,
            img: Integ_Wordpress
        },
        {
            label: 'Wordpress.Org',
            value: 'wordpress.org',
            selected: false,
            img: Integ_WordpressOrg
        },

        {
            label: 'Blogger',
            value: 'blogger',
            selected: false,
            coming_soon: true,
            img: Integ_Blogger
        },
        {
            label: 'Webflow',
            value: 'webflow',
            selected: false,
            img: Integ_Webflow
        },
        {
            label: 'Notion',
            value: 'notion',
            selected: false,
            img: Integ_Notion
        },
        {
            label: 'Webhook',
            value: 'webhook',
            selected: false,
            coming_soon: false,
            img: Integ_WebHook
        }
    ],

}

export default Images