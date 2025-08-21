
import ApiHandler from '../../helpers/ApiHandler'

class Auth {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async signup(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/auth/register",
            params: params,
            has_token: false,
        })

        return response
    }
    async login(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/auth/login",
            params: params,
        })

        return response
    }

}

export default Auth;