import React, { useEffect } from "react";
import CarouselsCard from "../components/CarouselsCard";

import "../scss/components/Fertilizer.scss";
import FertilizerTable from "../components/FertilizerTable";

const Fertilizer = () => {

  return (
    <div className="fertilizer-container">
      <CarouselsCard
        cards={[
            <FertilizerTable/>,
        ]}
      />
    </div>
  );
};

export default Fertilizer;
