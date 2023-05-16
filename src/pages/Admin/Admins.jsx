
import React from 'react'

const Admins = () => {
  return (
    <div>Admins</div>
  )
}

export default Admins

// "use strict";

// import React, { useEffect, useContext, useState } from "react";
// import "@aws-amplify/ui-react/styles.css";
// import API from "../../utils/API";
// import globalContext from "../../context/GlobalContext";
// import { useNavigate } from "react-router-dom";
// import { Container, Form, Row, Col, Card, Image } from "react-bootstrap";
// import GoogleMapReact from "google-map-react";
// import Marker from "../../components/Marker";
// import SensorController from "./SensorController";
// import { Amplify, PubSub, Auth } from "aws-amplify";
// import { AWSIoTProvider } from "@aws-amplify/pubsub";
// import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
// import awsconfig from "../../aws-exports";
// import { CONNECTION_STATE_CHANGE, ConnectionState } from '@aws-amplify/pubsub';
// import SensorMap from "../../components/SensorMap";
// import { Hub } from 'aws-amplify';
// import Loader from "../../components/Loader";

// // Amplify.Logger.LOG_LEVEL = "DEBUG";

// Amplify.configure(awsconfig);

// Amplify.addPluggable(
//   new AWSIoTProvider({
//     aws_pubsub_region: awsconfig.aws_cognito_region,
//     aws_pubsub_endpoint: `wss://${import.meta.env.VITE_MQTT_ENDPOINT}/mqtt`,
//   })
// );


// function Admins() {
//   const { user, isAdmin, Credentials, setCredentials } =
//     useContext(globalContext);
//   const [users, setUsersList] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedField, setSelectedField] = useState(null);
//   const [selectedSensor, setSelectedSensor] = useState(null);
//   const [userFields, setUserFields] = useState([]);
//   const [userSensors, setUserSensors] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showSensorController, setShowSensorControl] = useState(false);
//   const [mapCenter, setMapCenter] = useState({
//     lat: 31.771959,
//     lng: 35.217018,
//   });
//   const [mapZoom, setMapZoom] = useState(12);

//   const navigate = useNavigate();

//   const SignOut = () => {
//     Auth.signOut();
//   };

//   useEffect(() => {
//     Hub.listen("pubsub", (data) => {
//       const { payload } = data;
//       if (payload.event === CONNECTION_STATE_CHANGE) {
//         const connectionState = payload.data.connectionState;
//       }
//     });
//     API.get("users")
//       .then((responseUsers) => {
//         setUsersList(responseUsers.data);

//         setSelectedUser(responseUsers.data.filter((u) => u.ID === user.uid)[0]);
//         setIsLoading(false);
//         Auth.currentCredentials().then((credentials) => {
//           const cognitoIdentityId = credentials.identityId;

//           setCredentials(credentials);
//         });
//       })
//       .catch((err) => {
//         navigate("/");
//       });
//   }, []);

//   const getUserFields = async () => {
//     const responseFields = await API.get(
//       `users/${selectedUser?.ID}/fields`
//     ).catch((err) => {
//       console.error(err);
//     });
//     if (responseFields.data.status === 404) {
//       return;
//     }

//     setSelectedField(responseFields.data[0]);
//     setUserFields(responseFields.data);
//   };

//   const getUserSensors = async () => {
//     const responseSensors = await API.get(
//       `/users/${selectedUser?.ID}/fields/${selectedField?.Fid}/sensors`
//     ).catch((err) => {
//       console.error(err);
//     });
//     if (responseSensors.data.status === 404) {
//       return;
//     }
//     setSelectedSensor(responseSensors.data[0]);
//     setUserSensors(responseSensors.data);
//   };

//   useEffect(() => {
//     setUserFields([]);
//     setUserSensors([]);
//     setSelectedField(null);
//     setSelectedSensor(null);
//     getUserFields();

//     return () => {};
//   }, [selectedUser]);

//   useEffect(() => {
//     getUserSensors();
//     setMapCenter({
//       lat: selectedField?.location?.latitude || 31.771959,
//       lng: selectedField?.location?.longitude || 35.217018,
//     });
//     setMapZoom(12);
//     return () => {};
//   }, [selectedField]);

//   const onMapMove = ({ center, zoom }) => {
//     setMapCenter(center);
//     setMapZoom(zoom);
//   };

//   if (isLoading) {
//     return (
//       <div style={styles.Loader}>
//         <Loader size={100} />
//       </div>
//     );
//   }
//   return (
//     <Authenticator
//       hideSignUp={true}
//       socialProviders={["amazon", "apple", "facebook", "google"]}
//       loginMechanisms={["email", "phone_number"]}
//     >
//       <Container style={styles.container}>
//         {/* select user from users list */}
//         <Row>
//           <Col xs={5}>
//             <Form>
//               <Form.Group>
//                 <Form.Label>Select User</Form.Label>
//                 <Form.Control
//                   as="select"
//                   custom
//                   value={JSON.stringify(selectedUser)}
//                   onChange={(e) => setSelectedUser(JSON.parse(e.target.value))}
//                 >
//                   {users.map((user) => (
//                     <option key={user.ID} value={JSON.stringify(user)}>
//                       {user?.Fname || `${user.name} ${user.lname}`}
//                     </option>
//                   ))}
//                 </Form.Control>
//               </Form.Group>
//             </Form>
//           </Col>
//         </Row>
//         {/* user info in rounded card with rounded image */}
//         <Row>
//           <Col xs={10} sm={10} md={10} xl={10}>
//             <Card style={styles.card}>
//               <Card.Title style={styles.cardBody}>
//                 <Image
//                   style={styles.cardImage}
//                   src={selectedUser?.pictureUrl}
//                   roundedCircle
//                 />
//                 <Card.Title>
//                   {selectedUser?.Fname ||
//                     `${selectedUser?.name} ${selectedUser?.lname}`}
//                 </Card.Title>
//                 {selectedUser?.email && (
//                   <Card.Text>{selectedUser?.email}</Card.Text>
//                 )}
//                 {selectedUser?.phoneNumber ||
//                   (selectedUser?.phone && (
//                     <Card.Text>
//                       <a
//                         href={`tel:${
//                           selectedUser?.phoneNumber || selectedUser?.phone
//                         }`}
//                       >
//                         Call {selectedUser?.Fname || selectedUser?.name}
//                       </a>
//                     </Card.Text>
//                   ))}
//                 {selectedUser?.ID && (
//                   <Card.Text>User ID: {selectedUser?.ID}</Card.Text>
//                 )}
//               </Card.Title>
//               <Card.Body style={styles.cardBody}>
//                 <Form style={styles.formCard}>
//                   {userFields && userFields.length === 0 ? (
//                     <Card.Text>No Fields</Card.Text>
//                   ) : (
//                     <Form.Group>
//                       <Form.Label>Select Field</Form.Label>
//                       <Form.Control
//                         as="select"
//                         custom
//                         onChange={(e) =>
//                           setSelectedField(JSON.parse(e.target.value))
//                         }
//                       >
//                         {userFields &&
//                           userFields?.map((field) => (
//                             <option
//                               key={field?.Fid}
//                               value={JSON.stringify(field)}
//                             >
//                               {field?.name}
//                             </option>
//                           ))}
//                       </Form.Control>
//                       <Form.Text className="text-muted">
//                         {/* Get Address name from reverse geocoding */}
//                       </Form.Text>
//                     </Form.Group>
//                   )}
//                 </Form>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//         <Row>
//           <Col xs={10} sm={10} md={10}>
//             {selectedField && (
//               <Card style={styles.cardMap}>
//                 <Col>
//                   <Card.Title style={styles.cardBody}>
//                     <Card.Text>{selectedField?.name}</Card.Text>
//                     <div
//                       style={{
//                         height: "50vh",
//                         width: "100%",
//                       }}
//                     >
//                       <SensorMap
//                         userSensors={userSensors}
//                         mapCenter={mapCenter}
//                         mapZoom={mapZoom}
//                         onMapMove={onMapMove}
//                         setSelectedSensor={setSelectedSensor}
//                         setShowSensorControl={setShowSensorControl}
//                       />
//                     </div>
//                   </Card.Title>
//                 </Col>
//                 <Col>
//                   <Card.Body style={styles.cardBody}>
//                     {selectedField?.Fid && (
//                       <Card.Text>Field ID:{selectedField?.Fid}</Card.Text>
//                     )}
//                     {selectedField?.fieldType && (
//                       <Card.Text>
//                         Field Type: {selectedField?.fieldType}
//                       </Card.Text>
//                     )}
//                     {selectedField?.size !== undefined && (
//                       <Card.Text>
//                         Field Size: {selectedField?.size} acres
//                       </Card.Text>
//                     )}
//                     {selectedField?.typeCultivation && (
//                       <Card.Text>
//                         Type of Cultivation: {selectedField?.typeCultivation}
//                       </Card.Text>
//                     )}
//                     {selectedField?.irrigationType && (
//                       <Card.Text>
//                         Irrigation Type: {selectedField?.irrigationType}
//                       </Card.Text>
//                     )}
//                     {selectedField?.seedDate && (
//                       <Card.Text>
//                         Seed Date: {selectedField?.seedDate}
//                       </Card.Text>
//                     )}
//                     {selectedField?.harvestDate && (
//                       <Card.Text>
//                         Harvest Date: {selectedField?.harvestDate}
//                       </Card.Text>
//                     )}
//                   </Card.Body>
//                 </Col>
//               </Card>
//             )}
//           </Col>
//         </Row>
//         {showSensorController && (
//           <SensorController
//             show={showSensorController}
//             onHide={() => setShowSensorControl(false)}
//             Sensor={selectedSensor}
//           />
//         )}
//       </Container>
//     </Authenticator>
//   );
// }

// const styles = {
//   Loader: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     height: "100%",
//   },
//   container: {},
//   card: {
//     // borderRadius: "20px",
//     // display: "flex",
//     // flexDirection: "row",
//     // alignItems: "center",
//     // marginTop: "20px",
//     // backgroundColor: "#323541",
//   },
//   cardBody: {
//     // display: "flex",
//     // margin: "20px",
//     // flexDirection: "column",
//     // alignItems: "center",
//     // alignContent: "center",
//   },
//   cardImage: {
//     width: "10rem",
//     height: "10rem",
//   },
//   formCard: {
//     width: window.innerWidth > 768 ? "50%" : "100%",
//   },
//   cardMap: {
//     // borderRadius: "20px",
//     // display: "flex",
//     flexDirection: window.innerWidth > 768 ? "row" : "column",
//     // // alignItems: "center",
//     // marginTop: "20px",
//     // backgroundColor: "#323541",
//   },
// };

// export default withAuthenticator(Admins, true);