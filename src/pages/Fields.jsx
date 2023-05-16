import React,{useEffect} from 'react'
import { Button, Col, Container, Form, Image, Modal } from 'react-bootstrap'
import { Card } from 'react-bootstrap'
import '../scss/components/Fields.scss'
import { DeleteForeverOutlined, GpsFixedOutlined, PlusOneOutlined} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import FieldModal from "../components/FieldModal";
import MapModal from "../components/MapModal";
import { toast } from "react-toastify";
import globalContext from "../context/GlobalContext";
import API from "../utils/API";
import { calculateSizeToUserUnit } from "../utils/globalFunctions";

function Fields() {
  const [fields, setFields] = React.useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const { user, userFields, setUserFields } = React.useContext(globalContext);

  const emptyField = {
    name: "New Field",
    location: {
      lat: 32.123,
      lng: 34.123,
    },
    size: 0,
    cropType: "",
    cropImage: "",
    typeCultivation: "Organic",
    // today date
    seedDate: new Date().toISOString().slice(0, 10),
    harvestDate: new Date().toISOString().slice(0, 10),
    fieldType: "open-field",
    irrigationType: "",
    requiredNitrate: 0,
  };
  const [modalData, setModalData] = React.useState(null);
  const [mapModalShow, setMapModalShow] = React.useState(false);
  const [mapModalData, setMapModalData] = React.useState(null);

  React.useEffect(() => {
    if (userFields && userFields.length > 0) {
      setFields(
        userFields?.map((field) => {
          return {
            ...field,
            cropImage: field?.cropImage ? field?.cropImage : "",
          };
        })
      );
    }
  }, [userFields]);

  const { t } = useTranslation();

  const openModal = (index) => {
    // set the modal data to the selected card

    setModalData(fields[index]);
    setModalShow(true);
  };

  const closeModal = () => {
    setModalShow(false);
  };

  const openMapModal = (index) => {
    // set the modal data to the selected card
    setMapModalData({
      location: {
        lat: fields[index].location.latitude,
        lng: fields[index].location.longitude,
      },
      size: fields[index].size,
      name: fields[index].name,
    });
    setMapModalShow(true);
  };

  const closeMapModal = () => {
    setMapModalShow(false);
  };

  const deleteField = async (index) => {
    // delete the field from the database
    let newFields = fields.filter((field) => {
      return field.Fid !== fields[index].Fid;
    });
    // delete field from database
    API.delete(`/users/${user.uid}/fields/${fields[index].Fid}`)
      .then((response) => {
        // set userfields delete cropImage key from the data
        setUserFields(
          newFields.map((field) => {
            delete field.cropImage;
            return field;
          })
        );
        setFields(newFields);
      })
      .catch((error) => {
        toast.error(`Deleting field ${error}`);
      });
  };

  const addField = () => {
    // add new field to the fields array
    setModalData(emptyField);
    setModalShow(true);
  };

  const updateFieldData = async (data) => {
    // update the fields array with the new data
    // if field not exist add it to the array

    // validate data check size and requiredNitrate are bigger than 0 and cropType is not empty
    if (data.size <= 0 || data.requiredNitrate <= 0 || data.cropType === "") {
      toast.error("Please fill all the fields");
      return;
    }

    let newFields = fields;

    if (data.Fid) {
      let response = await API.put(`/users/${user.uid}/fields/${data.Fid}`, {
        ...data,
      });

      // update the field in the fields array
      if (response.status !== 200) {
        toast.error("Error updating field");
        return;
      }
      newFields = fields?.map((field) => {
        if (field.Fid === data.Fid) {
          return data;
        }
        return field;
      });
    } else {
      // create new field in the database post request
      let response = await API.post(`/users/${user.uid}/fields`, {
        ...data,
      });

      if (response.status !== 201) {
        toast.error("Error creating field");
        return;
      }
      data.Fid = response.data.Fid;

      newFields.push(data);
    }
    closeModal();
    setFields(newFields);
    // set userfields
    setUserFields(
      newFields.map((field) => {
        return field;
      })
    );
  };

  const getFieldUnits = (fieldSize) => {
    // get the field units
    let unit = localStorage.getItem("fieldUnit") || "DUNAM";
    let size = calculateSizeToUserUnit(unit, fieldSize);
    // t(unit)
    return `${size}` + " " + t(unit);
  };

  return (
    <Container className="fields-container">
      {modalData && (
        <FieldModal
          openModal={openModal}
          closeModal={closeModal}
          modalShow={modalShow}
          setModalShow={setModalShow}
          fieldData={modalData}
          updateFieldData={(field) => updateFieldData(field)}
        />
      )}

      {mapModalData && (
        <MapModal
          handleClose={closeMapModal}
          show={mapModalShow}
          showRadius={true}
          mapCenter={mapModalData?.location}
          fieldSize={mapModalData?.size}
        />
      )}

      {fields &&
        fields.map((field, index) => {
          return (
            // add delete button to each card
            <Card
              key={index}
              className="field-card"
              onClick={(e) => {
                // send the current key selected card to function
                openModal(index);
              }}
            >
              <Card.Header>
                <GpsFixedOutlined
                  onClick={(e) => {
                    // open Map in modal with the current field location
                    e.stopPropagation();
                    openMapModal(index);
                  }}
                />
                <p>{field.name}</p>
              </Card.Header>
              <Card.Body>
                <Image src={field.cropImage} roundedCircle />
              </Card.Body>
              <Card.Footer>
                <p>{getFieldUnits(field.size)}</p>
                <p>{t(field.cropType)}</p>
                <p>{t(field.cultivationType)}</p>
                <p>{t(field.irrigationType)}</p>
                <p>
                  {t("Seed Date")}: {t(field.seedDate)}
                </p>
                <p>
                  {t("Harvest date")}: {t(field.harvestDate)}
                </p>
                <p>
                  {t("Nitrate")}: {t(field.requiredNitrate)} PPM
                </p>
              </Card.Footer>
              <Card.Footer>
                {t("Delete Field")}
                <DeleteForeverOutlined
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // dialog to confirm delete
                    if (
                      window.confirm(
                        t("Are you sure you want to delete this field?")
                      )
                    ) {
                      deleteField(index);
                    }

                    // deleteField(index)
                    // find the field in the fields array and delete it from the array and from database
                  }}
                />
              </Card.Footer>
            </Card>
          );
        })}
      <Card>
        <Card.Body className="add-card">
          <div
            className="plus-button"
            onClick={(e) => {
              addField();
            }}
          >
            <div className="vertical-line"></div>
            <div className="horizontal-line"></div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Fields