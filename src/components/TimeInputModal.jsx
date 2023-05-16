// time input modal card style
import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

function TimeInputModal({ show, onHide, onSend, min, max, placeholder, disabled }) {
  const [value, setValue] = React.useState(null);
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Time Input</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <Form.Modal> */}
        <Form.Group>
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="number"
            min={min}
            max={max}
            placeholder={placeholder}
            style={styles.timeInputRange}
            //validate input only number and between min and max
            onChange={(e) => {
              if (e.target.value > max) {
                e.target.value = max;
              }
              if (e.target.value < min) {
                e.target.value = min;
              }
              setValue(e.target.value);
            }}
          />
        </Form.Group>
        {/* </Form.Modal> */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="outline-primary"
          disabled={disabled}
          onClick={() => {
            onSend(value);
            onHide();
          }}
        >
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const styles = {
  timeInputRange: {
    width: "100%",
  },
};

export default TimeInputModal;
