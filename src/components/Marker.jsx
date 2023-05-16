import React from "react";
import PropTypes from "prop-types";
import { MdSensors } from "react-icons/md";
import { MdSensorsOff } from "react-icons/md";

//Show labels side to marker with color light green
//Design modal as sensor svg with 4 channels

const Marker = ({ onClick, isOnline, size }) => (
  //svg with circle with wifi icon signalled
  <div
    style={{
      color: "white",
      background: "grey",
      padding: "15px 10px",
      display: "inline-flex",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "100%",
      transform: "translate(-50%, -50%)",
    }}
  >
    text
  </div>
  // <Wrapper>
  //   {isOnline ? (
  //     <MdSensors size={size} color="#53841e" onClick={onClick} style={
  //       {position: "absolute",
  //       transform: "translateZ(0) translate(-50%, -50%)",

  //     }}/>
  //   ) : (
  //     <MdSensorsOff size={size} color="lightcoral" onClick={onClick} />
  //   )}
  // </Wrapper>
);

Marker.defaultProps = {
  onClick: null,
};

Marker.propTypes = {
  onClick: PropTypes.func,
};

export default Marker;
