
import ApiHandler from '../../helpers/ApiHandler'

class Earlybirds {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async create(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/earlybirds",
            has_token: false,
            params: params,
        })

        return response
    }

}

export default Earlybirds;