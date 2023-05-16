import React, { useContext, useEffect, useState } from "react";
import globalContext from "../context/GlobalContext";
import { Button, Row, Col } from "react-bootstrap";

import { Container, Card, Form, FormGroup, Image } from "react-bootstrap";
import { minHeight } from "@mui/system";
import { useTranslation } from "react-i18next";
import "../scss/components/Profile.scss";
import ToggleDarkMode from "../components/ToggleDarkMode";
import API from "../utils/API";
import { CameraAltTwoTone } from "@mui/icons-material";
import EditButton from "../components/EditButton";
import CountrySelector from "../components/CountrySelector";
import { SelectTimezone } from "reactjs-timezone-select";

const languageShortcutToFullName = (lng) => {
  if (lng === "en") {
    return "English";
  } else if (lng === "he") {
    return "Hebrew";
  } else if (lng === "ar") {
    return "Arabic";
  } else if (lng === "ru") {
    return "Russian";
  } else if (lng === "es") {
    return "Spanish";
  } else if (lng === "fr") {
    return "French";
  } else if (lng === "de") {
    return "German";
  } else if (lng === "it") {
    return "Italian";
  } else if (lng === "ja") {
    return "Japanese";
  } else if (lng === "ko") {
    return "Korean";
  } else if (lng === "pt") {
    return "Portuguese";
  } else {
    return "English";
  }
};
// show profile of the user with the data from the context and edit the profile option
const Profile = ({}) => {
  const { t, i18n } = useTranslation();
  const [uploadImage, setUploadImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicKey, setProfilePicKey] = useState(0);
  const [timezone, setTimezone] = useState(
    localStorage.getItem("timezone") || "Asia/Jerusalem"
  );

  const {
    user,
    setUser,
    usersList,
    userFields,
    setUserFields,
    userSensors,
    setUserSensors,
    setSelectedField,
    selectedField,
    setSelectedSensor,
    selectedSensor,
    toggleTheme,
    theme,
  } = useContext(globalContext);
  const [editProfile, setEditProfile] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language")
      ? languageShortcutToFullName(localStorage.getItem("language"))
      : "English"
  );
  const handleTimezone = ({ label, value }) => {
    console.log(label, value);
    localStorage.setItem("timezone", value);
    setTimezone(value);
  };

  useEffect(() => {
    if (uploadImage) {
      setIsLoading(true);
      setUser({ ...user, pictureUrl: null });
      const formData = new FormData();
      formData.append("image", uploadImage);
      API.post("/users/uploadProfileImg", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          console.log(res.status);
          setIsLoading(false);
          if (res.status === 201) {
            setUser({ ...user, pictureUrl: res.data.response });
            setProfilePicKey((prevKey) => prevKey + 1);
            // refresh page
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
    return () => {};
  }, [uploadImage]);

  const [temperatureUnit, setTemperatureUnit] = useState(
    localStorage.getItem("temperatureUnit") || "Celsius"
  );

  const [fieldUnit, setFieldUnit] = useState(
    localStorage.getItem("fieldUnit") || "DUNAM"
  );

  const [userTemp, setUserTemp] = useState(user);

  const handleTemperatureUnit = (value) => {
    localStorage.setItem("temperatureUnit", value);
    setTemperatureUnit(value);
  };

  const handleChangeLanguage = (lng) => {
    if (lng === "English") {
      localStorage.setItem("language", "en");
      setLanguage("English");
      i18n.changeLanguage("en");
    } else if (lng === "Hebrew") {
      localStorage.setItem("language", "he");
      setLanguage("Hebrew");
      i18n.changeLanguage("he");
    } else if (lng === "Arabic") {
      localStorage.setItem("language", "ar");
      setLanguage("Arabic");
      i18n.changeLanguage("ar");
    } else if (lng === "Russian") {
      localStorage.setItem("language", "ru");
      setLanguage("Russian");
      i18n.changeLanguage("ru");
    } else if (lng === "Spanish") {
      localStorage.setItem("language", "es");
      setLanguage("Spanish");
      i18n.changeLanguage("es");
    } else if (lng === "French") {
      localStorage.setItem("language", "fr");
      setLanguage("French");
      i18n.changeLanguage("fr");
    } else if (lng === "German") {
      localStorage.setItem("language", "de");
      setLanguage("German");
      i18n.changeLanguage("de");
    } else if (lng === "Italian") {
      localStorage.setItem("language", "it");
      setLanguage("Italian");
      i18n.changeLanguage("it");
    } else if (lng === "Japanese") {
      localStorage.setItem("language", "ja");
      setLanguage("Japanese");
      i18n.changeLanguage("ja");
    } else if (lng === "Korean") {
      localStorage.setItem("language", "ko");
      setLanguage("Korean");
      i18n.changeLanguage("ko");
    } else if (lng === "Portuguese") {
      localStorage.setItem("language", "pt");
      setLanguage("Portuguese");
      i18n.changeLanguage("pt");
    } else {
      i18n.changeLanguage("en");
      localStorage.setItem("language", "en");
      setLanguage("English");
    }
  };

  const handleFieldUnit = (value) => {
    localStorage.setItem("fieldUnit", value);
    setFieldUnit(value);
  };

  useEffect(() => {
    if (userSensors && userSensors.length > 0) {
      setSelectedSensor(userSensors[0]);
      localStorage.setItem("defaultSensorId", userSensors[0].Sid);
    } else {
      setSelectedSensor(null);
      localStorage.setItem("defaultSensorId", null);
    }

    return () => {};
  }, [userSensors]);

  useEffect(() => {
    if (userFields && userFields.length > 0) {
      setSelectedField(
        userFields.find(
          (field) => field.Fid === localStorage.getItem("defaultFieldId")
        )
      );
    }

    return () => {};
  }, [userFields]);

  useEffect(() => {
    const fileInput = document.getElementById("profile-image");
    fileInput.addEventListener("change", (e) => {
      setUploadImage(e.target.files[0]);
    });

    return () => {};
  }, []);

  const handleEditProfilePicture = () => {
    const fileInput = document.getElementById("profile-image");
    fileInput.click();
  };

  const updateUserProfile = () => {
    setIsLoading(true);
    API.put("/users/updateProfile", userTemp)
      .then((res) => {
        console.log(res.status);
        setIsLoading(false);
        if (res.status === 200) {
          setEditProfile(false);
          setUser({ ...user, ...userTemp });
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <Container className="profile-container">
      {/* <Container className="gradient"></Container> */}
      {/* Profile Image and name */}
      <Row className="profile-info">
        <ToggleDarkMode toggleTheme={toggleTheme} theme={theme} />
        <Col>
          <Card>
            <Card.Body
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <CameraAltTwoTone
                onClick={handleEditProfilePicture}
                className="camera-icon"
              />
              <Image
                src={user?.pictureUrl || ""}
                alt="profile image"
                roundedCircle
                key={profilePicKey}
                style={{ width: "100px", height: "100px" }}
              />
              <input
                type="file"
                id="profile-image"
                accept="image/*"
                style={{ display: "none" }}
              />

              <Container
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span>{user?.Fname}</span>
                <span>{user?.email}</span>
                <span>{user?.phone}</span>
                <span>{user?.country}</span>
                <span>{user?.cityState}</span>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* User Profile */}
      <Row>
        <Col>
          <Card>
            <Card.Title>{t("User Profile")}</Card.Title>
            <Card.Body>
              {/* show 3 colum 2 for data and 1 for edit button */}
              <Form>
                <Row>
                  <Col>
                    <FormGroup>
                      <Form.Label>{t("Full Name")}</Form.Label>
                      <Form.Control
                        disabled={!editProfile}
                        type="text"
                        placeholder={user?.Fname}
                        value={userTemp?.Fname}
                        onChange={(e) =>
                          setUserTemp({ ...userTemp, Fname: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Form.Label>{t("Email")}</Form.Label>
                      <Form.Control
                        disabled={!editProfile}
                        type="email"
                        placeholder={user?.email}
                        value={userTemp?.email}
                        onChange={(e) =>
                          setUserTemp({ ...userTemp, email: e.target.value })
                        }
                      />
                      <Form.Text className="text-muted">
                        {t("We'll never share your email with anyone else.")}
                      </Form.Text>
                    </FormGroup>
                    <FormGroup>
                      <Form.Label>{t("Phone Number")}</Form.Label>
                      <Form.Control
                        disabled={!editProfile}
                        type="text"
                        placeholder={user?.phone || "0000000000"}
                        value={userTemp?.phone}
                        onChange={(e) =>
                          setUserTemp({ ...userTemp, phone: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    {/* country */}
                    <FormGroup>
                      <Form.Label>{t("Country")}</Form.Label>
                      <CountrySelector
                        isDisabled={!editProfile}
                        country={userTemp?.country}
                        onChange={(e) =>
                          setUserTemp({ ...userTemp, country: e })
                        }
                      />
                    </FormGroup>
                    {/* postal code */}
                    <FormGroup>
                      <Form.Label>{t("Postal Code")}</Form.Label>
                      <Form.Control
                        disabled={!editProfile}
                        type="text"
                        placeholder={user?.postalCode || "00000"}
                        value={userTemp?.postalCode}
                        onChange={(e) =>
                          setUserTemp({
                            ...userTemp,
                            postalCode: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                    {/* city/state */}
                    <FormGroup>
                      <Form.Label>{t("City") + " / " + t("State")}</Form.Label>
                      <Form.Control
                        disabled={!editProfile}
                        type="text"
                        placeholder={user?.cityState || "City/State"}
                        value={userTemp?.cityState}
                        onChange={(e) =>
                          setUserTemp({
                            ...userTemp,
                            cityState: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <EditButton
                      text={editProfile ? t("Save") : t("Edit")}
                      onClick={() => {
                        setEditProfile(!editProfile);
                        if (editProfile) {
                          // save changes
                          updateUserProfile();
                        }
                      }}
                    />
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Title>{t("System Settings")}</Card.Title>
            <Card.Body>
              <Form>
                <Row>
                  <Col>
                    <FormGroup>
                      <Form.Label>{t("Language")}</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => handleChangeLanguage(e.target.value)}
                        value={language}
                      >
                        <option>English</option>
                        <option>Hebrew</option>
                        <option>Arabic</option>
                        <option>Russian</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </Form.Control>
                    </FormGroup>
                    <FormGroup>
                      <Form.Label>Time Zone</Form.Label>
                      <SelectTimezone
                        name="timezone"
                        value={timezone}
                        onChange={(e) => handleTimezone(e)}
                        optionLabelFormat={(timezone) =>
                          `${timezone.name} - ${timezone.abbreviation}`
                        }
                        defaultToSystemTimezone
                      />
                    </FormGroup>

                    <FormGroup>
                      <Form.Label>Time Format</Form.Label>
                      <Form.Control as="select" disabled={true}>
                        <option>24 Hours</option>
                        <option>12 Hours</option>
                      </Form.Control>
                    </FormGroup>

                    <FormGroup>
                      <Form.Label>Date Format</Form.Label>
                      <Form.Control disabled={true} as="select">
                        <option>YYYY-MM-DD</option>
                        <option>MM-DD-YYYY</option>
                        <option>DD-MM-YYYY</option>
                      </Form.Control>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Form.Label>Temperature Unit</Form.Label>
                      <Form.Control
                        as="select"
                        value={temperatureUnit}
                        onChange={(e) => {
                          handleTemperatureUnit(e.target.value);
                        }}
                      >
                        <option>Celsius</option>
                        <option>Fahrenheit</option>
                      </Form.Control>
                    </FormGroup>
                    <FormGroup>
                      <Form.Label>{t("Field Unit")}</Form.Label>
                      <Form.Control
                        as="select"
                        value={fieldUnit}
                        onChange={(e) => {
                          handleFieldUnit(e.target.value);
                        }}
                      >
                        <option>DUNAM</option>
                        <option>HECTARE</option>
                        <option>ACRE</option>
                      </Form.Control>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* System Settings */}
      <Row>
        <Col>
          <Card>
            <Card.Title>Default Field & Sensor</Card.Title>
            <Card.Body>
              <Form>
                <Row>
                  <Col>
                    {userFields && userFields.length > 0 && (
                      <FormGroup>
                        <Form.Label>Default Field</Form.Label>
                        <Form.Control
                          as="select"
                          value={selectedField?.Fid}
                          onChange={(e) => {
                            setSelectedField(
                              userFields.find(
                                (field) => field.Fid === e.target.value
                              )
                            );
                            localStorage.setItem(
                              "defaultFieldId",
                              e.target.value
                            );
                          }}
                        >
                          {userFields &&
                            userFields.length > 0 &&
                            userFields.map((field) => (
                              <option key={field.Fid} value={field.Fid}>
                                {field.name}
                              </option>
                            ))}
                        </Form.Control>
                      </FormGroup>
                    )}
                    {userSensors && userSensors.length > 0 && (
                      <FormGroup>
                        <Form.Label>Default Sensor</Form.Label>
                        <Form.Control
                          value={selectedSensor?.Sid}
                          as="select"
                          onChange={(e) => {
                            setSelectedSensor(
                              userSensors.find(
                                (sensor) => sensor.Sid === e.target.value
                              )
                            );
                            localStorage.setItem(
                              "defaultSensorId",
                              e.target.value
                            );
                          }}
                        >
                          {userSensors &&
                            userSensors.length > 0 &&
                            userSensors.map((sensor) => (
                              <option key={sensor.Sid} value={sensor.Sid}>
                                {sensor.Sid}
                              </option>
                            ))}
                        </Form.Control>
                      </FormGroup>
                    )}
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
