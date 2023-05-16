import React,{useEffect} from 'react'

export const TimeSelector = ({...props}) => {
    const getTimeByPrefFormatted = (time) => {
        // local storage to get the time pref
        let timePref = localStorage.getItem("timePref");
        // if time pref is 24 hours
        if (timePref === "24") {
          return time;
        } else {
          // if time pref is 12 hours
          let timeArray = time.split(":");
          let hours = timeArray[0];
          let minutes = timeArray[1];
          let ampm = hours >= 12 ? "pm" : "am";
    
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          return hours + ":" + minutes + " " + ampm;
        }
      };


  return (
    <div className='timeSelector'>
        <input
            type='time'
            {...props}
        />
    </div>
  )
}
