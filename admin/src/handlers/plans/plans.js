
import ApiHandler from '../../helpers/ApiHandler'

class Plans {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async get(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: "/plans",
            params: params,
        })

        return response
    }
    async create(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/plans",
            params: params,
        })

        return response
    }

    async update(params) {

        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: "/plans",
            params: params,
        })

        return response
    }
    async delete(params) {

        const response = await this.apiHandler.request({
            method: 'DELETE',
            endpoint: "/plans",
            params: params,
        })

        return response
    }

}

export default Plans;