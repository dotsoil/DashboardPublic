import React, { useState, useEffect } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  CartesianGrid,
  Line,
  ResponsiveContainer,
} from "recharts";

const colors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ff00ff",
  "#00ffff",
  "#ffff00",
];

import _ from "lodash";
import * as XLSX from "xlsx/xlsx.mjs";

import { Button, Select } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import { Card } from "react-bootstrap";

import "../scss/components/HumidityChart.scss";
import { useTranslation } from "react-i18next";

const HumidityData = ({ humidityData, downloadData }) => {
  const [filterResult, setFilterResult] = useState(10);
  const [fileXlsxHumidity, setFileXlsxHumidity] = useState();
  const [showHumidityChart, setShowHumidityChart] = useState(false);
  const { t } = useTranslation();

  const getMoisturePosition = (index) => {
    switch (index) {
      case 1:
        return `${t("cm")}:20  ${t("Tap")}-2`;
      case 3:
        return `${t("cm")}:40  ${t("Tap")} 2`;
      case 4:
        return `${t("cm")}:20  ${t("Tap")} 1`;
      case 5:
        return `${t("cm")}:40  ${t("Tap")} 1`;
    }
  };
  const ExportHumidityDataToXls = (humidityData) => {
    const file = XLSX.utils.book_new();
    if (_.isEmpty(humidityData)) {
      return;
    }
    let humData = humidityData?.map((sample) => {
      return [
        sample["1"]?.timestamp,
        sample["1"]?.humidity,
        sample["2"]?.humidity,
        sample["3"]?.humidity,
        sample["4"]?.humidity,
        sample["5"]?.humidity,
        sample["6"]?.humidity,
        sample["7"]?.humidity,
        sample["8"]?.humidity,
        sample["9"]?.humidity,
      ];
    });
    let tempData = humidityData.map((sample) => {
      return [
        sample["1"]?.timestamp,
        sample["1"]?.temperature,
        sample["2"]?.temperature,
        sample["3"]?.temperature,
        sample["4"]?.temperature,
        sample["5"]?.temperature,
        sample["6"]?.temperature,
        sample["7"]?.temperature,
        sample["8"]?.temperature,
        sample["9"]?.temperature,
      ];
    });
    humData.unshift([
      "Timestamp",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "TDR A",
      "TDR B",
      "TDR C",
    ]);
    tempData.unshift([
      "Timestamp",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "TDR A",
      "TDR B",
      "TDR C",
    ]);
    let wsHumidity = XLSX.utils.aoa_to_sheet(humData);
    let wsTemp = XLSX.utils.aoa_to_sheet(tempData);
    XLSX.utils.book_append_sheet(file, wsHumidity, "Humidity");
    XLSX.utils.book_append_sheet(file, wsTemp, "Temperature");
    return {
      file: file,
      fileName: `humidity_data${new Date().toISOString()}.xlsx`,
    };
  };

  useEffect(() => {
    if (downloadData && humidityData) {
      try {
        const { file, fileName } = ExportHumidityDataToXls(humidityData);
        setFileXlsxHumidity({ file, fileName });
      } catch (error) {
        console.error(error);
      }
    }
    return () => {};
  }, [humidityData]);

  return humidityData ? (
    <Card className="humidity-chart">
      {!humidityData ? null : (
        <Card.Header>
          <h5>Filter Result</h5>
          <Select
            defaultValue={filterResult}
            style={styles.Button}
            onChange={(value) => {
              setFilterResult(value);
            }}
          >
            {_.range(10, 110, 10).map((value) => {
              return (
                <Option key={value} value={value}>
                  {value}%
                </Option>
              );
            })}
          </Select>
        </Card.Header>
      )}
      {humidityData ? (
        <ResponsiveContainer
          width={window.innerWidth / 1.3}
          height={window.innerWidth > 1024 ? window.innerHeight : window.innerHeight /2.5}
        >
          <LineChart
            className="humidity-chart-line"
            data={
              //filter data by precentege
              humidityData.filter((sample, index) => {
                let percentage = (filterResult / 100) * humidityData.length;
                percentage = percentage === 0 ? 1 : percentage;
                let filter = Math.floor(humidityData.length / percentage);
                if (index % filter === 0) return sample;
              })
            }
          >
            <Tooltip
              contentStyle={{
                backgroundColor: "#cff9cd",
                borderRadius: "5px",
                fontSize: "1.8rem",
              }}
              labelStyle={{
                fontSize: ".8rem",
                color: "black",
              }}
              itemStyle={{
                fontSize: ".8rem",
              }}
            />

            {/* <CartesianGrid strokeDasharray="6 6" /> */}
            <XAxis
              stroke="#88CCFF"
              dataKey="1.timestamp"
            />
            <YAxis stroke="#88CCFF"  />
            <Legend verticalAlign="bottom" align="center" 
            wrapperStyle={{fontSize: ".8rem"}}
            />

            {humidityData?.map((sample, index) => {
              // if data is not empty
              if (sample[`${index + 1}`]?.humidity === undefined) return;
              return (
                <Line
                  key={index}
                  name={`${getMoisturePosition(index + 1)}`}
                  type="monotone"
                  dataKey={`${index + 1}.humidity`}
                  stroke={colors[index]}
                  activeDot={{ r: 5 }}
                  connectNulls={true}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        ""
      )}
      {!downloadData ? null : (
        <Card.Footer>
          <Button
            type="secondary"
            shape="round"
            icon={<DownloadOutlined />}
            size="large"
            disabled={fileXlsxHumidity === undefined}
            onClick={() => {
              XLSX.writeFile(fileXlsxHumidity.file, fileXlsxHumidity.fileName);
            }}
          >
            Download
          </Button>
        </Card.Footer>
      )}
    </Card>
  ) : null;
};

const styles = {
  Button: {
    color: "#88CCFF",
  },
};

export default HumidityData;
