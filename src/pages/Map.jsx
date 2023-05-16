import React,{ useState,useContext, useEffect} from 'react'
import SensorMap from '../components/SensorMap'
import globalContext from '../context/GlobalContext'
import SensorController from './Admin/SensorController';
import API from '../utils/API';

function Map({
  width = window.innerWidth,
  height = window.innerHeight,
  mapCenterValue = { lat: 31.771959, lng: 35.217018 },
}) {
  const { userSensors, selectedField } = useContext(globalContext);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [mapCenter, setMapCenter] = useState(mapCenterValue);
  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => {
    if (selectedField) {
      setMapCenter({
        lat:
          selectedField?.Location?.latitude ||
          selectedField?.location?.latitude,
        lng:
          selectedField?.Location?.longitude ||
          selectedField?.location?.longitude,
      });

      setMapZoom(15);
    }
  }, [selectedField]);

  const [showSensorController, setShowSensorControl] = useState(false);

  const onMapMove = ({ center, zoom }) => {
    // setMapCenter(center);
    // setMapZoom(zoom);
  };
  return (
    // style style.container and height={height}
    <div style={{ height: height, width: width }}>
      <SensorMap
        userSensors={userSensors}
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        onMapMove={onMapMove}
        setSelectedSensor={setSelectedSensor}
        setShowSensorControl={setShowSensorControl}
        fieldSize={selectedField?.size}
      />
      {showSensorController && (
        <SensorController
          show={showSensorController}
          onHide={() => setShowSensorControl(false)}
          Sensor={selectedSensor}
        />
      )}
    </div>
  );
}


export default Map