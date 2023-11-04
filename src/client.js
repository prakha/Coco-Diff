import React, { useEffect } from "react";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { hydrate, render } from "react-dom";
import { Provider } from "react-redux";
import { setupStore } from "./redux";
import { DeviceUUID } from "device-uuid";

import { register, unregister } from "./service-worker";

import "./firebase";
// import "../public/js/transliterate/pramukhime.js";
// import "../public/js/transliterate/pramukhindic.js";
// import "../public/js/transliterate/pramukhindic-i18n.js";

import { CookiesProvider } from "react-cookie";
import { setUserAgent } from "./services/api";

const device = new DeviceUUID().get();
const parsed = new DeviceUUID().parse();

// let device = new DeviceUUID().get()
// const parsed = new DeviceUUID().parse()
// console.log("[parsed device details]", parsed)

const deviceData = {
  platform: "web",
  unique_id: device,
  info: {
    os: parsed.os,
    browser: parsed.browser,
    isMobile: parsed.isMobile,
    source: window.location.host,
    info: parsed.source,
  },
};
console.log({ deviceData });
setUserAgent(JSON.stringify(deviceData));

const serverData = {}//window.__SERVER_DATA__;
console.log({serverData})
const store = setupStore(serverData, deviceData);
render(
  <CookiesProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </CookiesProvider>,

  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}

unregister();
