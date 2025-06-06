
import proxyConfig from '../../config/reverseProxy';
import ApiHandler from '../../helpers/ApiHandler'

class BlogAgent {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async generate(params) {

        const response = await this.apiHandler.request({
            base_url: proxyConfig['blogAgentBaseUrl'],
            method: 'POST',
            endpoint: "/blog/generate",
            has_token: false,
            params: params,
        })

        return response
    }
}

export default BlogAgent;