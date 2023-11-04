import { configureStore } from "@reduxjs/toolkit"
import { isSSR } from "../utils/ssrHelper"
import { reducer } from "./reducers"
import { DeviceUUID } from 'device-uuid'
import { apis } from "../services/api/apis"
import { setUserAgent } from "../services/api"

export function setupStore(data) {

  const store = configureStore({
    reducer,
    devTools: true,
    preloadedState: data
  })
  
  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./reducers", () => store.replaceReducer(reducer))
  }
  return store
}

export const ssrStore = configureStore({
  reducer,
  devTools: true,
})