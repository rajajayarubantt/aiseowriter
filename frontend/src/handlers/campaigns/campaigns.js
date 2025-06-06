
import ApiHandler from '../../helpers/ApiHandler'

class Campaigns {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async get(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: "/campaigns",
            params: params,
        })

        return response
    }
    async create(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/campaigns",
            params: params,
        })

        return response
    }
    async update(params) {

        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: "/campaigns",
            params: params,
        })

        return response
    }
    async delete(params) {

        const response = await this.apiHandler.request({
            method: 'DELETE',
            endpoint: "/campaigns",
            params: params,
        })

        return response
    }

}

export default Campaigns;