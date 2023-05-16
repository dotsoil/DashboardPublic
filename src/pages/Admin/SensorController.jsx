import React, { useState, useEffect, useContext } from "react";
import { Modal, Card, Col, Row, Image } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TimerButton from "../../components/MessagesIntervalModal";
import OnOffIcon from "../../components/OnOffIcon";
import PieChart from "../../components/PieChart";
import PowerButton from "../../components/PowerButton";
import RefreshButton from "../../components/RefreshButton";
import ChannelModal from "./ChannelModal";
import globalContext from "../../context/GlobalContext";
import { PubSub } from "aws-amplify";
import BatteryProgress from "../../components/BatteryProgress";

function SensorController({ show, onHide, Sensor }) {
  const [showTimerModal, setShowTimerModal] = useState(false);
  const { Credentials, isAdmin } = useContext(globalContext);
  const [sensorStatus, setSensorStatus] = useState(null);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const [showChannelModalStatus, setShowChannelModalStatus] = useState(null);
  const [showChannelModal, setShowChannelModal] = useState({
    show: false,
    channel: 0,
    status: null,
  });

  const updateWaitForResponse = () => {
    setWaitForResponse(true);
    setTimeout(() => {
      setWaitForResponse(false);
      toast.error("No response from sensor");
    }, 60000);
  };

  const updateSensorStatus = (data) => {
    data.value.Online =
      new Date(sensorStatus?.TIMESTAMP).getTime() - new Date().getTime() >
      300000
        ? false
        : true;
    data.value.lastUpdate = data.value.TIMESTAMP.replace("T", " ");
    data.value.lastBootTime = `${data.value.LAST_BOOT_TIME} GMT`;

    data.value.GPS = {
      longitude: data.value?.CELLULAR?.GPS?.LON || null,
      latitude: data.value?.CELLULAR?.GPS?.LAT || null,
    };
    data.value.cellular = {
      signal: data.value?.CELLULAR?.QOS?.RSSI || null,
      strength: data.value?.CELLULAR?.QOS?.BER || null,
    };
    data.value.Channel1 = data.value?.VACCUMATT?.CHANNEL_0 || null;
    data.value.Channel2 = data.value?.VACCUMATT?.CHANNEL_1 || null;
    data.value.Channel3 = data.value?.VACCUMATT?.CHANNEL_2 || null;
    if (data.value?.OPTICAL_HEAD?.CHANNEL_0) {
      data.value.Channel1.OpticalHead = data.value?.OPTICAL_HEAD?.CHANNEL_0;
    }

    if (data.value?.OPTICAL_HEAD?.CHANNEL_1) {
      data.value.Channel2.OpticalHead = data.value?.OPTICAL_HEAD?.CHANNEL_1;
    }
    if (data.value?.OPTICAL_HEAD?.CHANNEL_2) {
      data.value.Channel3.OpticalHead = data.value?.OPTICAL_HEAD?.CHANNEL_2;
    }

    if (data.value.Channel1) {
      data.value.Channel1.vacuum = {
        Pump: {
          state: data.value.Channel1.PUMP.DEVICE_STATE == "OFF" ? false : true,
          LastPump: data.value.Channel1.LAST_PUMP_TIME.split("T")[1],
        },
        Drain: {
          state: data.value.Channel1.DRAIN.DEVICE_STATE == "OFF" ? false : true,
          LastDrain: data.value.Channel1.LAST_DRAIN_TIME.split("T")[1],
        },
        PT: {
          // last pressure 3 decimal places
          LastPressure: parseFloat(data.value.Channel1.PT.LAST_PRESSURE),
          LastTemperature: parseFloat(data.value.Channel1.PT.LAST_TEMPERATURE),
          deviceID: data.value.Channel1.PT.DEVICE_ID,
        },
        Breather: {
          state:
            data.value.Channel1.BREATHER.DEVICE_STATE == "OFF" ? false : true,
        },
      };
      data.value.Channel1.OpticalHead = {
        state:
          data.value.Channel1.OpticalHead.DEVICE_STATE == "OFF" ? false : true,
        deviceID: data.value.Channel1.OpticalHead.DEVICE_ID || null,
        ledLowPower: data.value.Channel1.OpticalHead.LED_LOW_POWER || null,
        ledHighPower: data.value.Channel1.OpticalHead.LED_HIGH_POWER || null,
      };
    }
    if (data.value.Channel2) {
      data.value.Channel2.vacuum = {
        Pump: {
          state: data.value.Channel2.PUMP.DEVICE_STATE == "OFF" ? false : true,
          LastPump: data.value.Channel2.LAST_PUMP_TIME.split("T")[1],
        },
        Drain: {
          state: data.value.Channel2.DRAIN.DEVICE_STATE == "OFF" ? false : true,
          LastDrain: data.value.Channel2.LAST_DRAIN_TIME.split("T")[1],
        },
        PT: {
          // last pressure 3 decimal places
          LastPressure: parseFloat(data.value.Channel2.PT.LAST_PRESSURE),
          LastTemperature: parseFloat(data.value.Channel2.PT.LAST_TEMPERATURE),
          deviceID: data.value.Channel2.PT.DEVICE_ID,
        },
        Breather: {
          state:
            data.value.Channel2.BREATHER.DEVICE_STATE == "OFF" ? false : true,
        },
      };
      data.value.Channel2.OpticalHead = {
        state:
          data.value.Channel2.OpticalHead.DEVICE_STATE == "OFF" ? false : true,
        deviceID: data.value.Channel2.OpticalHead.DEVICE_ID || null,
        ledLowPower: data.value.Channel2.OpticalHead.LED_LOW_POWER || null,
        ledHighPower: data.value.Channel2.OpticalHead.LED_HIGH_POWER || null,
      };
    }
    if (data.value.Channel3) {
      data.value.Channel3.vacuum = {
        Pump: {
          state: data.value.Channel3.PUMP.DEVICE_STATE == "OFF" ? false : true,
          LastPump: data.value.Channel3.LAST_PUMP_TIME.split("T")[1],
        },
        Drain: {
          state: data.value.Channel3.DRAIN.DEVICE_STATE == "OFF" ? false : true,
          LastDrain: data.value.Channel3.LAST_DRAIN_TIME.split("T")[1],
        },
        PT: {
          // last pressure 3 decimal places
          LastPressure: parseFloat(data.value.Channel3.PT.LAST_PRESSURE),
          LastTemperature: parseFloat(data.value.Channel3.PT.LAST_TEMPERATURE),
          deviceID: data.value.Channel3.PT.DEVICE_ID,
        },
        Breather: {
          state:
            data.value.Channel3.BREATHER.DEVICE_STATE == "OFF" ? false : true,
        },
      };
      data.value.Channel3.OpticalHead = {
        state:
          data.value.Channel3.OpticalHead.DEVICE_STATE == "OFF" ? false : true,
        deviceID: data.value.Channel3.OpticalHead.DEVICE_ID || null,
        ledLowPower: data.value.Channel3.OpticalHead.LED_LOW_POWER || null,
        ledHighPower: data.value.Channel3.OpticalHead.LED_HIGH_POWER || null,
      };
    }
    setSensorStatus(data.value);
  };

  useEffect(() => {
    PubSub.subscribe([`device/${Sensor.Sid}/STATUS`]).subscribe({
      next: (data) => {
        updateSensorStatus(data);
        setWaitForResponse(false);
      },
      error: (error) => console.error(error),
    });

    PubSub.subscribe([
      `device/${Sensor.Sid}/MAINTENANCE/STATUS/accept`,
    ]).subscribe({
      next: (data) => {
        toast.success("Status Response", data.value);
        updateSensorStatus(data);
        setWaitForResponse(false);
      },
      error: (error) => console.error(error),
    });

    PubSub.subscribe([
      `device/${Sensor.Sid}/MAINTENANCE/STATUS/rejected`,
    ]).subscribe({
      next: (data) => {
        toast.error("Status Response", data.value);
        setWaitForResponse(false);
      },
      error: (error) => console.error(error),
    });

    PubSub.subscribe([
      `device/${Sensor.Sid}/MAINTENANCE/REBOOT/accept`,
      `device/${Sensor.Sid}/MAINTENANCE/REBOOT/rejected`,
    ]).subscribe({
      next: (data) => {
        toast.info("Reboot Response", JSON.stringify(data.value));
        setWaitForResponse(false);
      },
      error: (error) => console.error(error),
    });

    PubSub.subscribe([
      `device/${Sensor.Sid}/MAINTENANCE/UPDATE-STATUS-INTERVAL/accept`,
      `device/${Sensor.Sid}/MAINTENANCE/UPDATE-MEASUREMENT-INTERVAL/accept`,
    ]).subscribe({
      next: (data) => {
        toast.success("Update interval message success", data);
      },
      error: (error) => console.error(error),
    });
    PubSub.subscribe([
      `device/${Sensor.Sid}/MAINTENANCE/UPDATE-STATUS-INTERVAL/rejected`,
      `device/${Sensor.Sid}/MAINTENANCE/UPDATE-MEASUREMENT-INTERVAL/rejected`,
    ]).subscribe({
      next: (data) => {
        toast.error("Update interval message Failed", data);
        setWaitForResponse(false);
      },
      error: (error) => console.error(error),
      complete: () => console.log("Done"),
    });

    PubSub.subscribe([
      `device/${Sensor.Sid}/MAINTENANCE/MEASUREMENT/accept`,
    ]).subscribe({
      next: (data) => {
        toast.success("Measurement Response", data);
        setWaitForResponse(false);
      },
    });

    PubSub.subscribe([
      `device/${Sensor.Sid}/MAINTENANCE/MEASUREMENT/rejected`,
    ]).subscribe({
      next: (data) => {
        toast.error("Measurement Response", data);
        setWaitForResponse(false);
      },
    });

    PubSub.subscribe([
      `device/${Sensor.Sid}/MAINTENANCE/VACUUMATT/rejected`,
    ]).subscribe({
      next: (data) => {
        toast.error("Vacuum ATT Response", data);
        setWaitForResponse(false);
      },
    });

    PubSub.subscribe([
      `device/${Sensor.Sid}/MAINTENANCE/VACUUMATT/accept`,
    ]).subscribe({
      next: (data) => {
        toast.success("Vacuum ATT Response", data);
        setWaitForResponse(false);
      },
    });
  }, [Sensor?.Sid]);

  const RefreshStatus = () => {
    //send refresh status command to aws mqtt server topic "device/${Sensor.Sid}/command"
    //TODO: Replace test with ${Sensor.Sid}
    console.log(`device/${Sensor.Sid}/MAINTENANCE/STATUS`);
    PubSub.publish(`device/${Sensor.Sid}/MAINTENANCE/STATUS`, null);
    updateWaitForResponse();
  };

  const RebootSensor = () => {
    if (
      window.confirm("Are you sure you want to reboot this sensor?") == true
    ) {
      //send reboot command to aws mqtt server topic "device/${Sensor.Sid}/command"
      //TODO: Replace test with ${Sensor.Sid}
      PubSub.publish(`device/${Sensor.Sid}/MAINTENANCE/REBOOT`, null);
      updateWaitForResponse();
    }
  };

  const updateMessageInterval = (status, measurement) => {
    if (status) {
      //TODO: Replace test with ${Sensor.Sid}
      PubSub.publish(
        `device/${Sensor.Sid}/MAINTENANCE/UPDATE-STATUS-INTERVAL`,
        {
          Interval: status,
        }
      );
      updateWaitForResponse();
    }
    if (measurement) {
      //TODO: Replace test with ${Sensor.Sid}
      PubSub.publish(
        `device/${Sensor.Sid}/MAINTENANCE/UPDATE-MEASUREMENT-INTERVAL`,
        {
          Interval: measurement,
        }
      );
      updateWaitForResponse();
    }
  };

  const sendMeasurementRequest = (channel) => {
    PubSub.publish(`device/${Sensor.Sid}/MAINTENANCE/MEASUREMENT`, {
      VacuumIndex: channel,
    });
    updateWaitForResponse();
  };

  const sendMaintenanceVacuumRequest = (channel, type, value) => {
    PubSub.publish(`device/${Sensor.Sid}/MAINTENANCE/VACUUMATT`, {
      VacuumIndex: channel,
      [type]: parseInt(value),
    });
    updateWaitForResponse();
  };

  useEffect(() => {
    RefreshStatus();

    return () => {};
  }, [Sensor]);

  // show is a boolean value, onHide is a function, Sensor is an object
  //Show as a Modal above the page with exit button
  //Get Sensor Status from aws mqtt server topic "device/${Sensor.Sid}/status"

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      onBackdropClick={onHide}
      style={
        showChannelModal.show || showTimerModal
          ? { opacity: 0.6 }
          : { opacity: 1 }
      }
    >
      <Modal.Header closeButton>
        <Col>
          <Modal.Title>Sensor</Modal.Title>
        </Col>
        <Col>
          {isAdmin && (
            <RefreshButton onClick={RefreshStatus} disabled={waitForResponse} />
          )}
        </Col>
        <Col>
          {isAdmin && (
            <PowerButton onClick={RebootSensor} disabled={waitForResponse} />
          )}
        </Col>
        <Col>
          {isAdmin && (
            <TimerButton
              disabled={waitForResponse}
              showTimerModal={showTimerModal}
              setShowTimerModal={setShowTimerModal}
              updateMessageInterval={(status, measurement) =>
                updateMessageInterval(status, measurement)
              }
            />
          )}
        </Col>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Body>
            <Row>
              <Card.Title>Sensor ID: {Sensor?.Sid}</Card.Title>
              <Row>
                {/* converte sensorStatus?.TIMESTAMP string to time check the time pass since now if greater then 5 min offline  */}
                <OnOffIcon isOn={sensorStatus?.Online || false} />
                {sensorStatus?.Online ? "Online" : "Offline"}
              </Row>
              <Col>
                {sensorStatus ? (
                  <p>Last Update: {sensorStatus?.lastUpdate || " "}</p>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col>
                <p>Last boot time: {sensorStatus?.LastBootTime || " "}</p>
              </Col>
              <Card.Title>Power</Card.Title>
              <BatteryProgress battery={sensorStatus?.Battery || 80} />
              <Col>
                <p>
                  Temperature:
                  <PieChart
                    isTemperature={true}
                    percentage={sensorStatus?.Temperature || 0}
                    color={
                      (sensorStatus?.Temperature || 0) < 50
                        ? "#53841e"
                        : "lightcoral"
                    }
                  />
                </p>
              </Col>
            </Row>
            {isAdmin && (
              <>
                <Card.Title>Depth-Channels</Card.Title>
                <Row>
                  <Col></Col>
                  {sensorStatus?.Channel1 ? (
                    <Col>
                      <Card.Text
                        style={styles.button}
                        onClick={() => {
                          setShowChannelModal({
                            show: true,
                            channel: 1,
                          });
                          setShowChannelModalStatus(sensorStatus?.Channel1);
                        }}
                      >
                        Channel 1
                      </Card.Text>
                    </Col>
                  ) : null}
                  {sensorStatus?.Channel2 ? (
                    <Col>
                      <Card.Text
                        style={styles.button}
                        onClick={() => {
                          setShowChannelModal({
                            show: true,
                            channel: 2,
                          });
                          setShowChannelModalStatus(sensorStatus?.Channel2);
                        }}
                      >
                        Channel 2
                      </Card.Text>
                    </Col>
                  ) : null}
                  {sensorStatus?.Channel3 ? (
                    <Col>
                      <Card.Text
                        style={styles.button}
                        onClick={() => {
                          setShowChannelModal({ show: true, channel: 3 });
                          setShowChannelModalStatus(sensorStatus?.Channel2);
                        }}
                      >
                        Channel 3
                      </Card.Text>
                    </Col>
                  ) : null}
                </Row>
              </>
            )}
            <Row style={{ display: "flex", justifyContent: "space-between" }}>
              <Row>
                <Card.Title>GPS:</Card.Title>
                <Col>
                  <p>Longitude: {sensorStatus?.GPS?.longitude || "0"}</p>
                </Col>
                <Col>
                  <p>Latitude: {sensorStatus?.GPS?.latitude || "0"}</p>
                </Col>
              </Row>
              <Row>
                <Card.Title>Cellular:</Card.Title>
                <Col>
                  <p>
                    Signal strength:{" "}
                    {sensorStatus?.cellular?.signal || "0.000000"}
                  </p>
                </Col>
                <Col>
                  <p>
                    Signal quality:{" "}
                    {sensorStatus?.cellular?.strength || "0.000000"}
                  </p>
                </Col>
              </Row>
            </Row>
          </Card.Body>
        </Card>
      </Modal.Body>
      {showChannelModal && isAdmin ? (
        <ChannelModal
          disabled={waitForResponse}
          status={showChannelModalStatus}
          show={showChannelModal}
          onHide={() =>
            setShowChannelModal({
              show: false,
              channel: 0,
            })
          }
          channelParam={sensorStatus?.Channel}
          sendMeasurementRequest={(channel) => {
            sendMeasurementRequest(channel);
          }}
          sendMaintenanceVacuumRequest={(channel, type, value) => {
            sendMaintenanceVacuumRequest(channel, type, value);
          }}
        />
      ) : null}
    </Modal>
  );
}

const styles = {
  // cardBody: {
  //   // display: "flex",
  //   // flexDirection: "column",
  //   // justifyContent: "space-between",
  //   // alignItems: "flex-start",
  // },
  // channelRow: {
  //   // display: "flex",
  //   // flexDirection: "row",
  //   // justifyContent: "space-between",
  //   // alignItems: "flex-start",
  // },
  // powerRow: {
  //   display: "flex",
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "flex-start",
  // },

  //animation effect for led icon ease-in-out in out changing color from light green to green
  ledOnIcon: {
    color: "#00ff00",
    animation: "ledOnIcon 1s ease-in-out infinite alternate",
  },
  //hover and click animations effect for button
  button: {
    textAlign: "center",
    padding: "10px",
    margin: "10px",
    borderRadius: "5px",
    backgroundColor: "#e6e6e6",
    cursor: "pointer",
  },

  //animation effect for led icon ease-in-out in out changing color from light red to red
  ledOffIcon: {
    color: "#ff0000",
    animation: "ledOffIcon 1s ease-in-out infinite alternate",
  },
  "@keyframes ledOnIcon": {
    from: {
      color: "#00ff00",
    },
    to: {
      color: "#00cc00",
    },
  },
  "@keyframes ledOffIcon": {
    from: {
      color: "#ff0000",
    },
    to: {
      color: "#cc0000",
    },
  },
};

export default SensorController;
