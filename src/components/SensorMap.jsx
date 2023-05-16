import React, { useState, useEffect, useContext } from "react";
import GoogleMapReact from "google-map-react";
import "./SensorMap.css";
import DotsSvg from "./DotsSvg";
import { calculateSizeToUserUnit } from "../utils/globalFunctions";
import globalContext from "../context/GlobalContext";
import randomColor from "randomcolor";

const Marker = ({ text, onClick }) => (
  <div onClick={onClick}>
    <div className="hi-dots-horizontal">
      <div className="dot"></div>
      <div className="dot"></div>
      <DotsSvg width={window.innerHeight / 30} fill="#646cff" />
    </div>
  </div>
);

function SensorMap({
  userSensors,
  mapCenter,
  mapZoom,
  onMapMove,
  setSelectedSensor,
  setShowSensorControl,
  fieldSize,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);
  const { selectedField } = useContext(globalContext);
  const onMapChange = ({ center, zoom }) => {
    onMapMove(center, zoom);
  };

  const handleApiLoaded = (map, maps) => {
    setIsLoaded(true);
    setMap(map);
    setMaps(maps);
    // set radius
    let sizeInMeters = calculateSizeToUserUnit("DUNAM", fieldSize) * 1000;
    let radius = Math.sqrt(sizeInMeters / Math.PI);

    const circle = new maps.Circle({
      strokeColor: randomColor({
        luminosity: "light",
        hue: "random",
        format: "rgba",
        alpha: 0.8,
      }),
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: randomColor({
        luminosity: "light",
        hue: "random",
        format: "rgba",
        alpha: 0.35,
      }),

      fillOpacity: 0.35,
      map,
      center: mapCenter,
      radius: radius,
    });
    circle.setMap(map);
  };

  useEffect(() => {
    // when mapcenter changes, set the map center to the new center and delete the old circle and create a new one
    if (isLoaded) {
      // remove old circle
      map.data.forEach((feature) => {
        map.data.remove(feature);
      });

      let sizeInMeters = calculateSizeToUserUnit("DUNAM", fieldSize) * 1000;
      let radius = Math.sqrt(sizeInMeters / Math.PI);
      const circle = new maps.Circle({
        strokeColor: randomColor({
          luminosity: "dark",
          hue: "random",
          format: "rgba",
          alpha: 0.8,
        }),

        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: randomColor({
          luminosity: "dark",
          hue: "random",
          format: "rgba",
          alpha: 0.35,
        }),
        fillOpacity: 0.85,
        map,
        center: mapCenter,
        radius: radius,
      });
    }
  }, [mapCenter]);

  useEffect(() => {
    if (isLoaded) {
      map.setCenter(mapCenter);
      map.setZoom(mapZoom);
    }
  }, []);

  return (
    <GoogleMapReact
      bootstrapURLKeys={{
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ["places", "geometry", "drawing", "visualization"],
      }}
      onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      onChange={onMapChange}
      center={mapCenter}
      resetBoundsOnResize={true}
      yesIWantToUseGoogleMapApiInternals={true}
      options={{
        backgroundColor: "transparent",
        clickableIcons: false,
        mapTypeId: "satellite",
        disableDefaultUI: true,
        gestureHandling: "greedy",
        keyboardShortcuts: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: 3,
        },
        fullscreenControl: false,
        zoomControlOptions: {
          position: 7,
        },
        zoomControl: true,
        minZoom: 10,
        noClear: true,
        scrollwheel: true,
      }}
      zoom={mapZoom}
    >
      {userSensors?.map((sens, index) => (
        <Marker
          key={index}
          lat={sens?.Location?.latitude}
          lng={sens?.Location?.longitude}
          text={sens?.Sid}
          onClick={() => {
            setSelectedSensor(sens);
            setShowSensorControl(true);
          }}
        />
      ))}
    </GoogleMapReact>
  );
}

export default SensorMap;
