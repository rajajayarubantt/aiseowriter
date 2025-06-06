
import ApiHandler from '../../helpers/ApiHandler'

class Brands {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async get(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: "/brands",
            params: params,
        })

        return response
    }
    async create(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/brands",
            params: params,
            header_type: 'formdata'
        })

        return response
    }
    async update(params) {

        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: "/brands",
            params: params,
            header_type: 'formdata'
        })

        return response
    }
    async delete(params) {

        const response = await this.apiHandler.request({
            method: 'DELETE',
            endpoint: "/brands",
            params: params,
        })

        return response
    }

}

export default Brands;