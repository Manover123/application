import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { store } from "./components/layout/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
