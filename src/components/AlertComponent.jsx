import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

function AlertComponent({ alertType, heading, body, show, setShow }) {
  return show ? (
    <Alert variant={alertType} onClose={() => setShow(false)} dismissible>
      <Alert.Heading>{heading}</Alert.Heading>
      <p>{body}</p>
    </Alert>
  ) : (
    <></>
  );
}
export default AlertComponent;
