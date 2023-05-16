import React, { useState, useEffect, useRef } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Select, Button } from "antd";
import _ from "lodash";
import * as XLSX from "xlsx/xlsx.mjs";
import { Line as LineJS } from "react-chartjs-2";
import { Chart } from "chart.js";

import NewLineJs from "./NewLineJs";
const { Option } = Select;

const ColorsPalette = {
  pos_a: "#0000FF",
  pos_b: "#B03A2E",
  pos_c: "#186A3B",
  pos_d: "#00FFFF",
  pos_e: "#F1948A",
  pos_f: "#ABEBC6",
};

const NitrateChart = ({ rawData, downloadData, className }) => {
  const chart = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [measurementsData, setMeasurementsData] = useState([]);
  const [measurementsProcessData, setMeasurementsProcessData] = useState([]);
  const [measurementsNitrateData, setMeasurementsNitrateData] = useState([]);
  const [measurementsPositions, setMeasurementsPositions] = useState(null);
  const [chartDataType, setChartDataType] = useState("Nitrate");
  const [fileXlsxMeasurement, setFileXlsxMeasurement] = useState();
  const [showNitrateChart, setShowNitrateChart] = useState(true);

  const [numberOfEntriesMeasurements, setNumberOfEntriesMeasurements] =
    useState({}); //
  const [measurementsSelectedPosition, setMeasurementsSelectedPosition] =
    useState(null);

  const ExportMeasurementDataToXls = (data) => {
    const file = XLSX.utils.book_new();
    if (_.isEmpty(data)) {
      setNumberOfEntriesMeasurements({ Data: "Not Found" });
      return;
    }
    setNumberOfEntriesMeasurements(delete numberOfEntriesMeasurements.Data);
    for (const pos in data) {
      setNumberOfEntriesMeasurements((prevNumberOfEntries) => ({
        ...prevNumberOfEntries,
        [pos]: data[pos].length,
      }));
      let raw_wav = data[pos][0]?.samples.map((sample) => sample[0]);
      try {
        let raw_nitrate_wav = data[pos][0]?.nitrate?.map((sample) => [
          sample[0][0] ? sample[0][0] : 0,
        ]);
        raw_wav.push(raw_nitrate_wav);
      } catch (e) {
        console.error(e);
      }
      raw_wav.unshift("");
      let ws = XLSX.utils.aoa_to_sheet([raw_wav], pos);
      if (Object.hasOwnProperty.call(data, pos)) {
        const element = data[pos];
        element?.map((measurements) => {
          let raw_values =
            measurements.samples !== "null"
              ? measurements.samples.map((sample) => sample[1])
              : [];
          try {
            // console.log(measurements.nitrate);

            let raw_values_nitrate =
              measurements.nitrate !== "null"
                ? measurements.nitrate.map((sample) => sample[1])
                : [];
            // console.log(raw_values_nitrate);
            raw_values.push(raw_values_nitrate);
          } catch (e) {
            console.error(e);
          }
          var raw_data = [[measurements.timestamp, ...raw_values]];
          XLSX.utils.sheet_add_aoa(ws, raw_data, {
            origin: -1,
          });
        });
      }

      XLSX.utils.book_append_sheet(file, ws, pos);
    }

    return { file: file, fileName: `data${new Date().toISOString()}.xlsx` };
  };

  const chartMeasurements = (data) => {
    let rawData = {};
    let processedData = {};
    let nitrateData = {};
    for (const pos in data) {
      if (Object.hasOwnProperty.call(data, pos)) {
        let rawElement = data[pos];
        let processedElement = data[pos];
        let nitrateElement = data[pos];

        let nitrateTestData = {};

        let measurement = null;
        for (const iterator of rawElement) {
          measurement = iterator;
          delete measurement.location;
          delete measurement.Sid;

          if (measurement?.samples.length > 0)
            measurement.samples = JSON.parse(measurement?.samples);
        }
        let rawChartData = [];
        let processedChartData = [];
        let nitrateChartData = [];
        let nitrateChartLabels = [];

        nitrateElement.map((entries) => {
          entries.nitrate?.map((entry) => {
            nitrateChartLabels.push(entries.timestamp);
            nitrateTestData[entry[0]] = nitrateTestData[entry[0]]
              ? [[entries.timestamp, entry[1]], ...nitrateTestData[entry[0]]]
              : [[entries.timestamp, entry[1]]];
          });
        });
        for (const key in nitrateTestData) {
          if (Object.hasOwnProperty.call(nitrateTestData, key)) {
            const element = nitrateTestData[key];
            let dataSet = {
              id: key,
              label: key,
              data: element.map((x) => x[1]),
              color: "red",
              borderColor:
                ColorsPalette[pos] === undefined
                  ? `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
                      Math.random() * 255
                    )}, ${Math.round(Math.random() * 255)})`
                  : ColorsPalette[pos],
              backgroundColor:
                ColorsPalette[pos] === undefined
                  ? `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
                      Math.random() * 255
                    )}, ${Math.round(Math.random() * 255)})`
                  : ColorsPalette[pos],
            };

            //reverse data for
            dataSet.data = dataSet.data.reverse();
            nitrateChartData.push(dataSet);
          }
        }
        rawElement.forEach((elem) => {
          let dataSet = {
            id: elem.timestamp,
            label: elem.timestamp,
            data: elem.samples?.map((x) => x[1]),
            color: "red",
            borderColor: `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
              Math.random() * 255
            )}, ${Math.round(Math.random() * 255)})`,
            backgroundColor: `rgb(${Math.round(
              Math.random() * 255
            )}, ${Math.round(Math.random() * 255)}, ${Math.round(
              Math.random() * 255
            )})`,
          };
          rawChartData.push(dataSet);
        });
        processedElement.forEach((elem, index) => {
          if (data.hasOwnProperty("pos_ref")) {
            let ref_data = data["pos_ref"][index];
            let dataSet = {
              id: elem?.timestamp,
              label: elem?.timestamp, //elem.samples.map((x) => x[0]),
              data: elem?.samples?.map((val, index) =>
                ref_data?.samples !== undefined
                  ? -Math.log(val[1] / ref_data?.samples?.[index][1])
                  : 1
              ),
              color: "red",
              borderColor: `rgb(${Math.round(
                Math.random() * 255
              )}, ${Math.round(Math.random() * 255)}, ${Math.round(
                Math.random() * 255
              )})`,
              backgroundColor: `rgb(${Math.round(
                Math.random() * 255
              )}, ${Math.round(Math.random() * 255)}, ${Math.round(
                Math.random() * 255
              )})`,
            };
            processedChartData.push(dataSet);
          }
        });

        rawData[pos] = {
          datasets: rawChartData,
          labels: rawElement[0]?.samples?.map((sample) => sample[0]),
        };
        processedData[pos] = {
          datasets: processedChartData,
          labels: rawElement[0]?.samples?.map((sample) => sample[0]),
        };
        nitrateData[pos] = {
          datasets: nitrateChartData,
          labels: [...new Set(nitrateChartLabels)],
        };
        // console.log(nitrateTestData);

        for (const key in nitrateTestData) {
          if (Object.hasOwnProperty.call(nitrateTestData, key)) {
            const element = nitrateTestData[key];
          }
        }
      }
    }

    setMeasurementsData(rawData);
    setMeasurementsProcessData(processedData);
    setMeasurementsNitrateData(nitrateData);
    setMeasurementsPositions(Object.keys(data));
  };

  const ChartMeasurementsData = (nthSample) => {
    switch (chartDataType) {
      case "Scope":
        return (
          measurementsData[measurementsSelectedPosition] && (
            <LineJS
              ref={chart}
              // options={{
              //   responsive: true,
              // }}
              datasetIdKey="id"
              data={measurementsData[measurementsSelectedPosition]}
            />
          )
        );
      case "Absorbance":
        return (
          measurementsProcessData[measurementsSelectedPosition] && (
            <LineJS
              ref={chart}
              options={{
                responsive: true,
              }}
              datasetIdKey="id"
              data={measurementsProcessData[measurementsSelectedPosition]}
            />
          )
        );
      case "Nitrate":
        return (
          measurementsNitrateData[measurementsSelectedPosition] && (
            <LineJS
              ref={chart}
              // options={{
              //   responsive: true,
              // }}
              redraw={true}
              datasetIdKey="id"
              data={measurementsNitrateData[measurementsSelectedPosition]}
            />
          )
        );
    }
  };

  useEffect(() => {
    if (rawData && downloadData) {
      chartMeasurements(rawData);
      try {
        const { file, fileName } = ExportMeasurementDataToXls(rawData);
        setFileXlsxMeasurement({ file, fileName });
      } catch (e) {}
    }
  }, [rawData]);

  const getRelevelData = (chartDataType) => {
    switch (chartDataType) {
      case "Scope":
        return measurementsData;
      case "Absorbance":
        return measurementsProcessData;
      case "Nitrate":
        return measurementsNitrateData;
    }
  };

  useEffect(() => {
    setChartData(getRelevelData(chartDataType)[measurementsSelectedPosition]);
  }, [chartDataType, measurementsSelectedPosition]);

  const appendLine = (position) => {
    let chartDataSet = chartData.datasets;
    let newLineDataSet = getRelevelData(chartDataType)[position].datasets;
    newLineDataSet.forEach((elem) => {
      elem.label = position;
    });
    chartDataSet.forEach((elem) => {
      elem.label = measurementsSelectedPosition;
    });
    setChartData({
      ...chartData,
      datasets: [...chartDataSet, ...newLineDataSet],
    });
  };
  return (
    <div className={className}>
      <h2>Measurement Data</h2>
      {!rawData ? null : (
        <Button
          type="secondary"
          shape="round"
          // icon={<DownloadOutlined />}
          disabled={rawData === null ? true : false}
          size="large"
          onClick={() => {
            setShowNitrateChart(!showNitrateChart);
          }}
        >
          {!showNitrateChart ? "Show Chart" : "Hide Chart"}
        </Button>
      )}

      {!showNitrateChart ? null : (
        <div>
          <Select
            showSearch
            placeholder="Select a Position"
            optionFilterProp="position"
            onChange={(val) => {
              setMeasurementsSelectedPosition(val);
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {measurementsPositions &&
              measurementsPositions.map((val, index) => (
                <Option key={index} value={val}>
                  {val}
                </Option>
              ))}
          </Select>
          <Select
            onChange={(val) => {
              setChartDataType(val);
            }}
            value={chartDataType}
          >
            <Option index={0} value={"Absorbance"}>
              Absorbance
            </Option>
            <Option index={1} value={"Scope"}>
              Scope
            </Option>
            <Option index={1} value={"Nitrate"}>
              Nitrate
            </Option>
          </Select>

          {chartData && (
            <LineJS
              ref={chart}
              redraw={true}
              datasetIdKey="id"
              data={chartData}
            />
          )}
          <br></br>
          <NewLineJs
            appendLine={appendLine}
            measurementsPositions={measurementsPositions}
          />
          {/* {ChartMeasurementsData()} */}
        </div>
      )}
      {!downloadData ? null : (
        <div>
          {numberOfEntriesMeasurements &&
            Object.keys(numberOfEntriesMeasurements).map((entry) => (
              <section key={entry}>
                <label>{entry} : </label>
                <label>{numberOfEntriesMeasurements[entry]} entries</label>
              </section>
            ))}
          <Button
            type="secondary"
            shape="round"
            icon={<DownloadOutlined />}
            size="large"
            disabled={fileXlsxMeasurement === undefined}
            onClick={() => {
              XLSX.writeFile(
                fileXlsxMeasurement.file,
                fileXlsxMeasurement.fileName
              );
            }}
          >
            Download
          </Button>
        </div>
      )}
    </div>
  );
};

export default NitrateChart;
