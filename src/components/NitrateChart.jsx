import React, { useState, useEffect, useRef } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Select, Button } from "antd";
import _ from "lodash";
import * as XLSX from "xlsx/xlsx.mjs";
import { Chart } from "chart.js";

import { Line } from "react-chartjs-2";
import { Card, Row } from "react-bootstrap";
import { Form } from "react-bootstrap";
import NewLineJs from "./NewLineJs";
import Col from "react-bootstrap/Col";
import { useTranslation } from "react-i18next";
import { ZoomOutMapOutlined } from "@mui/icons-material";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

const zoomOptions = {
  limits: {
    x: { min: -200, max: 200, minRange: 50 },
    y: { min: -200, max: 200, minRange: 50 },
  },
  pan: {
    enabled: true,
    onPanStart({ chart, point }) {
      const area = chart.chartArea;
      const w25 = area.width * 0.25;
      const h25 = area.height * 0.25;
      if (
        point.x < area.left + w25 ||
        point.x > area.right - w25 ||
        point.y < area.top + h25 ||
        point.y > area.bottom - h25
      ) {
        return false; // abort
      }
    },
    mode: "xy",
  },
  zoom: {
    wheel: {
      enabled: true,
    },
    pinch: {
      enabled: true,
    },
  },
};

function NitrateChart({ nitrateData, downloadData, className }) {
  const chartRef = useRef();
  const [selectedChartData, setSelectedChartData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [cellsPosition, setCellsPosition] = useState([]);
  const [cellsName, setCellsName] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const resetZoomButtonRef = useRef();
  const { t } = useTranslation();

  const ColorsPalette = {
    pos_a: {
      label: `${t("Pos A - 20cm")}`,
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
    pos_b: {
      label: `${t("Pos B - 40cm")}`,
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
    pos_c: {
      label: `${t("Pos C - 60cm")}`,
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
    pos_d: {
      label: `${t("Pos D - 20cm")}`,
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
    pos_e: {
      label: `${t("Pos E - 40cm")}`,
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
    pos_f: {
      label: `${t("Pos F - 60cm")}`,
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
  };

  const appendLine = (position) => {
    setSelectedChartData((prevState) => ({
      ...prevState,
      // remove duplicate labels and datasets
      datasets: [
        ...new Set([...prevState.datasets, ...chartData[position].datasets]),
      ],
    }));
  };

  useEffect(() => {
    if (!nitrateData) return;
    const cell_name = nitrateData?.map((item) => item.cell_name);
    const cell_position = nitrateData.map((item) => item.cell_position);
    setCellsName([...new Set(cell_name)]);
    setCellsPosition([...new Set(cell_position)]);
    let data = _.groupBy(nitrateData, "cell_name");
    let result = {};
    for (let key in data) {
      result[key] = {
        labels: data[key].map((sample) => sample.timestamp),
        datasets: [
          {
            id: data[key][0].cell_name,
            // label: `${data[key][0].cell_position} ${data[key][0].cell_name}`,
            data: data[key].map((sample) => sample.nitrate),
            ...(ColorsPalette[key]
              ? ColorsPalette[key]
              : ColorsPalette["pos_a"]),
          },
        ],
      };
    }
    setChartData((prevState) => ({ ...result }));
    setSelectedChartData(result["pos_a"]);

    return () => {};
  }, [nitrateData]);

  useEffect(() => {
    if (!selectedCell) return;
    setSelectedChartData(chartData[selectedCell], [selectedCell]);

    return () => {};
  }, [selectedCell]);

  useEffect(() => {
    setChartOptions({
      // responsive: true,
      // maintainAspectRatio: false,
      // scales: {
      //   x: {
      //     type: "time",
      //     time: {
      //       unit: "day",
      //       displayFormats: {
      //         day: "MMM DD",
      //       },
      //     },
      //   },
      //   y: {
      //     title: {
      //       display: true,
      //       text: "Nitrate (PPM)",
      //     },
      //   },
      // },
      scales: {
        yAxes: [
          {
            grid: {
              drawBorder: true,
              color: "white",
            },
            ticks: {
              beginAtZero: true,
              fontColor: "white",
              fontSize: "12",
            },
          },
        ],
        xAxes: [
          {
            grid: {
              drawBorder: true,
              color: "white",
            },
            ticks: {
              fontColor: "white",
              fontSize: "12",
            },
          },
        ],
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },
          zoom: {
            enabled: true,
            mode: "x",
            drag: true,
          },
        },
      },
    });
    return () => {};
  }, [chartData]);

  useEffect(() => {
    if (!selectedChartData) return;

    // refresh chart

    return () => {};
  }, [selectedChartData]);

  // useEffect(() => {
  //   chartRef.register(zoomPlugin);
  // },[chartRef])

  return chartData ? (
    <Card className={className}>
      {/* select position chart */}
      <Card.Header>
        <Form>
          <Form.Group as={Row}>
            <Form.Label column>Select Cell</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => {
                setSelectedCell(e.target.value);
              }}
            >
              {cellsName.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Card.Header>
      {selectedChartData && (
        <>
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
            <ZoomOutMapOutlined />
            Reset Zoom
          </Button>
          <Line
            options={{
              responsive: true,
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
                        : (resetZoomButtonRef.current.style.display = "block");
                    },
                  },
                  // pan: {
                  //   enabled: true,
                  //   mode: "xy",
                  // },
                },
                legend: {
                  labels: {
                    // width of the box
                    // split the labels into lines
                    font: {
                      size: 14,
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
                    maxRotation: 0,
                    maxTicksLimit: window.innerWidth > 1024 ? 10 : 2,
                    color: "#88CCFF",
                    font: {
                      size: 12,
                      lineHeight: 1,
                    },
                  },
                },
              },
            }}
            redraw={true}
            data={selectedChartData}
            ref={chartRef}
          />
        </>
      )}
      <Card.Footer>
        <NewLineJs appendLine={appendLine} measurementsPositions={cellsName} />
      </Card.Footer>
    </Card>
  ) : (
    <></>
  );
}

export default NitrateChart;
