
import ApiHandler from '../../helpers/ApiHandler'

class Customers {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async get(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: "/customers",
            params: params,
        })

        return response
    }


}

export default Customers;