import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
function MailRegister({ handleSubmit, ...props }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState("");
  const formRef = useRef(null);

  return (
    <Form className="mail-register" ref={formRef} {...props}>
      {/* Form full name   email and password*/}
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Enter full name"
          // check if the name is valid not empty
          required
          onChange={(e) => setUserName(e.target.value)}
          pattern="^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$"
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type="email"
          id="email-input"
          placeholder="Enter email"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type="password"
          placeholder="Password"
          //   pattern 8 characters at least 1 Uppercase Alphabet,1 Number
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Button
        variant="outline-primary"
        type="submit"
        // when form submit call handleSubmit function
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          formRef.current.reportValidity();
          if (!formRef.current.checkValidity()) {
            e.stopPropagation();
            toast.error("Please fill all the fields correctly", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            return;
          }
          setValidated(true);
          handleSubmit({ userName, email, password });
        }}
      >
        Submit
      </Button>
    </Form>
  );
}

export default MailRegister;
