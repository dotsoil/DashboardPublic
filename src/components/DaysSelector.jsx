import React from "react";
import "../scss/components/DaysSelector.scss";

const DaysSelector = ({ ...props }) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    

  return (
    <div className="daysSelector">
      {days.map((day) => {
        return (
          <div className="day" >
            <input
              type="checkbox"
              id={day}
              name={day}
              value={day}
              checked={props.days.includes(day)}
              {...props}
            />
            <label htmlFor={day}>{day}</label>
          </div>
        );
      })}
    </div>
  );
};

export default DaysSelector;
