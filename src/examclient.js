import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { hydrate } from "react-dom";

import { CookiesProvider } from "react-cookie";
import {App} from './ExamApp'

const serverData = window.__SERVER_DATA__;

hydrate(
  <CookiesProvider>
      <BrowserRouter>
        <App serverData={serverData} />
      </BrowserRouter>
  </CookiesProvider>,

  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
