import { getBaseUrl } from "./utils/baseUrlHelper";

// export const localBaseUrl = "http://192.168.1.47:4000/"
export const localBaseUrl = "http://localhost:4001/";
export const testBaseUrl = "https://api.coco.coachinglog.in/";
export const cocotestBaseUrl = "https://api.stage.competitioncommunity.com/";
export const liveBaseUrl = "https://api.competitioncommunity.com/";
export const strApiBaseUrl = "https://strapi.competitioncommunity.com/api";
export const cocoWebisteUrl = "https://competitioncommunity.com";
// export const cocoWebisteUrl = "http://localhost:3322";

const isclient = typeof window !== "undefined";
if (isclient) {
  console.log("[loc]", window.location);
}
//export const BaseURL = isclient
  //? getBaseUrl(window.location?.hostname)
 // : cocotestBaseUrl;
export const BaseURL = isclient
  ? getBaseUrl(window.location?.hostname)
  : cocotestBaseUrl;