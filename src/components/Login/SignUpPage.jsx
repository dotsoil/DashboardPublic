import React, { useState, useRef } from "react";
import { Container, Form, Button } from "react-bootstrap";
import SocialIcons from "../SocialIcons";
import PhoneRegister from "./PhoneRegister";
import MailRegister from "./MailRegister";
import API from "../../utils/API";
import { toast } from "react-toastify";

function SignUpPage({ handleClose, LoginWithPhone, ...props }) {
  const [registerWithPhone, setRegisterWithPhone] = useState(false);
  const containerRef = useRef(null);

  const getVerificationCode = async (phoneNumber, userName) => {
    //validate phone number with country code
    const phoneRegex = /^\+?([0-9]{3})\)?([0-9]{9})$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert("Please enter a valid phone number");
    }
    try {
      const response = await API.post(`registerPhone`, {
        Fname: userName,
        phone: phoneNumber,
      });
      console.log(response);
      return true;
    } catch (error) {
      return false;
    }
  };

  const phoneRegister = async (e) => {
    console.log("register with phone", e);
    let isValidCre = await getVerificationCode(e.phoneNumber, e.userName);
    if (!isValidCre) {
      // show the toast
      toast.error("Invalid Credentials");
      return;
    }
    // hide the containerref
    // append new input to the form to input the code sent to the phone number
    containerRef.current.style.display = "none";
    // create the input and append it to the document Form.input bootstrap
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Verification Code";
    input.className = "form-control";
    input.style.width = "80%";
    input.pattern = "[0-9]{6}";
    // style the input to be 50 percent of the width of the container
    containerRef.current.parentNode.appendChild(input);
    // append the button to the form
    const p = document.createElement("p");
    // Code not received? Resend
    p.innerText = "Code not received?";
    const a = document.createElement("a");
    a.innerText = "Resend";
    a.style.color = "blue";
    a.style.cursor = "pointer";
    a.style.fontWeight = "bold";
    p.appendChild(a);
    p.style.textAlign = "center";
    // style the p to be 50 percent of the width of the container

    containerRef.current.parentNode.appendChild(p);

    // add the event listener to the p
    p.addEventListener("click", (event) => {
      console.log("resend code", e);
      getVerificationCode(e.phoneNumber);
    });

    const btn = document.createElement("button");
    // bellow the input and style it to be 50 percent of the width of the container with bootstrap
    btn.className = "btn btn-outline-primary";
    btn.innerText = "Submit";
    containerRef.current.parentNode.appendChild(btn);

    // add the event listener to the button
    btn.addEventListener("click", async (event) => {
      // check if the input is empty
      if (input.value === "" || input.value === null) {
        // show the toast
        // return
      }
      LoginWithPhone(e.phoneNumber, input.value);
    });
  };

  const handleRegister = async (e) => {
    if (registerWithPhone) {
      phoneRegister(e);
    } else {
      console.log("register", e);
      // send the data to the server to register the user
      let text =
        "Thank you for registering with us please check your email for verification";
      await API.post("/register", {
        Fname: e.userName,
        email: e.email,
        password: e.password,
      })
        .then((res) => {
          console.log(res);
          containerRef.current.style.display = "none";
          // create the h2 and append it to the document
          const h2 = document.createElement("h2");
          h2.innerText =
            "Thank you for registering with us please check your email for verification";
          h2.style.textAlign = "center";
          containerRef.current.parentNode.appendChild(h2);err.response.status
          containerRef.current.parentNode.appendChild(loginBtn);
        })
        .catch((err) => {
          
          // if error code is 409
          toast.error(err);
          if (err?.response?.status === 409) {
            toast.info("Email already exists please login");
          }
          handleClose();
          return;
        });
    }
  };

  return (
    <>
      <Container className="signup-container" {...props} ref={containerRef}>
        <h3>Let's create your account</h3>
        <p>Signing up is easy. It only takes a few steps</p>
        <SocialIcons
          signByPhone={() => setRegisterWithPhone(true)}
          signByEmail={() => setRegisterWithPhone(false)}
          // signByGoogle={() => console.log("google")}
          // signByLinkedIn={() => console.log("linkedIn")}
          // signByFacebook={() => console.log("facebook")}
          signByEmailText="Sign up with Email"
          signByPhoneText="Sign up with Phone"
          // signByGoogleText="Sign up with Google"
          // signByLinkedInText="Sign up with LinkedIn"
        />
        {!registerWithPhone && <MailRegister handleSubmit={handleRegister} />}
        {registerWithPhone && <PhoneRegister handleSubmit={handleRegister} />}
      </Container>
    </>
  );
}

export default SignUpPage;
