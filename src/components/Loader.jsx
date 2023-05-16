import React from "react";
import "./loader.scss";
function Loader({ size }) {
  return (
    <div style={{ fontSize: size }}>
      <div className="loader" style={{ fontSize: size }}></div>
    </div>
  );
}

export default Loader;
