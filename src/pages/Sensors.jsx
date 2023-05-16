import React, { useContext, useEffect, useRef } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import Map from "./Map";
import { Card } from "react-bootstrap";
import "../scss/components/Sensors.scss";
import globalContext from "../context/GlobalContext";
import { CameraAltOutlined } from "@mui/icons-material";
import { QrReader } from "react-qr-reader";
import { toast } from "react-toastify";
import { Image } from "react-bootstrap";
import API from "../utils/API";
import { calculateSizeToUserUnit } from "../utils/globalFunctions";

function Sensors() {
  const { user, userFields, selectedField, setSelectedField } =
    useContext(globalContext);
  const [show, setShow] = React.useState(false);
  const [newSensorId, setNewSensorId] = React.useState("");
  const [showQrCamera, setShowQrCamera] = React.useState(false);
  const qrContainerRef = useRef(null);

  const handleShow = () => {
    // check camera permission and if not ask for it

    setShow(!show);
  };

  const handleClose = () => setShow(false);
  const handleSave = () => {
    // check if the sensor id is valid
    if (newSensorId.length < 10) {
      toast.error("Invalid sensor ID", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    API.post(`/users/${user.uid}/fields/${selectedField.Fid}/sensors`, {
      sensorId: newSensorId,
      latitude: selectedField.location.latitude,
      longitude: selectedField.location.longitude,
    })
      .then((res) => {
        console.log(res);
        const response = res.data;
        if (response.status) {
          toast.error("Error adding sensor", {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          handleClose();
          return;
        }
        toast.success("Sensor added successfully", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error adding sensor", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        handleClose();
      });
    setShow(false);
  };

  return (
    <Container className="sensors-container">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sensors</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* input text sensor ID */}
          <Form.Group className="mb-3">
            <Form.FloatingLabel>
              {showQrCamera && (
                <Card ref={qrContainerRef}>
                  <Card.Header>
                    <h4>Scan QR code</h4>
                    <Image
                      src={
                        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimage.freepik.com%2Ffree-vector%2Fqr-code-related-vector-line-icons-scanning-delivery-box-smartphone-mobile-realistic-style-hand-identification-product-shop-scan-data-with-using_103168-33.jpg&f=1&nofb=1&ipt=f29acd24ea6b8030ee72c7d5257bff7b86d5121301e649627a930caddfc9d840&ipo=images"
                      }
                      style={{
                        width: "30%",
                        height: "30%",
                        objectFit: "contain",
                      }}
                      // add animation to the qr code image
                      className="qr-image"
                    />
                  </Card.Header>
                  <Card.Body>
                    <QrReader
                      id="react-qr-reader"
                      scanDelay={4000}
                      videoContainerStyle={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "5px",
                        backgroundColor: "transparent",
                      }}
                      onResult={(result, error) => {
                        if (result) {
                          setNewSensorId(result.text);
                          // blink the qr container background to indicate that the qr code was read for 1 second
                          toast.info("QR code read successfully", {
                            position: "top-center",
                            autoClose: 500,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          });
                          qrContainerRef.current.style.backgroundColor =
                            "rgba(0, 255, 0, 0.2)";
                          setTimeout(() => {
                            qrContainerRef.current.style.backgroundColor =
                              "transparent";
                          }, 1000);
                        }
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowQrCamera(false);
                      }}
                    >
                      Close
                    </Button>
                  </Card.Footer>
                </Card>
              )}

              <CameraAltOutlined
                onClick={() => {
                  setShowQrCamera(!showQrCamera);
                }}
              />
              <Form.Floating>
                <Form.Control
                  type="text"
                  placeholder="Enter sensor ID"
                  value={newSensorId}
                  onChange={(e) => setNewSensorId(e.target.value)}
                />
                <Form.Label>Sensor ID</Form.Label>
              </Form.Floating>
            </Form.FloatingLabel>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {userFields && userFields.length > 0 ? (
        <>
          <Card>
            <Card.Header>
              <h4>Sensors</h4>
            </Card.Header>
            <Card.Body>
              <Form>
                <p>Here you can see all your sensors</p>

                {/* form select change current field */}
                <Row>
                  <Col>
                    <Form.Select
                      aria-label="Default select example"
                      value={selectedField?.Fid}
                      onChange={(e) => {
                        setSelectedField(
                          userFields.find(
                            (field) => field.Fid === e.target.value
                          )
                        );
                      }}
                    >
                      {userFields &&
                        userFields?.map((field) => (
                          <option key={field.Fid} value={field.Fid}>
                            {field.name}
                          </option>
                        ))}
                    </Form.Select>
                  </Col>
                  <Col>
                    {/* Current field  */}
                    <p>Current field: {selectedField?.name}</p>
                    <p>
                      Current field size:{" "}
                      {calculateSizeToUserUnit(
                        localStorage.getItem("fieldUnit") || "DUNAM",
                        selectedField?.size
                      )}{" "}
                      {localStorage.getItem("fieldUnit") || "DUNAM"}
                    </p>
                    <p>Crop Type: {selectedField?.cropType}</p>
                  </Col>
                  <Col>
                    <Button
                      onClick={() => handleShow()}
                      variant="outline-primary"
                      className="add-sensor-btn"
                    >
                      Add New Sensor
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
          <Card>
            {userFields && selectedField && (
              <Card.Body
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100% !important",
                  height: "100% !important",
                }}
              >
                <Map
                  height={window.innerHeight * 1}
                  width={window.innerWidth * 1}
                />
              </Card.Body>
            )}
          </Card>
        </>
      ) : (
        <Card>
          <Card.Header>
            <h4>No Field Or Sensor</h4>
          </Card.Header>
        </Card>
      )}
    </Container>
  );
}
export default Sensors;
