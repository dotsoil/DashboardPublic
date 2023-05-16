import React, { Component, useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
function LoginInfo({ onLogin, handleForgetPassword, forgetPassword, setForgetPassword
 }) {
  const [emailAddress, setEmailAddress] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [password, setPassword] = useState("");
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col>
          <Form>
            <Form.Group>
              <Form.Control
                type="email"
                id="email-input"
                inputMode="email"
                placeholder="Enter email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                onChange={(e) => {
                  // check if email is valid or not
                  if (e.target.validity.valid) {
                    setEmailAddress(e.target.value);
                  }
                }}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            {!forgetPassword && (
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1"></InputGroup.Text>
                <Form.Control
                  placeholder="Password"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  type={hidePassword ? "password" : "text"}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <IconButton
                  onClick={() => setHidePassword(!hidePassword)}
                  className="show-password"
                >
                  {hidePassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputGroup>
            )}
            <Form.Group>
              <Form.FloatingLabel className="forget-password">
                {/* forget a password */}
                {forgetPassword ? (
                  <p>
                    <a onClick={() => setForgetPassword(false)
                    } href="#">
                      Back to Login
                    </a>
                  </p>
                ) : (
                  <p>
                    Forgot Password?{" "}
                    <a onClick={ e=>setForgetPassword(true)} href="#">
                      Click here
                    </a>
                  </p>
                )}
              </Form.FloatingLabel>
            </Form.Group>

            <Button
              variant="outline-secondary"
              onClick={() =>
                forgetPassword
                  ? handleForgetPassword(emailAddress)
                  : onLogin(emailAddress, password)
              }
            >
              {forgetPassword ? "Reset Password" : "Login"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {};
export default LoginInfo;
