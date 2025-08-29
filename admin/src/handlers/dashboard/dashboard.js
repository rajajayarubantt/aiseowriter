
import ApiHandler from '../../helpers/ApiHandler'

class Dashboard {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async get(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: "/dashboard",
            params: params,
        })

        return response
    }


}

export default Dashboard;