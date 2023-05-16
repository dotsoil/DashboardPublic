import React, { useState, useEffect } from "react";
import { Select, Button } from "antd";
import { Col } from "react-bootstrap";
const { Option } = Select;

const NewLineJs = ({ appendLine, measurementsPositions }) => {
  const [position, setPosition] = useState(null);
  return (
    <>
      <Select
        showSearch
        placeholder="Select a Position"
        optionFilterProp="position"
        onChange={(val) => {
          setPosition(val);
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
      <Button
        onClick={() => {
          if (position) appendLine(position);
        }}
      >
        Add Line
      </Button>
    </>
  );
};

export default NewLineJs;
