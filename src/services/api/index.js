import { create } from "apisauce";
import apiMonitor from "./monitor";
import { BaseURL } from "../../BaseUrl";
import { LoadingRef } from "../../App/AppProvider";

const newLocal = "/lmsConfig/default";
export const URIS = {
  WEBSITE_PACKAGE_DATA: "/website/data",
  VERSION: "/app/version",
  REFRESH: "/refresh",
  LOGOUT: "/auth/logout",
  LOGOUT_OTHERS: "/auth/logout/other",
  STATES: "/states/all",
  // Login
  LOGIN: "/auth/login",
  OTP: "/auth/otp",
  OTP_VERIFY: "/auth/verify-otp",
  // User
  ME: "/auth/me",
  GOOGLE_VALIDATE: "auth/validate/google",
  UPDATE_USER: "user/update",
  ADD_EDUCATION: "member/education",
  ADD_EXPERIENCE: "member/experience",
  // LMS Config
  GET_DEFAULT_DATA: newLocal,
  // Package
  GET_ALL_PACKAGES: "/package/active",
  PACKAGE_DETAILS: "/package",
  // Course
  GET_ALL_COURSES: "/course/institute",
  COURSE_CONTENT: "/course/course-content/public",
  // Cart
  // GET_CART: "/cart",
  // ADD_TO_CART: "/cart",
  // Orders
  GET_ORDERS: "/order",
  // Coupon Login
  COUPON_VERIFY: "/auth/coupon",
  GET_SINGLE_TEST_DATA: "/tests/paper",
  START_TEST_ATTEMPT: "/test-attempt",
  STUDENT_TEST_ATTEMPTS: "/student/test-attempts",
  TEST_ACTION_RESPONSE: "/test-attempt/response",
  GET_SINGLE_COURSE: "course/course-content",
  PACKAGE: "/package",
  PACKAGE_AUTH: "/package/auth",

  WEBSITE_DATA: "/website-content",
  ORDER_CHECKOUT: "/order/checkout",
  PAYMENT_VERIFY: "/order/verify",
  VERIFY_PROMO: "/promo/verify",
  GET_PACKAGE_CONTENTS: "/student/packages",
  GET_TEST_ATTEMPT: "/test-attempt",
  UPLOAD_SHEET: "/assignment/submit",
  UPLOAD_FILE: "/app/image",
  WISHLIST: "/wishlist",
  ADD_COMMENT: "/comment",
  //GET_COMMENTS:'/comment/user',
  GET_COMMENTS: "/comment/item",
  ADD_LIKE: "/comment/likes",
  GET_COMMENT_REPLIES: "/comment/replies",
  CONTENT_REACTION: "/content-reaction",
  LIBRARY: "/user-library",
  REMOVE_FROM_LIBRARY: "/user-library/remove",
  REMOVE_FROM_BOOKMARK: "/user-bookmarks/remove",
  ADD_LIBRARY: "/folder",
  ADD_FOLDER: "/folder",
  USER_BOOKMARK: "/user-bookmarks",
  GET_FOLDER: "/folder",
  TOPIC_ANSWER: "/topic/answer",
  TOPIC_ANSWERS: "/topic/answer/count",
  PUBLIC_CONTENT: "/course/course-content/public",
  GET_NOTIFICATIONS: "/notification/user",
  USER_DEVICE: "/user-device",
  STUDENT_DASHBOARD: "/student/dashboard",

  MOVE_FROM_LIBRARY: "/user-library/move",
  TRACKING: "/user-trackings",
  ADD_PACKAGE_REVIEW: "/package/review",
  DEL_PACKAGE_REVIEW: "/package/review",
  GET_PACKAGE_REVIEW: "/package/reviews",
  UPDATE_USER_PROFILE: "/user/profile",
  RESET_USER_PASSWORD: "user/password/reset",
  UPDATE_AVATAR: "/user/avatar",
  UPDATE_CONTACT_OTP: "/auth/otp/verify",
  // Ticket
  CREATE_TICKET: "/ticket",
  GET_USER_TICKET: "/ticket/user",

  // Address
  ADDRESS: "/address",

  // Wallet
  WALLET: "/wallet",

  GET_TEST_SYLLABUS: "/student/test/syllabus",
  GET_ASSIGNMENT_ATTEMPTS: "/assignment/submissions",
  // Feedback
  FEEDBACK: "/feedback",
  STATE_LIST: "/app/states",

  GET_FORUMS_API: "/topic/all",
  GET_SINGLE_FORUM_API: "/topic",
  TOPIC_REACT_API: "/topic/likes",
  ADD_NEW_FORUM: "/topic",

  GET_QUESTION_DISCUSS: "/topic/all",
  GET_SINGLE_QUESTION_DISCUSS: "/topic",
  ADD_NEW_QUESTION_DISCUSS: "/topic",
  GET_ANSWER_COMMENT: "/comment/item/answer",

  //library
  ADD_LIBRARY_FOLDER: "/folder",
  USER_LIBRARY_FILES: "/file/all",
  ADD_TO_LIBRARY: "/file/folder",
  GET_SINGLE_FILE: "/file",
  GET_ALL_NOTICE: "/notice/all",
  GET_ALL_EVENTS: "/events/all",
  SUBJECT_CONTENT: "/course/subject",
  TEST_LEADERBOARD: "/test-attempt/toppers",
  ASSIGNMENT_LEADERBOARD: "/assignment/toppers",
  WALLET_ORDER_CHECKOUT: "/order/checkout/wallet",
  WALLET_ORDERS: "/wallet/orders",
  WALLET_PURCHASE: "/order/checkout-wallet",
  ADD_NOTES: "/note",
  GET_NOTES: "/note/all",
  JW_VIDEO_URL_SIGNED: "/course/jw/signed",
  GET_SINGLE_TICKET: "/ticket",
  UNLOCK_FREE_PACKAGE: "/package/unlock",
  REFERRAL: "/referral",
  REDEEM: "/wallet/redeem",
  GET_ALL_TEACHERS: "/staff/all-teachers",
  CREATE_DOUBT: "/doubt",
  GET_DOUBTS: "/doubt/all",
  GET_STUDENT_ROLL: "/package/package-rolls/user",
  DELETE_QUESTION: "/topic",
  UPDATE_QUESTION: "/topic/question",
  GET_PACKAGE_PERFORMANCE: "/package/tests/report",
  GET_PACKAGE_DEMO: "/package/package-content",
  GET_STRAPI_HEADER: "/global",
  GET_USER_SURVEY: "/survey/user",
  GET_SURVEY_TOPIC: "/survey/topic/all",
  START_TRIAL: "/student/package/trial",
  GET_LIVE_CLASS: '/batch-subject-lecture',
  GET_STAFF_RATING: '/review-batch-live-staff/staff-list',
  GET_STAFF_REVIEW: '/review-batch-live-staff',
  GET_ZOOM_LECTURE_SIGNATURE: '/live-class-room/zoom'
};

let api = create({
  baseURL: BaseURL,
  headers: {
    Accept: "application/json",
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  },
  timeout: 45000,
});

api.addMonitor(apiMonitor);
// setInterceptor(api);

api.axiosInstance.interceptors.response.use(
  (response) => {
    console.log("res, interceptor", { response });
    return response;
  },
  async (error) => {
    let originalRequest = error.config;
    console.log("LOG_goterror", originalRequest, error.response);
    let isunauth = error.response && error.response.status === 401;
    if (
      isunauth &&
      !originalRequest._retry &&
      !originalRequest.headers._retry
    ) {
      console.log("LOG_status401_error", "-> refreshing now ");
      originalRequest._retry = true;
      LoadingRef.current.logoutForce();
      //get refresh token
      // const credentials = undefined // await getLoginCredentials();

      // if (credentials) {
      //   // const {refresh_token} = credentials;
      //   // // api call for access token using refresh token

      //   // return new Promise(async (resolve, reject) => {
      //   //   const response = await api.post(
      //   //     URIS.REFRESH,
      //   //     {refresh_token},
      //   //     {headers: {_retry: true}},
      //   //   );
      //   //   //store access_token and data
      //   //   if (response.ok && response.status == 200) {
      //   //     api.setHeader(
      //   //       'Authorization',
      //   //       'Bearer ' + response.data.access_token,
      //   //     );
      //   //     originalRequest.headers.Authorization =
      //   //       'Bearer ' + response.data.access_token;
      //   //     await setLoginCredentials(JSON.stringify(response.data));
      //   //     resolve(api.axiosInstance(originalRequest));
      //   //   } else {
      //   //     resetLoginCredentials().then(e => {
      //   //       store.dispatch({
      //   //         type: '@action.login.changeAppState',
      //   //         payload: APP_STATE.PUBLIC,
      //   //       });
      //   //     });
      //   //     Toast.show('You need to login again.');
      //   //     return resolve(true);
      //   //   }
      //   // });
      // } else {
      //   return Promise.resolve(error);
      // }
    } else {
      return Promise.resolve(error);
    }
  }
);

export const setAuthorizationHeader = (access_token) =>
  api.setHeader("Authorization", "Bearer " + access_token);

export const removeAuthorizationHeader = () => {
  delete api.headers["Authorization"];
};

export const setUserAgent = (info) => api.setHeader("device", info);

export { api as apiClient };

//for swr fetcher
export const getFetcher = (url, params, config) =>
  fetch(url, params, config)
    .then((response) => {
      return response.json();
    })
    .catch((er) => {
      throw er;
    });
