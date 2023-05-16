import React from "react";
import "./PieChart.scss";
// pieChart for percentage  etc battery, temperature, humidity
const PieChart = ({ percentage, color, isTemperature = false }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <div className="strokeDashoffset">
      <svg height="100" width="100">
        <circle
          stroke="lightgrey"
          fill="transparent"
          strokeWidth="10"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth="10"
          r={radius}
          cx="50"
          cy="50"
          strokeDasharray={circumference < 0 ? 0 : circumference}
          strokeDashoffset={strokeDashoffset < 0 ? 0 : strokeDashoffset}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="20"
          fill="black"
        >
          {isTemperature ? `${percentage}°C` : `${percentage}%`}
        </text>
      </svg>
    </div>
  );
};

export default PieChart;
