import React, {useEffect} from "react";
import { Modal } from "react-bootstrap";
import OnOffIcon from "../../components/OnOffIcon";
import { Col, Row } from "react-bootstrap";
import TimeInputModal from "../../components/TimeInputModal";
import SamplingButton from "../../components/SamplingButton";
function ChannelModal({ show, onHide, channelParam, status, sendMeasurementRequest, sendMaintenanceVacuumRequest, disabled }) {
  const [showTimeInput, setShowTimeInput] = React.useState(false);
  const [minTimeInput, setMinTimeInput] = React.useState(0);
  const [maxTimeInput, setMaxTimeInput] = React.useState(0);
  const [placeholder, setPlaceholder] = React.useState("");

  useEffect(() => {

  }, [status]);

  const sendMaintenance = (type, value) => {
    if (type.includes("Drain")) {
      sendMaintenanceVacuumRequest(show?.channel, "Drain", value);
    }
    if (type.includes("Pump")) {
      sendMaintenanceVacuumRequest(show?.channel, "Pump", value);
    }
    if (type.includes("Sampling")) {
      sendMaintenanceVacuumRequest(show?.channel,"Sampling", value);
    }
  };
  return (
    <Modal show={show.show} onHide={onHide} size="lg" centered >
      
      <Modal.Header closeButton>
        <Modal.Title>Channel {show?.channel}</Modal.Title>
        <SamplingButton 
                disabled={disabled}
                min={0}
                max={60}
                onSend={(value)=>sendMaintenance("Sampling",value)}
        />
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Modal.Title>Vacuum</Modal.Title>
          {/* style col channelrow and clickable */}
          <Col
            style={{ ...styles.channelRow, ...styles.clickAble }}
            onClick={() => {
              setMinTimeInput(0);
              setMaxTimeInput(60);
              setPlaceholder("Drain Time Seconds");
              setShowTimeInput(true);
            }}
          >
            <p>Drain: <OnOffIcon isOn={status?.vacuum?.Drain?.state} /></p>
            
          </Col>
          <Col
          style={{ ...styles.channelRow, ...styles.clickAble }}
          onClick={() => {
            setMinTimeInput(0);
            setMaxTimeInput(60);
            setPlaceholder("Pump Time Seconds");
            setShowTimeInput(true);
          }}
          >
            <p>Pump: <OnOffIcon isOn={status?.vacuum?.Pump?.state}/></p>
          </Col>
          <Col
            style={{ ...styles.channelRow, ...styles.clickAble }}
          >
            <p>Breather <OnOffIcon isOn={status?.vacuum?.Breather?.state} /></p>
          </Col>
          <Col style={styles.channelRow}>
            <p>PT: {status?.vacuum?.PT?.deviceID || " "}</p>
          </Col>
        </Row>
        <Row style={styles.channelRowAsColumn}>
          <Col>
          <p>Last Drain: {status?.vacuum?.Drain?.LastDrain || " "}</p>
          </Col>
          <Col>
          <p>Last Pump: {status?.vacuum?.Pump?.LastPump || " "}</p>
          </Col>          
          <Col>
          <p>Last Pressure: {status?.vacuum?.PT?.LastPressure?.toFixed(2) || " "}</p>
          </Col>
          <Col>
          <p>Last Temperature: {status?.vacuum?.PT?.LastTemperature || " "}</p>
          </Col>
        </Row>
        <Row>
          <Modal.Title
            style={styles.clickAble}
            onClick={() => {
              if (window.confirm("Take Measurement?")) 
              {
                sendMeasurementRequest(show?.channel);
              }
            }}
          >
            Optical Head {channelParam?.OpticalHead?.ID}{" "}
            <OnOffIcon isOn={channelParam?.OpticalHead?.state} />
          </Modal.Title>
          <Col style={styles.channelRow}>
            <p>
              Led Low power: {channelParam?.OpticalHead?.LedLowPower || " "}
            </p>
          </Col>
          <Col style={styles.channelRow}>
            <p>
              Led High power: {channelParam?.OpticalHead?.LedHighPower || " "}
            </p>
          </Col>
        </Row>
      </Modal.Body>
      <TimeInputModal
        disabled={disabled}
        onHide={() => setShowTimeInput(false)}
        show={showTimeInput}
        min={minTimeInput}
        max={maxTimeInput}
        onSend={(value)=>sendMaintenance(placeholder ,value)}
        placeholder={placeholder}
      />
    </Modal>
  );
}

const styles = {
  channelRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "1rem",
  },
  channelRowAsColumn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "1rem",
  },

  // as button
  clickAble: {
    cursor: "pointer",
  },
};

export default ChannelModal;
