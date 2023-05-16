import React, { useState, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

function CountrySelector({ country, onChange, ...props }) {
  const options = useMemo(() => countryList().getData(), []);

  return (
    <Select
      options={options}
      value={options.find((obj) => obj.label === country)}
      onChange={(e) => onChange(e.label)}
      {...props}
    />
  );
}

export default CountrySelector;
