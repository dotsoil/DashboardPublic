const groupBy = (array, key) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
};


const calculateSizeToUserUnit = (toUnit, size, fromUnit = "DUNAM") => {
  const unit = {
    DUNAM: 1,
    HECTARE: 100,
    ACRE: 247.105,
    METERS: 1000,
    SQUARE_METER: 10000,
    SQUARE_KILOMETER: 0.01,
    SQUARE_MILE: 0.00386102,
    SQUARE_FOOT: 107639,
    SQUARE_YARD: 11959.9,
  };
  return (size * unit[fromUnit]) / unit[toUnit];
};

export { calculateSizeToUserUnit, groupBy };
