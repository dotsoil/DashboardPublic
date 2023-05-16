import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginInfo from "../components/Login/LoginInfo";
import AlertComponent from "../components/AlertComponent";
import Loader from "../components/Loader";
import { Button, Image } from "react-bootstrap";
import LoginPhone from "../components/Login/LoginPhone";
import { ToastContainer, toast } from "react-toastify";
import API from "../utils/API";
import globalContext from "../context/GlobalContext";
import "../scss/components/LoginPage.scss";
import { EmailOutlined, StarBorderOutlined, StarBorderTwoTone, StartOutlined } from "@mui/icons-material";
import SocialIcons from "../components/SocialIcons";
import DotsLogo from "../components/Login/DotsLogo";
import SignUpPage from "../components/Login/SignUpPage";

export default function LoginPage() {
  const navigate = useNavigate();
  const [signByEmail, setSignByEmail] = useState(true);
  const [signByPhone, setSignByPhone] = useState(false);
  const [signUpPage, setSignUpPage] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessageHeading, setAlertMessageHeading] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const { user, setUser, setIsUserLoggedIn } = useContext(globalContext);

  const LoginWithMail = async (userName, password) => {
    setLoading(true);
    //validate email
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(userName)) {
      toast.error("Please enter a valid email");
      setLoading(false);
      return;
    }
    //validate password

    try {
      const response = await API.post("/login", {
        email: userName,
        password,
      })
        .then((response) => {
          if (response?.status === 200) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            setUser(response.data.user);
            setIsUserLoggedIn(true);
            setLoading(false);
            navigate("/");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setInterval(() => {
            setLoading(false);
          }, 2000);
        });
    } catch (error) {
      toast.error("Please enter valid credentials");

      setLoading(false);
    }
  };

  const handleForgetPassword = (email) => {
    if (email !== "" && email !== undefined) {
      API.post("/resetPassword", { email })
        .then((response) => {
          if (response.status === 200) {
            toast.success("Password reset link has been sent to your mail");
            setForgetPassword(!forgetPassword);
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setForgetPassword(!forgetPassword);
        });
    } else {
      toast.error("Please enter your email");
    }
  };

  const LoginWithPhone = async (phoneNumber, verificationCode) => {
    setLoading(true);
    try {
      const response = await API.post("/loginPhoneNumber", {
        phoneNumber,
        verificationCode,
      });
      if (response.status === 200) {
        //Save access and refresh token to local storage
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/home");
        setUser(response.data.user);
        setIsUserLoggedIn(true);
        setLoading(false);
      } else {
        toast.error("Invalid Verification Code");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Invalid Verification Code");
      setLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    setLoading(true);
    // open a new window to the google login url and get the response from server
    const googleLoginWindow = window.open(
      API.defaults.baseURL + "google",
      "_blank"
    );
    // listen for message from server

    // try {
    //   const response = await API.get("/google");
    //   if (response.status === 200) {
    //     //Save access and refresh token to local storage
    //     localStorage.setItem("accessToken", response.data.accessToken);
    //     localStorage.setItem("refreshToken", response.data.refreshToken);
    //     localStorage.setItem("user", JSON.stringify(response.data.user));
    //     navigate("/home");
    //     setUser(response.data.user);
    //     setIsUserLoggedIn(true);
    //     setLoading(false);
    //   }
    // } catch (error) {
    //   toast.error("Something went wrong", error);
    //   setLoading(false);
    // }
  };

  const handleCloseSignUp = () => {
    setSignUpPage(false);
    setSignByEmail(true);
  };

  return (
    <Card className="loginContainer">
      <DotsLogo className="logo" />
      {!signUpPage && (
        <Col className="form-container">
          <h2 className="loginHeading">Welcome Back</h2>
          <p className="loginSubHeading">Login to your account</p>
          <Row>
            <Col className="signInButton">
              <SocialIcons
                signByEmail={() => {
                  setSignByPhone(false);
                  setSignUpPage(false);
                  setForgetPassword(false);
                  setSignByEmail(true);
                }}
                signByPhone={() => {
                  setSignByEmail(false);
                  setSignUpPage(false);
                  setSignByPhone(true);
                }}
                // signByGoogle={() => {
                //   handleGoogleLogin();
                // }}
              />
            </Col>
          </Row>
          <Row className="line">
            <hr />
          </Row>
          <Row>
            {/* Choose login options */}
            <Col>
              {signByEmail && (
                <LoginInfo
                  onLogin={LoginWithMail}
                  handleForgetPassword={(mail) => {
                    handleForgetPassword(mail);
                  }}
                  forgetPassword={forgetPassword}
                  setForgetPassword={e => setForgetPassword(e)}
                />
              )}
              {signByPhone && (
                <LoginPhone onLogin={LoginWithPhone} setLoading={setLoading} />
              )}
            </Col>
          </Row>
          <Row>
            <Col>{loading && <Loader size={100} />}</Col>
          </Row>
        </Col>
      )}
      {signUpPage && (
        <Col className="form-signUp">
          <SignUpPage
            handleClose={handleCloseSignUp}
            LoginWithPhone={(phoneNumber, verificationCode) => {
              LoginWithPhone(phoneNumber, verificationCode);
            }}
          />
        </Col>
      )}

      <Col className="intro-background">
        <Container className="intro-container">
          <h3 className="intro-heading">
            Revolutionize your farming game with our cutting-edge nitrate
            measurement technology.
          </h3>
          <h5 className="intro-subheading">
            not only will you be saving money, but you'll also be doing your
            part in reducing plant pollution while having access to vital data
            that was once unavailable to farmers.
            {/* show icon 5 times */}
            <p className="star-icons">
              {Array(5)
                .fill()
                .map((item, index) => {
                  return (
                    <StarBorderTwoTone className="star-icon" key={index} />
                  );
                })}
            </p>
          </h5>
        </Container>
        <Button
          variant="outline-primary"
          className="close-btn"
          onClick={
            signUpPage
              ? handleCloseSignUp
              : () => {
                  setSignByEmail(false);
                  setSignByPhone(false);
                  setSignUpPage(true);
                }
          }
        >
          {signUpPage ? "Login" : "Sign Up"}
        </Button>
      </Col>
    </Card>
  );
}
