import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Custom hook*/
import { useAuth } from "../../hooks/AuthContext";

const VerifyLogin = () => {


    const navigator = useNavigate()
    const { login } = useAuth();

    const checkLoginRequested = async () => {

        let email = await localStorage.getItem('login-email')

        if (!email) navigator('/login')

    }

    const checkLoggedInSuccefully = () => {

        const queryParams = new URLSearchParams(window.location.search);

        const access_token = queryParams.get("access_token");
        const userdetails = queryParams.get("userdetails");

        if (access_token && userdetails) login(access_token, userdetails)
    }

    useEffect(() => {
        checkLoginRequested()
        checkLoggedInSuccefully()

    }, [])


    return (
        <div className="verifylogin-page-main">
            <div className="verifylogin-content-main">
                <img className="content-logo" src={Images.Logo} />
                <div className="content-title">Check your email</div>
                <div className="content-desc">A sign in link has been sent to <br /> your email address.</div>
                <Link className="content-copyright" to="https://aiseowrite.in/" target="_blank">aiseowrite.in</Link>
            </div>
        </div>
    )
}

export default VerifyLogin