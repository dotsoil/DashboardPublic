import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GlobalProvider } from "./context/GlobalContext";
import { CookiesProvider } from "react-cookie";
import { I18nextProvider } from "react-i18next";

import i18next from "./i18n";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CookiesProvider>
    <GlobalProvider>
      {/* <React.StrictMode> */}
      <I18nextProvider i18n={i18next}>
        <App />
        {/* </React.StrictMode> */}
      </I18nextProvider>
    </GlobalProvider>
  </CookiesProvider>
);
