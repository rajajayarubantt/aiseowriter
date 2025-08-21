
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
import Integ_Zapier from './images/integrations/zapier.webp'






import Loading from './images/loading.gif'


const Images = {
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
        Ghost: Integ_Ghost,
        Blogger: Integ_Blogger,
        Notion: Integ_Notion,
    },
    integrations: [
        {
            label: 'Linkedin',
            value: 'linkedin',
            selected: true,
            img: Integ_Linkedin
        },
        {
            label: 'Zapier',
            value: 'zapier',
            selected: false,
            img: Integ_Zapier
        },
        {
            label: 'X (Twitter)',
            value: 'twitter',
            selected: true,
            img: Integ_Twitter
        },
        {
            label: 'Instagram',
            value: 'instagram',
            selected: false,
            img: Integ_Insta
        },
        {
            label: 'Shopify',
            value: 'shopify',
            selected: false,
            img: Integ_Shopify
        },
        {
            label: 'Webflow',
            value: 'webflow',
            selected: false,
            img: Integ_Webflow
        },
        {
            label: 'Wordpress',
            value: 'wordpress',
            selected: false,
            img: Integ_Wordpress
        },
        {
            label: 'Ghost',
            value: 'ghost',
            selected: false,
            img: Integ_Ghost
        },
        {
            label: 'Blogger',
            value: 'blogger',
            selected: false,
            img: Integ_Blogger
        },
        {
            label: 'Notion',
            value: 'notion',
            selected: false,
            img: Integ_Notion
        },
    ],

}

export default Images