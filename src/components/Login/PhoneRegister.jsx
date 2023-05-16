import React,{useState, useRef} from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useCookies } from "react-cookie";


function PhoneRegister({handleSubmit, ...props}) {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validated, setValidated] = useState(false);
  const [cookies, setCookies] = useCookies(["countryCode", "countryName"]);
  
  const formRef = useRef(null);




  return (
    <Form className="register-phone" ref={formRef} {...props}>
      {/* Form name and phone Number  */}
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Enter full name"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
      </Form.Group>

      <Form.Group>
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
        <Form.Text className="text-muted">
          We'll never share your phone with anyone else.
        </Form.Text>
      </Form.Group>
      <Button
        variant="outline-primary"
        type="submit"
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
          } else {
            handleSubmit({ userName, phoneNumber });
          }
        }}
      >
        Submit
      </Button>
    </Form>
  );
}
export default PhoneRegister;
