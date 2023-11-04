import { useQueryParams } from "./utils/useQueryParams"

const { useEffect } = require("react")
const { useLocation, Redirect } = require("react-router-dom")

export const useRouteAdapter = () => {
    const location = useLocation()

    console.log("location", location)
    
    useEffect(() => {
      console.log("location check adapter", location.pathname, location.search)
      if(location.search?.startsWith("?dr=") || (location.pathname !== "/survey" &&  location.search?.startsWith("?survey="))){
        window.open("/extra.html"+location.search, "_parent")
      }
      if (location.pathname.startsWith("/exam/start")) {
        window.open("/exam.html" + location.search, "_parent")
      }else if (location.pathname.startsWith("/exam/report/analysis")) {
        window.open("/exam.html" + location.search + "&path=exam-report-analysis", "_parent")
      }else if (location.pathname.startsWith("/exam/report")) {
        window.open("/exam.html" + location.search + "&path=exam-report", "_parent")
      }
    }, [])
  }
  