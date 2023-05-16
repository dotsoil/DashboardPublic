{/* google map to set field location polygon */}
import React from 'react'
import { Modal } from 'react-bootstrap'
import GoogleMapReact from 'google-map-react'
import { PinDrop } from "@mui/icons-material";
import { calculateSizeToUserUnit } from "../utils/globalFunctions";

const FieldPin = ({ lat, lng }) => {
  return (
    <div
      style={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}
      lat={lat}
      lng={lng}
    >
      <div
        style={{
          width: "2rem",
          height: "2rem",
          borderRadius: "50%",
          backgroundColor: "red",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </div>
  );
};

const MapModal = ({
  show,
  handleClose,
  mapCenter,
  fieldSize,
  showRadius = true,
  showPin,
  pinLocation,
  setPinLocation,
  ...props
}) => {
  const handleApiLoaded = (map, maps) => {
    // circle example of field size calculation
    if (showRadius) {
      let sizeInMeters = calculateSizeToUserUnit("DUNAM", fieldSize) * 1000;
      let radius = Math.sqrt(sizeInMeters / Math.PI);

      const circle = new maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
        center: mapCenter,
        radius: radius,
      });
      circle.setMap(map);
    }
    if (showPin) {
      // enable pin moving on map and set the pin location to the new location
      const marker = new maps.Marker({
        position: mapCenter,
        map,
        draggable: true,
        icon: {
          url: "https://img.icons8.com/ios-filled/50/000000/marker.png",
          scaledSize: new maps.Size(35, 35),
        },
      });
      marker.setMap(map);
      // add to map current pin button
      const pinButton = document.createElement("div");

      pinButton.style.backgroundColor = "#fff";
      pinButton.style.border = "none";
      pinButton.style.outline = "none";
      pinButton.style.width = "35px";
      pinButton.style.height = "35px";
      pinButton.style.borderRadius = "50%";
      pinButton.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
      pinButton.style.cursor = "pointer";
      pinButton.style.marginBottom = "1rem";
      pinButton.style.marginLeft = "1rem";
      pinButton.style.textAlign = "center";
      pinButton.title = "Click to recenter the map";
      pinButton.style.display = "flex";
      pinButton.style.justifyContent = "center";
      pinButton.style.alignItems = "center";

      marker.addListener("dragend", (e) => {
        setPinLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      });
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-FloatingLabelledby="contained-modal-title-vcenter"
      centered
      className="modal-fields-edit"
      backdrop="static"
      {...props}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Map</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "30rem" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            libraries: ["places", "geometry", "drawing", "visualization"],
          }}
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          defaultCenter={mapCenter}
          defaultZoom={15}
          center={mapCenter}
          resetBoundsOnResize={true}
          yesIWantToUseGoogleMapApiInternals
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
        ></GoogleMapReact>
      </Modal.Body>
    </Modal>
  );
};

export default MapModal