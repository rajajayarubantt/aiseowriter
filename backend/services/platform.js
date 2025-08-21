require('dotenv')

const config = require('config')
const servicesConfig = config.get('services')

const axios = require('axios')

class Platform {

    constructor() {

        this.base_url = servicesConfig.base_url

        this.post = this.post.bind(this)
    }

    async post(params) {

        try {

            const URL = this.base_url + '/platform'

            const response = await axios.post(URL, params);

            return response

        }
        catch (err) {
            console.log(err);
            return false
        }

    }



}

module.exports = Platform;