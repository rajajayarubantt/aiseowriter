
import ApiHandler from '../../helpers/ApiHandler'

class Users {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async get(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: "/users",
            params: params,
        })

        return response
    }
    async create(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/users",
            params: params,
        })

        return response
    }
    async update(params) {

        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: "/users",
            params: params,
        })

        return response
    }
    async delete(params) {

        const response = await this.apiHandler.request({
            method: 'DELETE',
            endpoint: "/users",
            params: params,
        })

        return response
    }

}

export default Users;