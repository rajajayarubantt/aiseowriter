import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Helpers */
import Utils from "../../helpers/utils";

/*Components*/
import Buttons from "../../components/Buttons";
import Inputs from "../../components/Inputs";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'

/*handler*/
import AuthHandler from '../../handlers/auth/auth'

/*Custom hook*/
import { useAuth } from "../../hooks/AuthContext";

const Login = ({ type = 'login' }) => {

  const navigator = useNavigate()
  const { isAuthenticated, login } = useAuth();
  const authHandler = new AuthHandler()

  const [Email, setEmail] = useState("");
  const [EmailInvalid, setEmailInvalid] = useState(false);

  const [EmailDeBounce, setEmailDeBounce] = useState(null)
  const [EmailDeBounce_Delay, setEmailDeBounce_Delay] = useState(1000)

  const [isLoading, setIsLoading] = useState(false)
  const [warningAlert, setWarningAlert] = useState(false)
  const [warningAlertType, setWarningAlertType] = useState('error')
  const [warningAlertMessage, setwarningAlertMessage] = useState("Failed to login")

  const handleGoogleLogin = () => {
    const GOOGLE_OAUTH_CLIENT_ID =
      "240459934728-jsct47v74s7k18c19nan792kracma9cq.apps.googleusercontent.com";
    const GOOGLE_OAUTH_REDIRECT_URI = "http://localhost:5000/api/v1/auth/verifygoogleauth";

    window.open(
      `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${GOOGLE_OAUTH_REDIRECT_URI}&response_type=code&scope=email profile`,
      "_self"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (EmailInvalid) {
      setWarningAlert(true)
      setWarningAlertType('error')
      setwarningAlertMessage('Please enter valid email!')
      return
    }

    let payload = {
      email: Email
    }

    setIsLoading(true)

    let response = await authHandler.signup(payload)

    setIsLoading(false)

    if (!response.success) {
      setWarningAlert(true)
      setWarningAlertType('error')
      setwarningAlertMessage(response.message || 'Failed to login, Please try again!')
    }

    localStorage.setItem('login-email', Email)

    navigator('/verify-login')

  }

  const handleInputChange = (key, value) => {
    if (key == "email") {
      setEmail(value)

      if (EmailDeBounce) clearTimeout(EmailDeBounce)

      setEmailDeBounce(setTimeout(() => ValidateForm(value), EmailDeBounce_Delay))
    }
  };

  const ValidateForm = (email) => {
    if (email) setEmailInvalid(!Utils.validateEmailFormat(email));
  };

  const checkAlreadyLoggedIn = () => {
    console.log(isAuthenticated, 'isAuthenticated');

    if (isAuthenticated) {
      navigator("/", { replace: true });
    }
  }

  useEffect(() => {
    checkAlreadyLoggedIn()
  }, [isAuthenticated, navigator]);

  // useEffect(() => {
  //   ValidateForm();
  // }, [Email]);

  return (
    <>

      {isLoading ?

        <Loaders
          props={{
            isLabel: true
          }} />
        : null}
      {warningAlert ?

        <Toasters
          props={{
            type: warningAlertType,
            message: warningAlertMessage,
            callback: (confirmation) => setWarningAlert(false)
          }} />
        : null}

      <div className="login-page-main">
        <section className="login-banner">
          <img
            className="banner-img"
            src={Images.Login_Banner}
            alt="login_banner"
          />
        </section>
        <section className="login-container">
          <div className="container-logo">
            <img className="logo-img" src={Images.Logo} alt="logo" />
            <div className="logo-name">Ai SEO Writer</div>
          </div>
          <div className="container-content">
            <div className="content-title">{type == 'login' ? 'Sign in' : 'Create New Account'}</div>

            <Buttons
              type="default"
              icon={Icons.logos.google}
              label="Continue with Google"
              width="max"
              callback={handleGoogleLogin}
            />

            <div className="content-or">or</div>
            <form className="content-form" onSubmit={handleSubmit}>
              <div className="form-inputs">
                <Inputs
                  id="login-email-input"
                  type="text"
                  width="max"
                  input_props={{
                    type: "text",
                    value: Email,
                    required: true,
                    placeholder: "example@gmail.com",
                    label: "Email",
                    onChange: (val) => handleInputChange("email", val),
                    invalid: EmailInvalid,
                    invalid_label: "Please enter a valid email address",
                  }}
                />
              </div>
              <div className="form-actions">
                <div className="form-action">
                  <Buttons
                    type="primary"
                    button_type="submit"
                    width="max"
                    label="Send Magic Link"
                  />
                </div>
              </div>
            </form>
            <div className="content-redirection">
              {type == 'login' ? <>
                Don't have an account?&nbsp;
                <Link className="primary-text" to={"/signup"}>
                  Sign up
                </Link>
              </> : <>
                Already have an account?&nbsp;
                <Link className="primary-text" to={"/login"}>
                  Signin
                </Link>
              </>}
            </div>

            <div className="content-redirection">
              By signing {type == 'login' ? 'in' : 'up'}, you agree to our&nbsp;
              <Link className="primary-text" to={"/terms-of-use"}>
                Terms of Use
              </Link>
              &nbsp;and <br />
              <Link className="primary-text" to={"/privacy-policy"}>
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="container-copyright">© ZenSaaS 2025</div>
        </section>
      </div>
    </>
  );
};

export default Login;
