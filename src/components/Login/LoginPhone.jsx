import { Login } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import API from "../../utils/API";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

// Form login with phone and get verification code
function LoginPhone({ onLogin, setLoading }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [cookies, setCookies] = useCookies(["countryCode", "countryName"]);

  const getVerificationCode = async (phoneNumber) => {
    //validate phone number with country code
    setLoading(true);
    const phoneRegex = /^\+?([0-9]{3})\)?([0-9]{9})$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert("Please enter a valid phone number");
    }
    try {
      const response = await API.post(`loginPhoneNumber`, {
        phoneNumber: phoneNumber,
      });
      console.log(response);
        setIsVerificationCodeSent(true);
        setInterval(() => {
          
          setLoading(false);
        }, 2000);
        return;
    } catch (error) {
      toast.error(error.response.data.message);
      setLoa(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <Form.Group>
              {/* country code */}
              <Form.Label>Phone Number</Form.Label>
              <PhoneInput
                defaultCountry={cookies?.countryCode || ""}
                placeholder="Enter phone number"
                value={phoneNumber}
                smartCaret={true}
                onChange={setPhoneNumber}
                onCountryChange={(country) => {
                  setCookies("countryCode", country);
                }}
              />
              <Row>
                <Col xs={12}>
                  <Form.Text>
                    We will send you a verification code to your phone number.
                  </Form.Text>
                </Col>
                <Col>
                  <Button
                    variant="outline-secondary"
                    size="md"
                    onClick={() => {
                      getVerificationCode(phoneNumber);
                    }}
                  >
                    Get Verification Code
                  </Button>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group hidden={!isVerificationCodeSent}>
              <Form.Label>Verification Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="verification code"
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <Form.Text style={styles.Text}>
                Enter the verification code sent to your phone number.
              </Form.Text>
            </Form.Group>
            <Button
              hidden={!isVerificationCodeSent}
              variant="outline-secondary"
              onClick={() => {
                onLogin(phoneNumber, verificationCode);
              }}
            >
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
const styles = {};

export default LoginPhone;
