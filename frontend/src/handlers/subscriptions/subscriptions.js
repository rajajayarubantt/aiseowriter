
import ApiHandler from '../../helpers/ApiHandler'

class Subscriptions {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async get(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: "/subscriptions",
            params: params,
        })

        return response
    }
    async getPlans(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: "/subscriptions/plans",
            params: params,
        })

        return response
    }
    async subscribe(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: "/subscriptions/subscribe",
            params: params,
        })

        return response
    }


}

export default Subscriptions;