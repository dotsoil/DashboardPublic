import React from "react";
import ReactLoading from "react-loading";

const Loading = ({ hidden, type, color, size }) => (
  <ReactLoading
    hidden={hidden}
    type={type}
    color={color}
    height={size?.height || 100}
    width={size?.width || 100}
  />
);

export default Loading;
