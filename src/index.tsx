/* global document */
import "@babel/polyfill";
import "notyf/notyf.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import Modal from "react-modal";
import { Provider } from "react-redux";
import "tippy.js/dist/tippy.css";
import "./assets/style.css";
import Game from "./components/Game";
import messages from "./messages";
import store from "./state/store";

const app = (
  <IntlProvider messages={messages} locale="en" defaultLocale="en">
    <Provider store={store}>
      <Game />
    </Provider>
  </IntlProvider>
);

const target = document.getElementById("root");

if (target) {
  Modal.setAppElement(target);
  ReactDOM.render(app, target);
}
