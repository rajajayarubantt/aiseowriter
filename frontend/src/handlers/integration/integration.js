
import ApiHandler from '../../helpers/ApiHandler'

class Integration {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async get(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: "/integration",
            params: params,
        })

        return response
    }

    async auth(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: "/integration/auth",
            params: params,
        })

        return response
    }

    async delete(params) {

        const response = await this.apiHandler.request({
            method: 'DELETE',
            endpoint: "/integration",
            params: params,
        })

        return response
    }
}

export default Integration;