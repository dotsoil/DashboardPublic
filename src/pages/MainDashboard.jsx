import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import SelectDatesCard from "../components/SelectDatesCard";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-zoom";
import Hammer from "hammerjs";
import globalContext from "../context/GlobalContext";
import {
  ArrowCircleLeftOutlined,
  ArrowCircleRightOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";

import API from "../utils/API";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import WeatherCard from "../components/WeatherCard";
import FieldCard from "../components/FieldCard";
import "../scss/components/tuner.scss";

import { useTranslation } from "react-i18next";
import "../scss/components/MainDashboard.scss";
import { red } from "@mui/material/colors";
import Column from "antd/es/table/Column";
import NitrateStat from "../components/NitrateStat";
const weatherIcons = {
  "01d":
    "https://cdn0.iconfinder.com/data/icons/bzzricon-weather-outline/512/17_Clear_Sky-512.png",
};

const dataSet = {
  labels: [],
  datasets: [
    {
      label: "DEPTH_LOW",
      data: [],
      // dataset design for line chart with no fill
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

function MainDashboard() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [nitrate, setNitrate] = useState(null);
  const [newSensorFlags, setNewSensorFlags] = useState(false);
  const [nitrateDataSet, setNitrateDataSet] = useState(null);
  const [latestNitrate, setLatestNitrate] = useState(null);
  const [requiredNitrate, setRequiredNitrate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, selectedSensor, selectedField } = useContext(globalContext);

  //testing number range for nitrate
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLatestNitrate(prevState =>
  //       prevState.map((item) => {
  //         return {
  //           ...item,
  //           sample: item.sample + 1
  //         }
  //       }
  //     ))
  //   }, 100)

  // }, [latestNitrate])

  useEffect(() => {
    const getTemperature = async () => {
      const response = await API.get(`openApi/Weather`, {
        params: {
          latitude: selectedField?.location?.latitude || 0,
          longitude: selectedField?.location?.longitude || 0,
        },
      });

      setTemperature(response.data);
    };

    const getRequiredNitrate = async () => {
      setRequiredNitrate(selectedField?.requiredNitrate);
    };

    if (selectedField) {
      getTemperature();
      getRequiredNitrate();
    }

    return () => {};
  }, [selectedField]);

  const getLatestNitrate = async () => {
    const response = await API.get(`sensors/${selectedSensor?.Sid}/latest`);
    // if response is not empty set latest nitrate
    setLatestNitrate(response?.data?.samples);
  };

  const getNitrateData = async () => {
    setNitrateDataSet(dataSet);
    const date = dayjs(selectedDate);
    let from = date.startOf("day").format("YYYY-MM-DD HH:mm:ss");
    let to = date.endOf("day").format("YYYY-MM-DD HH:mm:ss");
    API.get(`sensors/${selectedSensor?.Sid}/getData`, {
      params: {
        from,
        to,
      },
    }).then((response) => {
      if (response.data.length > 0) {
        findKey(response.data[0], "depth")
          ? setNewSensorFlags(true)
          : setNewSensorFlags(false);
        setNitrate(response.data);
      }
      setIsLoading(false);
    }).catch((error) => {
      setIsLoading(false);
    });
  };
  

  useEffect(() => {
    if (selectedSensor) {
      setIsLoading(true);
      getLatestNitrate();
      getNitrateData();
    }
    return () => {};
  }, [selectedSensor]);

  useEffect(() => {
    if (selectedDate && selectedSensor) {
      setIsLoading(true);
      getNitrateData();
    }
    return () => {};
  }, [selectedDate]);

  function splitArray(array, size) {
    if (!array) {
      return [];
    }
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

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

  useEffect(() => {
    // deep copy dataSet
    let dataArr = JSON.parse(JSON.stringify(dataSet));
    let dataArray = nitrate;
    if (newSensorFlags) {
      if (dataArray.length > 1000) {
        dataArray = nitrate.filter((item, index) => {
          return index % 10 === 0;
        });
      }

      dataArray?.forEach((labData) => {
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
      setNitrateDataSet(dataArr);
    } else {
      let dataArray = splitArray(nitrate, 6);

      dataArray?.forEach((sample) => {
        dataArr.labels.push(sample[0].timestamp);
        sample.forEach((labData) => {
          if (labData.cell_position === 20 && labData.cell_name === "pos_a") {
            dataArr.datasets[0].data.push(labData.nitrate);
          }
          if (labData.cell_position === 40 && labData.cell_name === "pos_b") {
            dataArr.datasets[1].data.push(labData.nitrate);
          }
          if (labData.cell_position === 60 && labData.cell_name === "pos_c") {
            dataArr.datasets[2].data.push(labData.nitrate);
          }
        });

        // labData.moisture.forEach((moisture) => {
        //   if (moisture.depth === "CHANNEL_1") {
        //     dataArr.datasets[3].data.push(moisture.sample);
        //   }
      });
      // dataArr.labels clear duplicates

      setNitrateDataSet(dataArr);
    }

    return () => {};
  }, [nitrate]);

  return (
    <div>
      <h3>
        {t("Welcome Back")}, {user?.Fname}! <br />
      </h3>
      <h5>{t(dayjs().format("dddd, MMMM D, YYYY"))} </h5>
      <Container className="rowContainer">
        {latestNitrate && (
          <Container className="nitrate-state">
            {latestNitrate?.map((sample, index) => {
              return (
                <Card key={index} className="nitrate-stat-card">
                  <Card.Body>
                    <NitrateStat
                      key={sample.depth}
                      depth={t(sample.depth)}
                      nitrateLevel={sample.sample}
                      requiredNitrateLevel={requiredNitrate || t("Unknown")}
                      barNum={10}
                      success={"#00FF00"}
                      warning={"#FFA500"}
                      error={"#FF0000"}
                    />
                  </Card.Body>
                </Card>
              );
            })}
          </Container>
        )}
        {nitrateDataSet && selectedSensor && (
          <Card>
            <Card.Header>
              <SelectDatesCard
                onDateSelect={(selectedDate, selectedMonth, selectedYear) => {
                  let day = selectedDate;
                  let month = selectedMonth;
                  let year = selectedYear;
                  setSelectedDate(
                    new Date(
                      year,
                      month,
                      day,
                      new Date().getHours(),
                      new Date().getMinutes(),
                      new Date().getSeconds()
                    )
                  );
                }}
              />
            </Card.Header>
            <Card.Body>
              <Card.Text></Card.Text>
              <b>{t("More information")}:</b> <br />
              <Link
                to={{
                  pathname: `analyze/${selectedDate?.toISOString()}/${
                    selectedField?.Fid
                  }/${selectedSensor?.Sid}`,
                }}
              >
                <ArrowCircleRightOutlined />
              </Link>
              {isLoading ? (
                <>
                  <Loader size={80} />
                </>
              ) : (
                nitrateDataSet && (
                  // add y=250 to 300 area line chart
                  <Line
                    width={
                      screen.width < 1024 ? screen.width : screen.width / 2
                    }
                    height={
                      screen.width < 1024 ? screen.height : screen.height / 2
                    }
                    updateMode="zoom"
                    data={nitrateDataSet}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      resizeDelay: 100,
                      interaction: {
                        mode: "index",
                        intersect: false,
                      },

                      plugins: {
                        legend: {
                          display: true,
                          position: "bottom",
                          labels: {
                            color: "#88CCFF",
                            font: {
                              size: 16,
                            },
                            useBorderRadius: true,
                            borderRadius: 5,
                          },
                        },
                        title: {
                          display: true,
                          text: t("Nitrate PPM"),
                          color: "#88CCFF",
                          font: {
                            size: 16,
                          },
                        },
                      },
                      scales: {
                        y: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            // enable zoom on y-axis
                            beginAtZero: true,
                            color: "#88CCFF",
                            autoSkip: true,
                            font: {
                              size: 12,
                            },
                          },
                        },
                        x: {
                          position: "bottom",
                          grid: {
                            display: false,
                          },
                          ticks: {
                            color: "#88CCFF",
                            // angle of the labels on the x-axis
                            maxRotation: 0,
                            // show only the half of the labels
                            autoSkip: true,
                            font: {
                              size: 12,
                            },
                          },
                        },
                      },
                      animation: {
                        duration: 1500,
                        easing: "easeInOutQuad",
                      },
                    }}
                  />
                )
              )}
            </Card.Body>
          </Card>
        )}
        {temperature && <WeatherCard Temperature={temperature} />}

        {selectedField && (
          <Row xs={10} md={10}>
            <FieldCard Field={selectedField} Sensor={selectedSensor} />
          </Row>
        )}
      </Container>
    </div>
  );
}

const styles = {};

export default MainDashboard;
