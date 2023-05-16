import React from "react";
import { Form, Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { ImLab } from "react-icons/im";

const SamplingIntervalModal = ({ show, onHide, onSend, min, max }) => {
  const [value, setValue] = React.useState(null);
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Sampling Time</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Control
            type="number"
            placeholder="sampling time in seconds"
            min={min}
            max={max}
            onChange={(e) => {
              if (e.target.value < min) {
                e.target.value = min;
              }
              if (e.target.value > max) {
                e.target.value = max;
              }
              setValue(e.target.value);
            }}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outlined-secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="outlined-primary"
          onClick={() => {
            onSend(value);
            onHide();
          }}
        >
          Send Command
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const SamplingButton = ({ onSend, min, max, disabled }) => {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="outlined-primary" onClick={handleShow} disabled={disabled}>
        <ImLab size={22} />
      </Button>

      <SamplingIntervalModal
        show={show}
        onHide={handleClose}
        onSend={(value) =>
          onSend(value)
        }
        min={min}
        max={max}
      />
    </>
  );
};

export default SamplingButton;
