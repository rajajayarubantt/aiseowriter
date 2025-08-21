
import ApiHandler from '../../helpers/ApiHandler'

class Sitemap {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async get(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: "/sitemap",
            params: params,
        })

        return response
    }
    async import(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/sitemap",
            params: params,
        })

        return response
    }
    async update(params) {

        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: "/sitemap/",
            params: params,
        })

        return response
    }
    async refresh(params) {

        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: "/sitemap/refresh",
            params: params,
        })

        return response
    }
    async activate(params) {

        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: "/sitemap/activate",
            params: params,
        })

        return response
    }

    async delete(params) {

        const response = await this.apiHandler.request({
            method: 'DELETE',
            endpoint: "/sitemap",
            params: params,
        })

        return response
    }

}

export default Sitemap;