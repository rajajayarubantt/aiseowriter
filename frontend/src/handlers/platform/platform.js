
import ApiHandler from '../../helpers/ApiHandler'

class Platforms {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async post(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/platform",
            params: params,
        })

        return response
    }

}

export default Platforms;