
import Logo from './images/logo.png'

import Creator_01 from '../assets/images/creators/01.jpg'
import Creator_02 from '../assets/images/creators/02.png'
import Creator_03 from '../assets/images/creators/03.jpg'
import Creator_04 from '../assets/images/creators/04.jpg'

import Compay_01 from '../assets/images/companies/01.webp'
import Compay_02 from '../assets/images/companies/02.png'
import Compay_03 from '../assets/images/companies/03.png'

import Integ_Linkedin from '../assets/images/integrations/linkedin.png'
import Integ_Blogger from '../assets/images/integrations/blogger.png'
import Integ_Ghost from '../assets/images/integrations/ghost.jpg'
import Integ_Insta from '../assets/images/integrations/insta.png'
import Integ_Notion from '../assets/images/integrations/notion.jpg'
import Integ_Shopify from '../assets/images/integrations/shopify.svg'
import Integ_Twitter from '../assets/images/integrations/twitter.png'
import Integ_Webflow from '../assets/images/integrations/webflow.webp'
import Integ_Wordpress from '../assets/images/integrations/wordpress.webp'
import Integ_Zapier from '../assets/images/integrations/zapier.webp'


import Demo_gif_01 from '../assets/images/demo_gif_01.png'
import Demo_gif_02 from '../assets/images/demo_gif.png'

import Demo_gif from '../assets/images/demo.mp4'
import Tick_gif from '../assets/images/tick.gif'

import Banner_Usecase from '../assets/images/banners/usecase.png'

const Images = {
    Logo,

    creators: [Creator_01, Creator_02, Creator_03, Creator_04],
    companies: [Compay_01, Compay_02, Compay_03, Compay_01, Compay_02, Compay_03],
    integrations: [
        {
            label: 'Linkedin',
            img: Integ_Linkedin
        },
        {
            label: 'Zapier',
            img: Integ_Zapier
        },
        {
            label: 'X (Twitter)',
            img: Integ_Twitter
        },
        {
            label: 'Instagram',
            img: Integ_Insta
        },
        {
            label: 'Shopify',
            img: Integ_Shopify
        },
        {
            label: 'Webflow',
            img: Integ_Webflow
        },
        {
            label: 'Wordpress',
            img: Integ_Wordpress
        },
        {
            label: 'Ghost',
            img: Integ_Ghost
        },
        {
            label: 'Blogger',
            img: Integ_Blogger
        },
        {
            label: 'Notion',
            img: Integ_Notion
        },
    ],

    demo_gif: Demo_gif,
    demo_gif_01: Demo_gif_01,
    demo_gif_02: Demo_gif_02,

    tick_gif: Tick_gif,
    banners: {
        usecase: Banner_Usecase
    }
}

export default Images