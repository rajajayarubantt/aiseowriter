
import ApiHandler from '../../helpers/ApiHandler'

class Schedules {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async get(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: "/schedules",
            params: params,
        })

        return response
    }
    async create(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/schedules",
            params: params,
        })

        return response
    }
    async generate_title(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/schedules/generate-title",
            params: params,
        })

        return response
    }
    async update(params) {

        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: "/schedules",
            params: params,
        })

        return response
    }
    async delete(params) {

        const response = await this.apiHandler.request({
            method: 'DELETE',
            endpoint: "/schedules",
            params: params,
        })

        return response
    }

}

export default Schedules;