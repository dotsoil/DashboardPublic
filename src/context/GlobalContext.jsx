import React, { createContext, useEffect } from "react";
const globalContext = React.createContext();

export function GlobalProvider({ children }) {
  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);
  const [user, setUserParam] = React.useState(null);
  const [userFields, setUserFields] = React.useState([]);
  const [userSensors, setUserSensors] = React.useState([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [Credentials, setCredentials] = React.useState(null);
  const [selectedField, setSelectedField] = React.useState(null);
  const [selectedSensor, setSelectedSensor] = React.useState(null);
  const [usersList, setUsersList] = React.useState([]);
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  const setUser = (user) => {
    // update the user object
    console.log("setUser", user);
    setUserParam(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
  };

  const [notificationPermission, setNotificationPermission] =
    React.useState(false);

  useEffect(() => {
    const isSupported = () =>
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;
    if (isSupported()) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationPermission(true);
        }
      });
    }

    return () => {};
  }, []);

  return (
    <globalContext.Provider
      value={{
        theme,
        toggleTheme,
        isUserLoggedIn,
        setIsUserLoggedIn,
        usersList,
        setUsersList,
        user,
        setUser,
        setIsAdmin,
        isAdmin,
        notificationPermission,
        setNotificationPermission,
        Credentials,
        setCredentials,
        userFields,
        setUserFields,
        userSensors,
        setUserSensors,
        selectedField,
        setSelectedField,
        selectedSensor,
        setSelectedSensor,
      }}
    >
      {children}
    </globalContext.Provider>
  );
}

export default globalContext;
