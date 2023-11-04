import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { hydrate } from "react-dom";
import { CookiesProvider } from "react-cookie";
import { ExtraApp } from "./extra_routes";


hydrate(
  <CookiesProvider>
    <BrowserRouter>
     <ExtraApp/>
    </BrowserRouter>
  </CookiesProvider>,

  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
