import React, { useEffect, useContext } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Analyze from "./pages/Analyze";
import Sidebar from "./components/Sidebar";
import Admins from "./pages/Admin/Admins";
import LoginPage from "./pages/LoginPage";
import NewField from "./pages/Fields";
import "./scss/Styles.scss";
import API from "./utils/API";
import globalContext from "./context/GlobalContext";
import Map from "./pages/Map";
import Profile from "./pages/Profile";
import MainDashboard from "./pages/MainDashboard";
import Fertilizer from "./pages/Fertilizer";
import { ToastContainer, toast } from "react-toastify";
import Loader from "./components/Loader";
import { useTranslation } from "react-i18next";
import Fields from "./pages/Fields";
import ErrorBoundary from "./utils/ErrorBoundary";
import Sensors from "./pages/Sensors";

function App() {
  const { i18n } = useTranslation();

  const [hideSidebar, setHideSidebar] = React.useState(true);

  const [isLoading, setIsLoading] = React.useState(true);
  const {
    theme,
    toggleTheme,
    usersList,
    setUsersList,
    setNotificationPermission,
    isAdmin,
    setIsAdmin,
    notificationPermission,
    user,
    setUser,
    userFields,
    setUserFields,
    userSensors,
    setUserSensors,
    selectedField,
    setSelectedField,
    selectedSensor,
    setSelectedSensor,
    defaultField,
    setDefaultField,
    defaultSensor,
    setDefaultSensor,
    isUserLoggedIn,
    setIsUserLoggedIn,
  } = useContext(globalContext);

  const logOut = () => {
    setIsUserLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    if (isAdmin) Auth.signOut();
  };

  const RefreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      const response = await API.post("/refresh-token", { refreshToken });
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsUserLoggedIn(false);
      }
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsUserLoggedIn(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    // TODO: Get Notification premissions from user
    if (token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const { exp } = JSON.parse(jsonPayload);
      if (exp > Date.now() / 1000) {
        setIsUserLoggedIn(true);
        setUser(JSON.parse(localStorage.getItem("user")));
      } else {
        // token expired get new token with refresh token
        RefreshToken();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    API.get(`users`)
      .then((response) => {
        if (!response.error) {
          setUsersList(response.data);
          setIsAdmin(true);
        }
      })
      .catch((err) => {
        setIsAdmin(false);
        return;
      });
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [isUserLoggedIn]);

  // set default language from local storage
  useEffect(() => {
    const lang = localStorage.getItem("language");
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, []);

  useEffect(() => {
    const fetchUsersFields = async () => {
      API.get(`/users/${user?.uid}/fields`)
        .then((response) => {
          const data = response.data;
          if (data.status)
          {
            toast.error(data.message);
            return;
          }
            setUserFields(data);
            let defaultFieldId = localStorage.getItem("defaultFieldId");
            setSelectedField(
              data.find((field) => field.Fid === defaultFieldId) || data[0]
            );
        }
        )
        .catch((err) => {});
    };

    if (user) fetchUsersFields();
  }, [user]);

  useEffect(() => {
    const fetchFieldSensors = async () => {
      API.get(`users/${user.uid}/fields/${selectedField?.Fid}/sensors`)
        .then((response) => {
          const data = response.data;
          setUserSensors(data);
          setSelectedSensor(
            data.find((sensor) => sensor.Sid === defaultSensor) || data[0]
          );
        })
        .catch((err) => {});
    };
    fetchFieldSensors;

    if (selectedField) fetchFieldSensors();
  }, [selectedField]);

  if (isLoading) {
    // loading div with is spinner and status indicator
    return (
      <div style={styles.loading}>
        <Loader size={100} />
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <BrowserRouter
        getUserConfirmation={(message, callback) => {
          const allowTransition = window.confirm(message);
          callback(allowTransition);
        }}
      >
        <div className={`dashboard ${theme}`}>
          <Sidebar
            hidden={!isUserLoggedIn}
            logOut={logOut}
            isAdmin={isAdmin}
            toggleTheme={toggleTheme}
            theme={theme}
          />
          <div className="metrics" style={styles.dashboard}>
            <ErrorBoundary>
              <Routes>
                {isUserLoggedIn ? (
                  <>
                    {isAdmin ? (
                      <>
                        <Route path="/admins" element={<Admins />} />
                      </>
                    ) : (
                      <Route
                        path="/Map"
                        element={
                          <Sensors />
                        }
                      />
                    )}
                    <Route
                      path="/analyze/:selectedDate?/:defaultFieldId?/:defaultSensorId?"
                      element={<Analyze />}
                    />
                    <Route path="/fertilizer" element={<Fertilizer />} />
                    <Route
                      path="/profile"
                      element={<Profile theme={theme} />}
                    />
                    <Route path="/home" element={<MainDashboard />} />
                    <Route path="/fields" element={<Fields />} />
                    <Route path="/*" element={<MainDashboard />} />
                  </>
                ) : (
                  <Route
                    path="/*"
                    element={
                      <LoginPage />
                    }
                  />
                )}
              </Routes>
            </ErrorBoundary>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

const styles = {
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  spinner: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
    width: "100px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  },
  status: {
    marginTop: "10px",
    fontSize: "1.2rem",
    color: "#333",
  },
};

export default App;
