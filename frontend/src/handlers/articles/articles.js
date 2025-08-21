
import ApiHandler from '../../helpers/ApiHandler'

class Articles {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async get(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: "/articles",
            params: params,
        })

        return response
    }
    async generate_title(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/articles/generate-title",
            params: params,
        })

        return response
    }
    async regenerate_title(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/articles/regenerate-title",
            params: params,
        })

        return response
    }
    async regenerate_outlines(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/articles/regenerate-outlines",
            params: params,
        })

        return response
    }
    async generate_content(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/articles/generate-content",
            params: params,
        })

        return response
    }
    async update_article(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/articles/update-article",
            params: params,
        })

        return response
    }
    async update(params) {

        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: "/articles",
            params: params,
        })

        return response
    }
    async delete(params) {

        const response = await this.apiHandler.request({
            method: 'DELETE',
            endpoint: "/articles",
            params: params,
        })

        return response
    }

}

export default Articles;