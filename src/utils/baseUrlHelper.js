import {
  cocotestBaseUrl,
  liveBaseUrl,
  localBaseUrl,
  testBaseUrl,
} from "../BaseUrl";

export function getBaseUrl(host) {
  console.log({ host });
  if (host === "localhost") {
    return liveBaseUrl;
  } else if (host === "public.coco.coachinglog.in") {
    return testBaseUrl;
  } else if (host === "students.stage.competitioncommunity.com") {
    return cocotestBaseUrl;
  } else if (
    host === "student.competitioncommunity.com" ||
    host === "competitioncommunity.com"
  ) {
    return liveBaseUrl;
  } else {
    return liveBaseUrl;
  }
}
