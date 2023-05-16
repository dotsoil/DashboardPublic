
import React, { useState, useEffect, useContext, useRef } from "react";
import API from "../utils/API";

import { Form, Row, Col, Button, Container, Card } from "react-bootstrap";
import Loader from "../components/Loader";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import HumidityData from "../components/HumidityChart";
import NitrateRawChart from "../components/NitrateRawChart";
import NitrateChart from "../components/NitrateChart";
import { InfoCircleOutlined } from "@ant-design/icons";
import globalContext from "../context/GlobalContext";
import { ToastContainer, toast } from "react-toastify";
import dayjs from "dayjs";
import "../scss/components/Analyze.scss";
// if mobile device use antd mobile else use antd
import { DatePicker, Select } from "antd";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);
Chart.register(...registerables);

import _ from "lodash";

const { Option } = Select;
const { RangePicker } = DatePicker;
import { flatten } from "flat";
import { useParams } from "react-router-dom";

import { ZoomOutMapOutlined } from "@mui/icons-material";
import { setFormOrder } from "@aws-amplify/ui";
import SocialIcons from "../components/SocialIcons";
import { useTranslation } from "react-i18next";

const groupBy = (array, key) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
};

function Analyze({}) {
  const { selectedDate, defaultFieldId, defaultSensorId } = useParams();
  const [fromDate, setFromDate] = useState(dayjs().add(-1, "d").toISOString());
  const [toDate, setToDate] = useState(dayjs().toISOString());
  const [fieldList, setFieldList] = useState([]);
  const [sensorsList, setSensorsList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  // get default value from useContext globalContext
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [humidityData, setHumidityData] = useState(null);
  const [nitrateRawData, setNitrateRawData] = useState(null);
  const [nitrateData, setNitrateData] = useState(null);
  const [vacuumattData, setVacuumattData] = useState(null);
  const [showFieldInfo, setShowFieldInfo] = useState(false);
  const [isAdminScreen, setIsAdminScreen] = useState(false);
  const [isRawData, setIsRawData] = useState(false);
  const [dataLab, setDataLab] = useState(null);
  const { isAdmin, user, theme, usersList, setUsersList } =
    useContext(globalContext);
  const resetZoomButtonRef = useRef();
  const chartRef = useRef();
  const { t } = useTranslation();

  // const [measurements, setMeasurements] = useState();
  const rangePresets = [
    {
      label: "Last 1 Days",
      value: [dayjs().add(-1, "d"), dayjs()],
    },
    {
      label: "Last week",
      value: [dayjs().add(-7, "d"), dayjs()],
    },
    {
      label: "Last month",
      value: [dayjs().add(-30, "d"), dayjs()],
    },
    {
      label: "Last 3 month",
      value: [dayjs().add(-90, "d"), dayjs()],
    },
    {
      label: "Last year",
      value: [dayjs().add(-1, "y"), dayjs()],
    },
  ];
  const [fetchFromDb, setFetchFromDb] = useState({
    nitrate: false,
    humidity: false,
    vacuumatt: false,
  });

  const onDateChange = (dates, dateStrings) => {
    // set fromDate and toDate as String ISO8601 format

    setFromDate(dateStrings[0]);
    setToDate(dateStrings[1]);
  };

  // set default value for selectedUser
  useEffect(() => {
    if (user) {
      setSelectedUser(user.uid);
    }
  }, []);

  //SENSORS LIST
  useEffect(() => {
    const getSensorsList = async () => {
      const sensorsResult = await API.get(
        `users/${selectedUser}/fields/${selectedField}/sensors`
      ).catch((err) => {
        return null;
      });
      if (sensorsResult) setSensorsList(sensorsResult?.data);
    };
    if (selectedField) getSensorsList();
  }, [selectedUser, selectedField]);

  useEffect(() => {
    if (defaultFieldId && defaultSensorId && selectedDate) {
      if (defaultFieldId) {
        fieldList?.filter((field) => {
          if (field.Fid === defaultFieldId) {
            setSelectedField(field?.Fid);
          }
        });
      }
      if (defaultSensorId) {
        sensorsList?.filter((sensor) => {
          if (sensor.Sid === defaultSensorId) {
            setSelectedSensor(sensor?.Sid);
          }
        });
      }
      if (selectedDate) {
        const date = dayjs(selectedDate);
        setFromDate(date.startOf("day").format("YYYY-MM-DD HH:mm:ss"));
        setToDate(date.endOf("day").format("YYYY-MM-DD HH:mm:ss"));
      }
      getDataFromDb();
    }

    return () => {};
  }, [defaultSensorId, defaultFieldId, selectedDate]);

  //FIELDS LIST
  useEffect(() => {
    const getFieldsList = async () => {
      const fieldsResults = await API.get(
        `users/${encodeURIComponent(selectedUser)}/fields`
      ).catch((err) => {
        console.error(err);
        return null;
      });
      if (fieldsResults?.status === 200 && !fieldsResults?.data?.status) {
        const fields = await fieldsResults.data;
        setFieldList(fields);
      } else {
        setFieldList(null);
      }
    };

    if (selectedUser) getFieldsList();
  }, [selectedUser]);

  const getRawMeasurementsData = async () => {
    let DataResponse = await API.get(
      `sensors/${selectedSensor}/Raw/MEASUREMENTS`,
      {
        params: {
          from: fromDate,
          to: toDate,
        },
      }
    ).catch(async (err) => {
      return null;
    });
    return DataResponse;
  };

  const getAdminLabData = async () => {
    let DataResponse = await API.get(
      `getData/${JSON.parse(selectedSensor)?.Sid}`,
      {
        params: {
          from: fromDate,
          to: toDate,
        },
      }
    ).catch(async (err) => {
      return null;
    });
    return DataResponse;
  };

  const getMeasurementsData = async () => {
    let DataResponse = await API.get(`sensors/${selectedSensor}/getData`, {
      params: {
        from: fromDate,
        to: toDate,
        measurements: "MEASUREMENTS",
      },
    }).catch((err) => {
      return null;
    });

    return DataResponse;
  };

  function findKey(obj, key) {
    if (obj.hasOwnProperty(key)) {
      return true;
    }

    for (const k in obj) {
      if (obj[k] && typeof obj[k] === "object") {
        if (Array.isArray(obj[k])) {
          for (const element of obj[k]) {
            if (findKey(element, key)) {
              return true;
            }
          }
        } else if (findKey(obj[k], key)) {
          return true;
        }
      }
    }

    return false;
  }

  const drawNitrateData = async () => {
    const DataResponse = isRawData
      ? await getRawMeasurementsData()
      : await getMeasurementsData();

    // ! patch to handle new sensor data
    if (DataResponse.data.length > 0 && findKey(DataResponse.data, "depth")) {
      const DataLabResponse = DataResponse; //await getAdminLabData();
      let dataArr = {
        labels: [],
        datasets: [
          {
            label: "DEPTH_LOW",
            data: [],
            //background color and border color light blue and blue
            fill: false,
            lineTension: 0.4,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 2,
            pointHitRadius: 10,
          },
          {
            label: "DEPTH_MIDDLE",
            data: [],
            fill: false,
            lineTension: 0.4,
            backgroundColor: "rgba(255, 255, 153, 0.4)",
            borderColor: "rgba(255, 255, 153, 1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(255, 255, 153, 1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(255, 255, 153, 1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 2,
            pointHitRadius: 10,
          },
          {
            label: "DEPTH_HIGH",
            data: [],
            fill: false,
            lineTension: 0.4,
            backgroundColor: "rgba(255, 99, 132, 0.4)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(255, 99, 132, 1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(255, 99, 132, 1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 2,
            pointHitRadius: 10,
          },
        ],
      };
      DataLabResponse.data.forEach((labData) => {
        dataArr.labels.push(labData.timestamp);
        labData.samples.forEach((sample) => {
          if (sample.depth === "DEPTH_LOW") {
            dataArr.datasets[0].data.push(sample.sample);
          }
          if (sample.depth === "DEPTH_MIDDLE") {
            dataArr.datasets[1].data.push(sample.sample);
          }
          if (sample.depth === "DEPTH_HIGH") {
            dataArr.datasets[2].data.push(sample.sample);
          }
        });
        // labData.moisture.forEach((moisture) => {
        //   if (moisture.depth === "CHANNEL_1") {
        //     dataArr.datasets[3].data.push(moisture.sample);
        //   }
        // });
      });
      setDataLab(dataArr);
      setNitrateData(null);
      setNitrateRawData(null);
      setFetchFromDb((prevState) => ({
        ...prevState,
        nitrate: false,
      }));

      return;
    }
    if (DataResponse.status !== 200) {
      toast.info("nitrate data response status is not 200");
      setFetchFromDb((prevState) => ({
        ...prevState,
        nitrate: false,
      }));
      setNitrateRawData(null);
      setNitrateData(null);
      return;
    }
    setFetchFromDb((prevState) => ({
      ...prevState,
      nitrate: false,
    }));
    const sensorsData = DataResponse?.data;
    if (sensorsData?.length > 0) {
      if (isRawData) {
        const nitrateRawData = groupBy(
          sensorsData.map((result) => result.data),
          "cell"
        );
        setNitrateRawData(nitrateRawData);
      } else {
        setNitrateData(sensorsData);
      }
    } else {
      toast.info("nitrate data response is empty");
    }
  };

  const drawMositureData = async () => {
    const HumidityResponse = await API.get(
      `sensors/${selectedSensor}/getData`,
      {
        params: {
          from: fromDate,
          to: toDate,
          measurements: "HUMIDITY",
        },
      }
    ).catch((err) => {
      setFetchFromDb((prevState) => ({
        ...prevState,
        humidity: false,
      }));
      return null;
    });

    setFetchFromDb((prevState) => ({
      ...prevState,
      humidity: false,
    }));
    if (HumidityResponse.status === 200 && HumidityResponse.data.length > 0) {
      if (findKey(HumidityResponse.data[0], "moisture")) {
        return;
      }
      let data = HumidityResponse.data;
      let groupedData = _.groupBy(data.flat(), "timestamp");
      let arr = [];
      Object.values(groupedData).map((group) => {
        let tempArray = [];
        group.map((item) => {
          tempArray[Number(item.cell_name)] = flatten(item);
        });
        arr.push(Object.assign({}, tempArray));
      });
      setHumidityData(arr.flat(2));
    } else {
      setHumidityData(null);
      toast.info("humidity data response is empty");
    }
  };

  const drawVacuumData = async () => {
    const VacuumsResponse = await API.get(
      `sensors/${selectedSensor}/Raw/VACUUMATTS&from=&to=?from=${encodeURIComponent(
        fromDate
      )}&to=${encodeURIComponent(toDate)}`
    ).catch((err) => {
      return null;
    });
    setFetchFromDb((prevState) => ({
      ...prevState,
      vacuum: false,
    }));
    if (VacuumsResponse?.status === 200 && VacuumsResponse?.data?.length > 0) {
      VacuumsResponse.data.map((entry) => {
        entry.data.vacuumatt.DRAIN =
          entry.data.vacuumatt.DRAIN === "OFF" ? 0 : 1;
        entry.data.vacuumatt.PUMP = entry.data.vacuumatt.PUMP === "OFF" ? 0 : 1;
      });
      setVacuumattData(
        VacuumsResponse.data
          .map((row) => flatten(row))
          .sort(function (a, b) {
            return (
              new Date(a.Timestamp.replace(" ", "T")) -
              new Date(b.Timestamp.replace(" ", "T"))
            );
          })
      );
    } else {
    }
  };

  // useEffect(() => {

  //   return () => {};
  // }, [toDate, fromDate]);
  // // Math.random() * (max - min) + min;

  const getDataFromDb = async () => {
    if (selectedSensor && fromDate && toDate) {
      setNitrateData(null);
      setNitrateRawData(null);
      setHumidityData(null);
      setDataLab(null);
      document.body.style.cursor = "wait";
      setFetchFromDb({
        nitrate: true,
        humidity: true,
        vacuum: true,
      });

      drawNitrateData();
      drawMositureData();
      // drawVacuumData();
      document.body.style.cursor = "default";
    } else {
      toast.info(
        `
      ${!selectedSensor ? "Please select sensor" : ""}
      ${!fromDate ? "Please select from date" : ""}
      ${!toDate ? "Please select to date" : ""}
      
      `,
        {
          position: toast.POSITION.TOP_CENTER,
        }
      );
    }
  };

  return (
    <Container className="analyze-container">
      <Form className="form">
        <Row>
          <Row>
            {isAdmin && (
              <Form.Group>
                <Form.Label>{t("Select User")}</Form.Label>
                <Form.Control
                  style={styles.formControl}
                  as="select"
                  onChange={(e) => {
                    setNitrateData(null);
                    setNitrateRawData(null);
                    setHumidityData(null);
                    setSelectedSensor(null);
                    setSelectedField(null);
                    setFieldList(null);
                    setSensorsList(null);
                    setSelectedUser(e.target.value);
                  }}
                  value={selectedUser}
                >
                  <option value="">Select User</option>
                  {usersList &&
                    usersList.map((user) => {
                      return (
                        <option
                          key={user.ID || user?.uid}
                          value={user.ID || user?.uid}
                        >
                          {user?.Fname || user?.fname}
                        </option>
                      );
                    })}
                </Form.Control>
              </Form.Group>
            )}
          </Row>
          <Row>
            <Form.Group>
              <Row style={styles.infoRow}>
                <Form.Label>{t("Select Field")}</Form.Label>
              </Row>
              <Form.Control
                style={styles.formControl}
                as="select"
                onChange={(e) => {
                  setNitrateData(null);
                  setNitrateRawData(null);
                  setHumidityData(null);
                  setSelectedSensor(null);
                  setSensorsList(null);
                  setSelectedField(e.target.value);
                }}
                value={selectedField?.name}
              >
                <option value="">Select Field</option>
                {fieldList &&
                  fieldList?.map((field) => (
                    <option key={field.Fid} value={field.Fid}>
                      {field.name}
                    </option>
                  ))}
              </Form.Control>{" "}
              <InfoCircleOutlined
                style={styles.infoIcon}
                onClick={() => {
                  try {
                    const field = fieldList?.find(
                      (field) => field.Fid === selectedField
                    );
                    // Show the selectedField info
                    alert(`
                  Field
                  _______________________
                  Field Name: ${field?.name}
                  Harvesting Date: ${field?.harvestDate}
                  Irrigation Type: ${field?.irrigationType}
                  Field Area: ${field?.size}
                  Type Cultivated: ${field?.typeCultivation}
                  Location: ${field?.location}
                  Seed Date: ${field?.seedDate}
                  Field Type: ${field?.fieldType}
                  Field ID: ${field?.Fid.substring(0, 6)}

                  `);
                  } catch (error) {}
                }}
              />
            </Form.Group>
          </Row>
        </Row>
        <Row style={styles.lastRow}>
          <Col>
            <Form.Group>
              <Form.Label>{t("Select Sensor")}</Form.Label>
              <Form.Control
                style={styles.formControl}
                as="select"
                onChange={(e) => setSelectedSensor(e.target.value)}
                value={selectedSensor}
              >
                <option value="">Select Sensor</option>
                {sensorsList &&
                  sensorsList.map((sensor) => (
                    <option key={sensor.Sid} value={sensor.Sid}>
                      {sensor.Sid}
                    </option>
                  ))}
              </Form.Control>
              {isAdminScreen ? (
                <Form.Check
                  type="checkbox"
                  label={t(`Show Raw Data`)}
                  id="disabled-custom-switch"
                  onChange={(e) => {
                    setIsRawData(e.target.checked);
                  }}
                  value={isRawData}
                />
              ) : null}
              <InfoCircleOutlined
                style={styles.infoIcon}
                onClick={() => {
                  try {
                    const sensor = sensorsList?.find(
                      (sensor) => sensor.Sid === selectedSensor
                    );

                    if (!sensor) {
                      return;
                    }
                    alert(`
                  Sensor
                  ______________________________________
                  Sensor Id: ${sensor?.Sid.substring(0, 6)}
                  Latitude: ${
                    sensor?.location?.latitude || sensor?.Location?.latitude
                  }
                  Longitude: ${
                    sensor?.location?.longitude || sensor?.Location?.longitude
                  }
                  Created At: ${sensor?.CreatedDate}
                  `);
                  } catch (error) {}
                }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>{t("Select Date Range")}</Form.Label>
            </Form.Group>
            <RangePicker
              format="YYYY-MM-DD HH:mm"
              onChange={onDateChange}
              popupClassName="date-picker-dropdown"
              showTime
              disabledDate={(current) => {
                return current && current > dayjs().endOf("day");
              }}
              hideDisabledOptions={true}
              showNow={true}
              presets={rangePresets}
              value={[
                dayjs(fromDate).isValid() ? dayjs(fromDate) : null,
                dayjs(toDate).isValid() ? dayjs(toDate) : null,
              ]}
            />
          </Col>
          <Row style={styles.buttonRow}>
            <Button
              variant={theme === "dark" ? "outline-light" : "secondary"}
              style={
                theme === "dark"
                  ? { ...styles.button, ...styles.buttonDark }
                  : styles.button
              }
              onClick={getDataFromDb}
              disabled={
                fetchFromDb.humidity ||
                fetchFromDb.nitrate ||
                fetchFromDb.vacuumatt
              }
            >
              {t("Submit")}
            </Button>
          </Row>
        </Row>
      </Form>
      {fetchFromDb.humidity || fetchFromDb.nitrate || fetchFromDb.vacuumatt ? (
        <Loader size={40} />
      ) : null}
      <div className="data">
        {nitrateRawData ? (
          <NitrateRawChart
            className="data-nitrate"
            rawData={nitrateRawData}
            downloadData={isRawData}
          />
        ) : nitrateData && nitrateData.length > 0 ? (
          <NitrateChart
            className="data-nitrate"
            nitrateData={nitrateData}
            downloadData={isRawData}
          />
        ) : null}
        {dataLab && dataLab?.labels?.length > 0 && (
          <Card className="data-nitrate">
            <Button
              label="reset zoom"
              ref={resetZoomButtonRef}
              variant="outlined"
              style={{
                display: "none",
              }}
              onClick={() => {
                chartRef.current.resetZoom();
              }}
            >
              {/* <ZoomOutMapOutlined /> */}
              Reset Zoom
            </Button>
            <Line
              ref={chartRef}
              data={dataLab}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                resizeDelay: 100,
                plugins: {
                  zoom: {
                    animation: {
                      duration: 1000,
                      easing: "backOut",
                    },
                    zoom: {
                      drag: {
                        enabled: true,
                      },
                      pinch: {
                        enabled: true,
                      },
                      mode: "xy",
                      onZoomComplete: (e) => {
                        chartRef.current.getZoomLevel() === 1
                          ? (resetZoomButtonRef.current.style.display = "none")
                          : (resetZoomButtonRef.current.style.display =
                              "block");
                      },
                    },
                  },
                  legend: {
                    labels: {
                      font: {
                        size: 12,
                      },
                      color: "#88CCFF",
                    },
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      color: "#88CCFF",
                      font: {
                        size: 12,
                      },
                    },
                  },
                  x: {
                    ticks: {
                      color: "#88CCFF",
                      font: {
                        size: 12,
                      },
                    },
                  },
                },
              }}
              redraw={true}
            />
          </Card>
        )}
        {humidityData && humidityData.length > 0 ? (
          <HumidityData humidityData={humidityData} downloadData={isRawData} />
        ) : null}
      </div>
    </Container>
  );
}

const styles = {
  lastRow: {
    // display: "flex",
  },
  infoRow: {
    // display: "flex",
    // justifyContent: "space-between",
    // alignItems: "flex-start",
  },
  infoIcon: {
    color: "#1890ff",
  },
  formControl: {
    // width: screen.size > 800 ? "100%" : "80%",
  },
  buttonRow: {
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
  },
  button: {
    marginTop: "1%",
    borderColor: "#88CCFF",
  },
  buttonDark: {
    borderColor: "#88CCFF",
  },

};

export default Analyze;
