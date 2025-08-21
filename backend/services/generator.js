require('dotenv')

const config = require('config')
const servicesConfig = config.get('services')

const axios = require('axios')

class Generator {

    constructor() {

        this.base_url = servicesConfig.base_url

        this.generate_titles = this.generate_titles.bind(this)
        this.generate_only_titles = this.generate_only_titles.bind(this)
        this.generate_only_outlines = this.generate_only_outlines.bind(this)
        this.generate_article = this.generate_article.bind(this)
    }

    async generate_titles(params) {

        try {

            const URL = this.base_url + '/blog/generate-titles'

            const response = await axios.post(URL, params);

            return response

        }
        catch (err) {
            console.log(err);
            return false
        }

    }
    async generate_only_titles(params) {

        try {

            const URL = this.base_url + '/blog/generate-only-titles'

            const response = await axios.post(URL, params);

            return response

        }
        catch (err) {
            console.log(err);
            return false
        }

    }
    async generate_only_outlines(params) {

        try {

            const URL = this.base_url + '/blog/generate-only-outlines'

            const response = await axios.post(URL, params);

            return response

        }
        catch (err) {
            console.log(err);
            return false
        }

    }
    async generate_article(params) {

        try {

            const URL = this.base_url + '/blog/generate-article'

            const response = await axios.post(URL, params);

            return response

        }
        catch (err) {
            console.log(err);
            return false
        }

    }



}

module.exports = Generator;