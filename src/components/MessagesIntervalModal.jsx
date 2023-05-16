import React,{useState} from "react";
import { Form, Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { TimerRounded } from "@mui/icons-material";
import {PubSub} from 'aws-amplify';

const MessagesIntervalModal = ({ show, onHide, onSend, min, max }) => {
  
  const [status, setStatus] = useState(null);
  const [measurement, setMeasurement] = useState(null);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Messages Interval</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Measurement Interval</Form.Label>
          <Form.Control
            type="number"
            placeholder="Leave blank to leave"
            min={min}
            max={max}
            onChange={(e) => {
              // validate the input and check range min and max
              if (e.target.value < min) {
                e.target.value = min;
              }
              if (e.target.value > max) {
                e.target.value = max;
              }
              setMeasurement(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Status Interval</Form.Label>
          <Form.Control
            type="number"
            placeholder="Leave blank to leave"
            min={min}
            max={max}
            onChange={(e) => {
              // validate the input and check range min and max
              if (e.target.value < min) {
                e.target.value = min;
              }
              if (e.target.value > max) {
                e.target.value = max;
              }
              setStatus(e.target.value);
            }}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={() => onSend(status, measurement)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

//button components with timer icon

const TimerButton = ({
  text,
  style,
  showTimerModal,
  setShowTimerModal,
  updateMessageInterval,
  disabled,
}) => {
  return (
    <>
      <Button
        variant="outline-secondary"
        onClick={() => setShowTimerModal(true)}
        disabled={disabled}
      >
        <TimerRounded />
        INTERVALS
      </Button>
      {showTimerModal && (
      <MessagesIntervalModal
        min={0}
        max={180}
        show={showTimerModal}
        onHide={() => setShowTimerModal(false)}
        onSend={(status, measurement) => {
          setShowTimerModal(false);

          //send command to aws mqtt server topic "device/${Sensor.Sid}/command"
          updateMessageInterval(status, measurement);
        }}
      />
      )}
    </>
  );
};

export default TimerButton;
