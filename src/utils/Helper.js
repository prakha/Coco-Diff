import _ from "lodash";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { postTrackingAction } from "../redux/tracking";

export const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);

  return minutes + "." + (seconds < 10 ? "0" : "") + seconds;
};

export const mobileView = {
  visibility: ["visible", "visible", "visible", "hidden"],
  display: ["block", "block", "block", "none"],
};

export const webView = {
  visibility: ["hidden", "hidden", "hidden", "visible"],
  display: ["none", "none", "none", "block"],
};

export const beautifyDate = (d) => {
  const months = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  };
  let date = new Date(d);
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  let day = date.getDate();
  return `${day} ${month} ${year}`;
};

export const getAllPackages = (student) => {
  if (student) {
    const packages = student.packages || [];
    let trialPackages = student.trials?.length
      ? student.trials.map((t) => ({
          _id: t._id,
          trial: t,
          expireOn: moment(t.assignedOn)
            .add(parseInt(t.duration), "day")
            .format("YYYY-MM-DD"),
          package: t.packageId,
        }))
      : [];
    trialPackages = _.filter(trialPackages, (t) =>
      moment(t.expireOn).isSameOrAfter(moment())
    );
    console.log("pp", packages, trialPackages);
    return [...packages, ...trialPackages];
  }
};

export const bilingualText = (obj) =>
  !obj
    ? ""
    : obj.en || obj.hn
    ? `${obj.en || ""}${obj.en && obj.hn ? " / " : ""}${obj.hn || ""}`
    : "";

export function secondsToStringVideoFormatted(seconds, showHours) {
  seconds = _.round(seconds, 2);
  let levels = [];
  if (showHours) {
    let hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    levels = hours ? [hours] : [];
  }

  let minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  let secs = _.round((((seconds % 31536000) % 86400) % 3600) % 60, 0);
  levels = _.concat(
    levels,
    levels.length && minutes <= 9 ? "0" + minutes : minutes,
    secs <= 9 ? "0" + secs : secs
  );

  // var returntext = '';
  // console.log('levels', levels)
  // for (var i = 0, max = levels.length; i < max; i++) {
  //     // if ( levels[i][0] === 0 ) continue;
  //     returntext += levels[i][0] + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length-1): levels[i][1]);
  // };
  return levels.join(":").trim();
}

export function secondsToMinuteSeconds(seconds) {
  return _.round(seconds / 60, 1);
}

// export function useRouteQuery() {
//   const loc = useLocation().search;
//   console.log({ loc });
//   return new URLSearchParams(loc);
// }

export const convertTime = (d) => {
  let msgDate = new Date(d);

  let today = new Date();

  var diffMs = today - msgDate;
  var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

  var diff = (today.getTime() - msgDate.getTime()) / 1000;
  let diffYear = Math.abs(Math.round(diff / (60 * 60 * 24) / 365.25));
  let diffMonth = Math.abs(Math.round(diff / (60 * 60 * 24 * 7 * 4)));
  let diffWeeks = Math.abs(Math.round(diff / (60 * 60 * 24 * 7)));
  let diffDays = Math.abs(Math.round(diff / (1000 * 60 * 60 * 24)));
  let time = null;

  if (diffYear) {
    time = diffYear + " year";
  } else if (diffMonth) {
    time = diffMonth + " month";
  } else if (diffWeeks) {
    time = diffWeeks + " week";
  } else if (diffDays) {
    time = diffDays + " day";
  } else if (diffHrs > 0) {
    time = diffHrs + " hour";
  } else if (diffMins > 0) {
    time = diffMins + " minute";
  } else time = "Just Now";

  return time;
};

export const isImage = (fileName, type) => {
  if (type) {
    if (type.startsWith("image")) {
      return true;
    }
  }
  if (
    fileName.toUpperCase().endsWith("JPG") ||
    fileName.toUpperCase().endsWith("PNG") ||
    fileName.toUpperCase().endsWith("JPEG") ||
    fileName.toUpperCase().endsWith("WEBP")
  ) {
    return true;
  } else {
    return false;
  }
};
export const isPDF = (fileName, type) => {
  if (type && type === "application/pdf") {
    return true;
  }
  if (fileName.toUpperCase().endsWith("PDF")) {
    return true;
  } else {
    return false;
  }
};

export const checkExpiry = (date) => {
  let expiryDate = moment(date);
  let currentDate = moment();
  let expired = currentDate.isAfter(expiryDate);

  if (expired) return 0;
  else {
    return moment(date).fromNow(true);
  }
};

export const checkEventStatus = (start, end) => {
  var from = start ? new Date(start) : null;
  var to = end ? new Date(end) : null;
  var dateCheck = new Date();

  return (
    (from && to && dateCheck > from && dateCheck < to) ||
    datesAreOnSameDay(from, dateCheck) ||
    datesAreOnSameDay(to, dateCheck)
  );
};

export const datesAreOnSameDay = (first, second) => {
  var moment1 = moment(first, "MM/DD/YYYY");
  var moment2 = moment(second, "MM/DD/YYYY");
  return moment1.isSame(moment2, "date");
};

export const getPackagePrice = (pkg) => {
  console.log("pkg", pkg);
  const offer =
    pkg.offers && _.size(pkg.offers)
      ? _.find(pkg.offers, (ofr) => ofr && ofr.active)
      : undefined;
  const price = offer ? offer.price : pkg.price;
  const fakePrice = offer ? offer.fakePrice : pkg.fakePrice;
  const subscription = pkg.priceMode === "sub";
  const minSubPrice = pkg.subscriptions?.length
    ? _.minBy(pkg.subscriptions, "price")
    : false;
  return { price, fakePrice, offer, subscription, minSubPrice };
};

const getMathjax = () => typeof window !== "undefined" && window.MathJax;

export const typeset = (selector) => {
  const mathjax = getMathjax();
  if (!mathjax) {
    return null;
  }
  mathjax.startup.promise = mathjax.startup.promise
    .then(() => {
      selector();
      return mathjax.typesetPromise();
    })
    .catch((e) => {
      console.log("typeset failed", e);
    });
  return mathjax.startup.promise;
};

export const unmaskKeys = (key) => {
  const vars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const replacedVars =
    "Za0b1E3FcDdAeBfC2gGhiHj4I5klJKm6On7YL8M9NopqPrsQtRuSvWXTwUxVyz";
  const varsA = [...vars];
  const replacedVarsA = [...replacedVars];
  const mapped = [...key].map((k) => {
    const index = _.findIndex(replacedVarsA, (a) => a === k);
    const value = varsA[index];
    return value;
  });
  return _.join(mapped).replace(/,/g, "");
};
