import React, { useEffect } from 'react'
import { Modal, Button, Form, Image } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import '../scss/components/FieldModal.scss'
import {
  DateRangeRounded,
  EditLocationAlt,
  GpsFixedOutlined,
  GpsFixedSharp,
  LocationOnOutlined,
  MapRounded,
  PinchOutlined,
} from "@mui/icons-material";
import { calculateSizeToUserUnit } from "../utils/globalFunctions";
import API from "../utils/API";
import MapModal from "./MapModal";
function FieldModal({
  openModal,
  closeModal,
  modalShow,
  setModalShow,
  fieldData,
  updateFieldData,
  ...props
}) {
  const { t } = useTranslation();
  const [mapPinModalShow, setMapPinModalShow] = React.useState(false);
  const [tempFieldData, setTempFieldData] = React.useState(fieldData);
  const fieldUnit = localStorage.getItem("fieldUnit") || "DUNAM";
  const [pinLocation, setPinLocationModal] = React.useState({
    lat: tempFieldData?.location?.latitude,
    lng: tempFieldData?.location?.longitude,
  });

  const setPinLocation = (location) => {
    setPinLocationModal(location);
    if (location.lat) {
      setTempFieldData({
        ...tempFieldData,
        location: {
          latitude: location.lat,
          longitude: location.lng,
        },
      });
    }
  };

  useEffect(() => {
    setTempFieldData(fieldData);
  }, [fieldData]);

  const getCropImage = async (cropType) => {
    // translate crop type to english for the api call using translation file wait for response
    const url = `https://translation.googleapis.com/language/translate/v2?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&source=${""}&target=${"en"}&q=${cropType}`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const translatedText = res.data.translations[0].translatedText;
        API.get("openApi/CropImage", {
          params: {
            cropName: translatedText,
          },
        }).then((res) => {
          console.log(res);
          setTempFieldData({
            ...tempFieldData,
            cropImage: res.data.src.medium,
            photographer: res.data.photographer,
          });
        });
      })
      .catch((err) => {});
  };

  const openPinMapModal = (location) => {};

  return (
    <div>
      <MapModal
        show={mapPinModalShow}
        handleClose={() => setMapPinModalShow(false)}
        mapCenter={{
          lat: tempFieldData?.location?.latitude,
          lng: tempFieldData?.location?.longitude,
        }}
        fieldSize={tempFieldData?.size}
        showRadius={false}
        showPin={true}
        pinLocation={pinLocation}
        setPinLocation={setPinLocation}
      />
      <Modal
        show={modalShow}
        onHide={closeModal}
        size="lg"
        aria-FloatingLabelledby="contained-modal-title-vcenter"
        centered
        className="modal-fields-edit"
        backdrop="static"
        {...props}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {tempFieldData?.name}
            <br />
            {calculateSizeToUserUnit(fieldUnit, tempFieldData?.size)}{" "}
            {t(fieldUnit)}
          </Modal.Title>
        </Modal.Header>
        {/* 2  columns  of the fields can be edited */}
        <Modal.Body>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Image
              src={tempFieldData?.cropImage}
              roundedCircle
              // text on the image
              alt={tempFieldData?.cropType}
            />
            <span style={{ fontSize: ".8rem" }}>
              {tempFieldData?.photographer
                ? `Photo by ${tempFieldData?.photographer}`
                : ""}
            </span>
          </div>
          <Form>
            <Form.Group>
              <Form.FloatingLabel>{t("Field Name")}</Form.FloatingLabel>
              <Form.Control
                placeholder={tempFieldData?.name}
                type="text"
                value={tempFieldData?.name}
                onChange={(e) =>
                  setTempFieldData({ ...tempFieldData, name: e.target.value })
                }
              />
            </Form.Group>
            {/* number between 0 - 100 */}
            <Form.Group>
              <Form.FloatingLabel>{t("Field Size")}</Form.FloatingLabel>
              {tempFieldData?.size ? (
                <Form.Text>{t(fieldUnit)}</Form.Text>
              ) : null}
              <Form.Control
                placeholder={`${tempFieldData?.size} ${t(fieldUnit)}`}
                type="number"
                min={0}
                value={calculateSizeToUserUnit(fieldUnit, tempFieldData?.size)}
                onChange={(e) =>
                  setTempFieldData({
                    ...tempFieldData,
                    size: calculateSizeToUserUnit(
                      "DUNAM",
                      Number(e.target.value),
                      fieldUnit
                    ),
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.FloatingLabel>{t("Field Location")}</Form.FloatingLabel>
              <LocationOnOutlined
                //* onclick get the current location
                onClick={() => {
                  navigator.geolocation.getCurrentPosition((position) => {
                    //* set the location to the current location
                    setTempFieldData({
                      ...tempFieldData,
                      location: {
                        latitude: Number(position.coords.latitude.toFixed(5)),
                        longitude: Number(position.coords.longitude.toFixed(5)),
                      },
                    });
                  });
                }}
              />
              <MapRounded
                onClick={() => {
                  // open map modal with the current location and let the user choose a location from the map
                  setPinLocation(tempFieldData?.location);
                  setMapPinModalShow(true);
                }}
              />
              <Form.Control
                placeholder={`${tempFieldData?.location?.latitude} ${tempFieldData?.location?.longitude}`}
                onChange={(e) => {
                  // get the location from the input
                  const location = e.target.value.split(",");
                  // set the location to the input location
                  setTempFieldData({
                    ...tempFieldData,
                    location: {
                      latitude: Number(location[0]),
                      longitude: Number(location[1]),
                    },
                  });
                }}
                value={`${tempFieldData?.location?.latitude}, ${tempFieldData?.location?.longitude}`}
                type="gps"
              ></Form.Control>
            </Form.Group>
          </Form>
          <Form>
            <Form.Group>
              <Form.FloatingLabel>{t("Crop Type")}</Form.FloatingLabel>
              <Form.Control
                placeholder={tempFieldData?.cropType}
                type="text"
                value={tempFieldData?.cropType}
                onChange={(e) => {
                  setTempFieldData({
                    ...tempFieldData,
                    cropType: e.target.value,
                  });
                }}
                // on finish editing
                onBlur={(e) => {
                  getCropImage(e.target.value);
                }}
                // prevent refresh on enter
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.FloatingLabel>{t("Field Type")}</Form.FloatingLabel>
              <Form.Select
                placeholder={tempFieldData?.fieldType}
                value={tempFieldData?.fieldType}
                onChange={(e) => {
                  let fieldType = e.target.value.toString();
                  setTempFieldData({ ...tempFieldData, fieldType: fieldType });
                }}
              >
                {/* Open Field , greenhouse, nethouse */}
                <option value="open-field">{t("Open Field")}</option>
                <option value="greenhouse">{t("Green House")}</option>
                <option value="netHouse">{t("Net House")}</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.FloatingLabel>{t("Cultivation Type")}</Form.FloatingLabel>
              <Form.Select
                placeholder={tempFieldData?.typeCultivation}
                value={tempFieldData?.typeCultivation}
                onChange={(e) => {
                  // value to string
                  let value = e.target.value.toString();
                  setTempFieldData({
                    ...tempFieldData,
                    typeCultivation: value,
                  });
                }}
              >
                <option value="organic">{t("Organic")}</option>
                <option value="conventional">{t("Conventional")}</option>
              </Form.Select>
            </Form.Group>
          </Form>
          <Form>
            <Form.Group type="date">
              <Form.FloatingLabel>
                {t("Seed Date")}
                <DateRangeRounded />
              </Form.FloatingLabel>
              <Form.Control
                type="date"
                placeholder={tempFieldData?.seedDate}
                value={tempFieldData?.seedDate}
                // block future dates
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setTempFieldData({
                    ...tempFieldData,
                    seedDate: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.FloatingLabel>
                {t("Harvest Date")}
                <DateRangeRounded />
              </Form.FloatingLabel>
              <Form.Control
                type="date"
                placeholder={tempFieldData?.harvestDate}
                value={tempFieldData?.harvestDate}
                min={
                  new Date(tempFieldData?.seedDate).toISOString().split("T")[0]
                }
                onChange={(e) =>
                  setTempFieldData({
                    ...tempFieldData,
                    harvestDate: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.FloatingLabel>{t("Irrigation Type")}</Form.FloatingLabel>
              <Form.Select
                placeholder={tempFieldData?.irrigationType}
                value={tempFieldData?.irrigationType?.toString()}
                onChange={(e) =>
                  setTempFieldData({
                    ...tempFieldData,
                    irrigationType: e.target.value.toString(),
                  })
                }
              >
                <option value="sprinkler">{t("Sprinkler")}</option>
                <option value="drip">{t("Drip")}</option>
                <option value="flood">{t("Flood")}</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.FloatingLabel>
                {t("Required Nitrate level")}
              </Form.FloatingLabel>
              <Form.Control
                className="slider-nitrate"
                placeholder={tempFieldData?.requiredNitrate}
                type="range"
                min={0}
                max={1000}
                step={10}
                numeric
                value={tempFieldData?.requiredNitrate}
                onChange={(e) =>
                  setTempFieldData({
                    ...tempFieldData,
                    requiredNitrate: Number(e.target.value),
                  })
                }
              />
              <Form.Text className="text-muted">
                {tempFieldData?.requiredNitrate}
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              // update the field data
              updateFieldData(tempFieldData);
            }}
            className="save-button"
          >
            {t("Save")}
          </Button>
          <Button onClick={closeModal} className="cancel-button">
            {t("Cancel")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FieldModal