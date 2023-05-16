import React, {useEffect} from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  WiHumidity,
  WiThermometer,
  WiThermometerExterior,
  WiWindBeaufort0,
  WiWindDeg,
} from "react-icons/wi";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import "../scss/components/WeatherCard.scss";
import { RiAncientGateFill, RiAndroidFill, RiRainyLine } from "react-icons/ri";
import { AirOutlined, Co2Outlined, PinDropSharp } from "@mui/icons-material";

function WeatherCard({ Temperature }) {
  const [showDegreeCelsius, setShowDegreeCelsius] = React.useState(true);
  const [temperature, setTemperature] = React.useState(
    Temperature?.temperature
  );

  useEffect(() => {
    console.log(Temperature);
    if (localStorage.getItem("temperatureUnit") === "Celsius") {
      setShowDegreeCelsius(true);
      setTemperature(Temperature?.temperature.toFixed(2));
    } else {
      setShowDegreeCelsius(false);
      let far = (Temperature?.temperature * 9) / 5 + 32;
      setTemperature(far.toFixed(2));
    }
  }, []);

  const { t } = useTranslation();
  return (
    <div className="WeatherCard">
      <Card className="first">
        <Card.Text>{Temperature?.locationName || "N/A"}</Card.Text>
        {/* Temperature in celsius */}
        <Card.Text className="weatherIcon">
          {Temperature?.weatherIcon && (
            <img src={Temperature?.weatherIcon} alt="weather icon" />
          )}
          {Temperature?.weatherDescription || " "}
        </Card.Text>
        <Card.Text className="temperature">
          <WiThermometerExterior />
          {temperature || " "}
          {showDegreeCelsius ? "°C" : "°F"}
        </Card.Text>
        
        <Card.Text className="air-quality"></Card.Text>
      </Card>
      <Card className="second">
        <Card.Header>
          <Card.Title>{t("Details")}</Card.Title>
        </Card.Header>
          {"Rain Volume"}
          <RiRainyLine/>
        <Card.Body>
        <Card.Text>{Temperature?.rainVolume}  millimeter</Card.Text>
        </Card.Body>
        <Card.Body>
          <Card.Body>
            <WiHumidity
              onClick={() => {
                toast.info(
                  t("Humidity is the amount of water vapor present in the air"),
                  {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }
                );
              }}
            />{" "}
            {Temperature?.humidity || " "}
          </Card.Body>
          <Card.Body>
            <WiWindBeaufort0
              onClick={() => {
                toast.info(
                  t(
                    "Wind speed is the speed of the wind, measured by an anemometer"
                  ),
                  {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }
                );
              }}
            />{" "}
            {Temperature?.windSpeed || " "}m/s
          </Card.Body>
          <Card.Body>
            <WiWindDeg
              onClick={() => {
                toast.info(
                  t(
                    "Wind direction is the direction from which the wind is blowing"
                  ),
                  {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }
                );
              }}
            />{" "}
            {Temperature?.windDirection || ""} {"°"}
            {Temperature?.windDirection && Temperature?.windDirection > 337.5
              ? "N"
              : ""}{" "}
            {Temperature?.windDirection &&
            Temperature?.windDirection > 292.5 &&
            Temperature?.windDirection < 337.5
              ? "NW"
              : ""}{" "}
            {Temperature?.windDirection &&
            Temperature?.windDirection > 247.5 &&
            Temperature?.windDirection < 292.5
              ? "W"
              : ""}{" "}
            {Temperature?.windDirection &&
            Temperature?.windDirection > 202.5 &&
            Temperature?.windDirection < 247.5
              ? "SW"
              : ""}{" "}
            {Temperature?.windDirection &&
            Temperature?.windDirection > 157.5 &&
            Temperature?.windDirection < 202.5
              ? "S"
              : ""}{" "}
            {Temperature?.windDirection &&
            Temperature?.windDirection > 122.5 &&
            Temperature?.windDirection < 157.5
              ? "SE"
              : ""}{" "}
            {Temperature?.windDirection &&
            Temperature?.windDirection > 67.5 &&
            Temperature?.windDirection < 122.5
              ? "E"
              : ""}{" "}
            {Temperature?.windDirection &&
            Temperature?.windDirection > 22.5 &&
            Temperature?.windDirection < 67.5
              ? "NE"
              : ""}{" "}
            {Temperature?.windDirection && Temperature?.windDirection < 22.5
              ? "N"
              : ""}{" "}
          </Card.Body>
        </Card.Body>
      </Card>
      {/* <Card className="third">
        <Card.Header>
          <Card.Title>Air Quality</Card.Title>
        </Card.Header>
        <Card.Body className="air-quality">
          <Card.Text>
            {Temperature?.airQuality.co.toFixed(1) || " "} CO
          </Card.Text>
          <Card.Text>
            {Temperature?.airQuality.no2.toFixed(1) || " "} NO2
          </Card.Text>

          <Card.Text>
            {Temperature?.airQuality.o3.toFixed(1) || " "} O3
          </Card.Text>
        </Card.Body>
        <Card.Body className="air-quality">
          <Card.Text>
            {Temperature?.airQuality.so2.toFixed(1) || " "} SO2
          </Card.Text>

          <Card.Text>
            {Temperature?.airQuality.pm2_5.toFixed(1) || " "} PM2.5
          </Card.Text>

          <Card.Text>
            {Temperature?.airQuality.pm10.toFixed(1) || " "} PM10
          </Card.Text>
        </Card.Body>
      </Card> */}
    </div>
  );
}

export default WeatherCard;



