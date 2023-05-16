// on off svg icon
import React from "react";
import "./OnOffIcon.scss";
const OnOffIcon = ({ isOn }) => {
  return (
    <div className={`orb ${isOn ? "online" : "offline"}`}>
      <div class="shine"></div>
      <div class="light"></div>
    </div>
  );
};

export default OnOffIcon;
