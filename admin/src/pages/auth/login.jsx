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
import AdminHandler from '../../handlers/admin/admin'

/*Custom hook*/
import { useAuth } from "../../hooks/AuthContext";

const Login = ({ type = 'login' }) => {

  const navigator = useNavigate()
  const { isAuthenticated, login } = useAuth();
  const adminHandler = new AdminHandler()

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const [EmailInvalid, setEmailInvalid] = useState(false);
  const [PasswordInvalid, setPasswordInvalid] = useState(false);

  const [EmailDeBounce, setEmailDeBounce] = useState(null)
  const [PasswordBounce, setPasswordBounce] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [warningAlert, setWarningAlert] = useState(false)
  const [warningAlertType, setWarningAlertType] = useState('error')
  const [warningAlertMessage, setwarningAlertMessage] = useState("Failed to login")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (EmailInvalid || !Password.length) {
      setWarningAlert(true)
      setWarningAlertType('error')
      setwarningAlertMessage('Please enter valid email!')
      return
    }

    let payload = {
      email: Email,
      password: Password
    }

    setIsLoading(true)

    let response = await adminHandler.login(payload)

    setIsLoading(false)

    if (!response.success) {
      setWarningAlert(true)
      setWarningAlertType('error')
      setwarningAlertMessage(response.message || 'Failed to login, Please try again!')
      return
    }

    let access_token = response.data?.auth_token || ""
    let userdetails = response.data?.userdetails || undefined

    if (access_token && userdetails) return login(access_token, userdetails)
    else {
      setWarningAlert(true)
      setWarningAlertType('error')
      setwarningAlertMessage('Invalid login, Please login again')
      return
    }

  }

  const handleInputChange = (key, value) => {

    if (key == "email") {
      setEmail(value)

      if (EmailDeBounce) clearTimeout(EmailDeBounce)

      setEmailDeBounce(setTimeout(() => ValidateForm('email', value), 1000))
    }
    else if (key == "password") setPassword(value)
  };

  const ValidateForm = (key, value) => {
    if (key == 'email') setEmailInvalid(!Utils.validateEmailFormat(value));
  };

  const checkAlreadyLoggedIn = () => {
    if (isAuthenticated) {
      navigator("/", { replace: true });
    }
  }

  useEffect(() => {
    checkAlreadyLoggedIn()
  }, [isAuthenticated, navigator]);


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
            <div className="content-title">Admin Login</div>

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
                <Inputs
                  id="login-email-input"
                  type="text"
                  width="max"
                  input_props={{
                    type: "password",
                    value: Password,
                    required: true,
                    placeholder: "✱✱✱✱✱✱",
                    label: "Password",
                    onChange: (val) => handleInputChange("password", val),
                    invalid: PasswordInvalid,
                    invalid_label: "Please enter a strong password",
                  }}
                />
              </div>
              <div className="form-actions">
                <div className="form-action">
                  <Buttons
                    type="primary"
                    button_type="submit"
                    width="max"
                    label="Get In"
                  />
                </div>
              </div>
            </form>

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
