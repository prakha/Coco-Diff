import { apiClient, URIS } from ".";

// login
const loginApi = (payload) => apiClient.post(URIS.LOGIN, payload);
const verifyOtpApi = (payload) => apiClient.post(URIS.OTP_VERIFY, payload);
const requestOtpApi = (payload) => apiClient.post(URIS.OTP, payload);
const validateGoogleAccountApi = (payload) =>
  apiClient.post(URIS.GOOGLE_VALIDATE, payload);

// Coupon Login
const verifyCouponCodeApi = (payload) =>
  apiClient.post(URIS.COUPON_VERIFY, payload);

// user
const requestUserApi = (payload) =>
  apiClient.get(URIS.ME, { ...payload, student: true });
const updateUserApi = (payload) => apiClient.patch(URIS.UPDATE_USER, payload);
const addEducationApi = (payload) =>
  apiClient.post(URIS.ADD_EDUCATION, payload);
const editEducationApi = (payload) =>
  apiClient.patch(URIS.ADD_EDUCATION, payload);
const deleteEducationApi = (payload) =>
  apiClient.delete(URIS.ADD_EDUCATION, payload);
const addExperienceApi = (payload) =>
  apiClient.post(URIS.ADD_EXPERIENCE, payload);
const editExperienceApi = (payload) =>
  apiClient.patch(URIS.ADD_EXPERIENCE, payload);
const deleteExperienceApi = (payload) =>
  apiClient.delete(URIS.ADD_EXPERIENCE, payload);

// Cart
// const requestUserCartApi = (payload) =>
//   apiClient.get(URIS.GET_CART, { ...payload });
// const addToUserCartApi = (payload) =>
//   apiClient.post(URIS.ADD_TO_CART, { ...payload });

// Orders
const requestUserOrdersApi = (payload) =>
  apiClient.get(URIS.GET_ORDERS, { ...payload });

// lms
const getDefaultDataApi = (payload) =>
  apiClient.get(URIS.GET_DEFAULT_DATA, payload);

// Packages
const getPackagesApi = (payload) =>
  apiClient.get(URIS.GET_ALL_PACKAGES, payload);
const getSinglePackageApi = (payload) =>
  apiClient.get(
    payload.isAuthenticated ? URIS.PACKAGE_AUTH : URIS.PACKAGE,
    payload
  );

// Courses
const getCoursesApi = (payload) => apiClient.get(URIS.GET_ALL_COURSES, payload);

//OnlineExam
const getSingleTestDataApi = (payload) =>
  apiClient.get(URIS.GET_SINGLE_TEST_DATA, payload);
const startTestAttemptsApi = (payload) =>
  apiClient.post(URIS.START_TEST_ATTEMPT, payload);
const resumeAttemptsApi = (payload) =>
  apiClient.get(URIS.START_TEST_ATTEMPT, payload);
const actionResponseApi = (payload) =>
  apiClient.post(URIS.TEST_ACTION_RESPONSE, payload, { timeout: 145000 });

const getStudentTestAttemptsApi = (payload) =>
  apiClient.get(URIS.STUDENT_TEST_ATTEMPTS, payload);
const getSingleCoursesApi = (payload) =>
  apiClient.get(URIS.GET_SINGLE_COURSE, payload);
const getWebsiteDataApi = (payload) =>
  apiClient.get(URIS.WEBSITE_DATA, payload);
const checkoutOrderApi = (payload) =>
  apiClient.post(URIS.ORDER_CHECKOUT, payload);
const verifyOrderPaymentApi = (payload) =>
  apiClient.post(URIS.PAYMENT_VERIFY, payload);
const verifyPromoApi = (payload) => apiClient.get(URIS.VERIFY_PROMO, payload);
const getPkgContentsApi = (payload) =>
  apiClient.post(URIS.GET_PACKAGE_CONTENTS, payload);
const getTestAttemptApi = (payload) =>
  apiClient.get(URIS.GET_TEST_ATTEMPT, payload);
const uploadSheetApi = (payload) => apiClient.post(URIS.UPLOAD_SHEET, payload);
const uploadFileApi = (payload) => apiClient.post(URIS.UPLOAD_FILE, payload);
const addToWishlistApi = (payload) => apiClient.post(URIS.WISHLIST, payload);
const getWishlistApi = (payload) => apiClient.get(URIS.WISHLIST, payload);
const rmvFromWishlistApi = (payload) => apiClient.patch(URIS.WISHLIST, payload);
const addCommentApi = (payload) => apiClient.post(URIS.ADD_COMMENT, payload);
const getCommentsApi = (payload) => apiClient.get(URIS.GET_COMMENTS, payload);
const updateCommentApi = (payload) =>
  apiClient.patch(URIS.ADD_COMMENT, payload);
const addLikeApi = (payload) => apiClient.patch(URIS.ADD_LIKE, payload);
const removeCmntApi = (payload) => apiClient.delete(URIS.ADD_COMMENT, payload);
const getRepliesApi = (payload) =>
  apiClient.get(URIS.GET_COMMENT_REPLIES, payload);
const reactContentApi = (payload) =>
  apiClient.post(URIS.CONTENT_REACTION, payload);
const getContentReactionApi = (payload) =>
  apiClient.get(URIS.CONTENT_REACTION, payload);
const getLibraryApi = (payload) => apiClient.get(URIS.LIBRARY, payload);
const createLibraryApi = (payload) => apiClient.post(URIS.LIBRARY, payload);
const removeFromLibApi = (payload) =>
  apiClient.patch(URIS.REMOVE_FROM_LIBRARY, payload);
const removeFromBkmrkApi = (payload) =>
  apiClient.patch(URIS.REMOVE_FROM_BOOKMARK, payload);
const addFolderApi = (payload) => apiClient.post(URIS.ADD_FOLDER, payload);
const getFoldersApi = (payload) => apiClient.get(URIS.ADD_FOLDER, payload);
const updateFolderApi = (payload) => apiClient.patch(URIS.ADD_FOLDER, payload);
const removeFolderApi = (payload) => apiClient.delete(URIS.ADD_FOLDER, payload);
const moveFromLibraryApi = (payload) =>
  apiClient.delete(URIS.MOVE_FROM_LIBRARY, payload);
const getUserBookmarkApi = (payload) =>
  apiClient.get(URIS.USER_BOOKMARK, payload);
const addToBookmarkApi = (payload) =>
  apiClient.patch(URIS.USER_BOOKMARK, payload);
const createBookmarkApi = (payload) =>
  apiClient.post(URIS.USER_BOOKMARK, payload);
// Help and Support
const createTicketApi = (payload) =>
  apiClient.post(URIS.CREATE_TICKET, payload);
const getUserTicketsApi = (payload) =>
  apiClient.get(URIS.GET_USER_TICKET, payload);
const createLibFolderApi = (payload) =>
  apiClient.post(URIS.ADD_LIBRARY, payload);
const getLibContentApi = (payload) => apiClient.get(URIS.ADD_LIBRARY, payload);
const getUserLibraryFilesApi = (payload) =>
  apiClient.get(URIS.USER_LIBRARY_FILES, payload);
const addToLibraryApi = (payload) =>
  apiClient.post(URIS.ADD_TO_LIBRARY, payload);
const getFileApi = (payload) => apiClient.get(URIS.GET_SINGLE_FILE, payload);
const removeLibFileApi = (payload) =>
  apiClient.delete(URIS.GET_SINGLE_FILE, payload);
const moveLibFileApi = (payload) =>
  apiClient.patch(URIS.GET_SINGLE_FILE, payload);

const createBkmrkFolderApi = (payload) =>
  apiClient.post(URIS.ADD_LIBRARY, payload);
const getBkmrkContentApi = (payload) =>
  apiClient.get(URIS.ADD_LIBRARY, payload);
const getBkmrkFilesApi = (payload) =>
  apiClient.get(URIS.USER_LIBRARY_FILES, payload);
const addToBkmrkApi = (payload) => apiClient.post(URIS.ADD_TO_LIBRARY, payload);
const removeBkmrkFileApi = (payload) =>
  apiClient.delete(URIS.GET_SINGLE_FILE, payload);
const moveBkmrkFileApi = (payload) =>
  apiClient.patch(URIS.GET_SINGLE_FILE, payload);

// Wishlist
const createWishlistApi = (payload) => apiClient.post(URIS.WISHLIST, payload);

// Wallet
const requestUserWalletApi = (payload) => apiClient.get(URIS.WALLET, payload);

const getTestSyllabusApi = (payload) =>
  apiClient.get(URIS.GET_TEST_SYLLABUS, payload);

const getAssignmentAttemptsApi = (payload) =>
  apiClient.get(URIS.GET_ASSIGNMENT_ATTEMPTS, payload);

// Feedback
const requestUserFeedbackApi = (payload) =>
  apiClient.post(URIS.FEEDBACK, payload);

// Address
const updateUserAddressApi = (payload) => apiClient.post(URIS.ADDRESS, payload);
const userAddressUpdateApi = (payload) =>
  apiClient.patch(URIS.ADDRESS, payload);
const requestUserAddressApi = (payload) => apiClient.get(URIS.ADDRESS, payload);
const fetchStateCityDataApi = (payload) =>
  apiClient.get(URIS.STATE_LIST, payload);

const getForumsApi = (payload) => apiClient.get(URIS.GET_FORUMS_API, payload);
const getSingleForumApi = (payload) =>
  apiClient.get(URIS.GET_SINGLE_FORUM_API, payload);
const topicReactApi = (payload) =>
  apiClient.patch(URIS.TOPIC_REACT_API, payload);
const addNewForumApi = (payload) => apiClient.post(URIS.ADD_NEW_FORUM, payload);

const getQuestionDiscussApi = (payload) =>
  apiClient.get(URIS.GET_QUESTION_DISCUSS, payload);
const getSingleQuestionDiscussApi = (payload) =>
  apiClient.get(URIS.GET_SINGLE_QUESTION_DISCUSS, payload);
const addNewQuestionDiscussApi = (payload) =>
  apiClient.post(URIS.ADD_NEW_QUESTION_DISCUSS, payload);
const getAnswerCommentApi = (payload) =>
  apiClient.get(URIS.GET_ANSWER_COMMENT, payload);
const getCourseTrackingApi = (payload) => apiClient.get(URIS.TRACKING, payload);
const addCourseTrackingApi = (payload) =>
  apiClient.post(URIS.TRACKING, payload);
const getFolderAction = (payload) => apiClient.post(URIS.GET_FOLDER, payload);
const selectOptionApi = (payload) => apiClient.post(URIS.TOPIC_ANSWER, payload);
const getTopicAnsApi = (payload) => apiClient.get(URIS.TOPIC_ANSWERS, payload);
const getCourseSampleContent = (payload) =>
  apiClient.get(URIS.COURSE_CONTENT, payload);
const getAllNoticeApi = (payload) =>
  apiClient.get(URIS.GET_ALL_NOTICE, payload);
const getAllEventsApi = (payload) =>
  apiClient.get(URIS.GET_ALL_EVENTS, payload);
const getPublicContentApi = (payload) =>
  apiClient.get(URIS.PUBLIC_CONTENT, payload);
const getSubjContentApi = (payload) =>
  apiClient.get(URIS.SUBJECT_CONTENT, payload);
const addReviewApi = (payload) =>
  apiClient.post(URIS.ADD_PACKAGE_REVIEW, payload);
const delReviewApi = (payload) =>
  apiClient.delete(URIS.DEL_PACKAGE_REVIEW, payload);
const getReviewApi = (payload) =>
  apiClient.get(URIS.GET_PACKAGE_REVIEW, payload);
const updateUserProfileApi = (payload) =>
  apiClient.patch(URIS.UPDATE_USER_PROFILE, payload);
const resetUserPasswordApi = (payload) =>
  apiClient.patch(URIS.RESET_USER_PASSWORD, payload);
const updateAvatarApi = (payload) =>
  apiClient.post(URIS.UPDATE_AVATAR, payload);
const updateContactOTPApi = (payload) =>
  apiClient.post(URIS.UPDATE_CONTACT_OTP, payload);
const getNotificationsApi = (payload) =>
  apiClient.get(URIS.GET_NOTIFICATIONS, payload);
const updateUserDevice = (payload) => apiClient.post(URIS.USER_DEVICE, payload);
const getDashboardApi = (payload) =>
  apiClient.get(URIS.STUDENT_DASHBOARD, payload);
const logoutApi = (payload) => apiClient.post(URIS.LOGOUT);
const logoutOthers = (payload) => apiClient.post(URIS.LOGOUT_OTHERS, payload);
const testToppersApi = (payload) =>
  apiClient.get(URIS.TEST_LEADERBOARD, payload);
const assignmentToppersApi = (payload) =>
  apiClient.get(URIS.ASSIGNMENT_LEADERBOARD, payload);

const checkoutWalletOrderApi = (payload) =>
  apiClient.post(URIS.WALLET_ORDER_CHECKOUT, payload);
const walletOrdersApi = (payload) => apiClient.get(URIS.WALLET_ORDERS, payload);
const purchaseUsingWallet = (payload) =>
  apiClient.post(URIS.WALLET_PURCHASE, payload);
const addNotesApi = (payload) => apiClient.post(URIS.ADD_NOTES, payload);
const getNotesApi = (payload) => apiClient.get(URIS.GET_NOTES, payload);
const deleteNoteApi = (payload) => apiClient.delete(URIS.ADD_NOTES, payload);
const updateNoteApi = (payload) => apiClient.patch(URIS.ADD_NOTES, payload);
const getJWMediaUrl = (payload) =>
  apiClient.get(URIS.JW_VIDEO_URL_SIGNED, payload);
const getSingleTicketApi = (payload) =>
  apiClient.get(URIS.GET_SINGLE_TICKET, payload);
const unlockPackageApi = (payload) =>
  apiClient.post(URIS.UNLOCK_FREE_PACKAGE, payload);
const getReferralApi = (payload) => apiClient.get(URIS.REFERRAL, payload);
const redeemPointsApi = (payload) => apiClient.post(URIS.REDEEM, payload);
const getAllTeachersApi = (payload) =>
  apiClient.get(URIS.GET_ALL_TEACHERS, payload);
const createNewDoubt = (payload) => apiClient.post(URIS.CREATE_DOUBT, payload);
const getDoubtApi = (payload) => apiClient.get(URIS.GET_DOUBTS, payload);
const getStudentRollApi = (payload) =>
  apiClient.get(URIS.GET_STUDENT_ROLL, payload);
const deleteQueApi = (payload) =>
  apiClient.delete(URIS.DELETE_QUESTION, payload);
const updateQuestionApi = (payload) =>
  apiClient.patch(URIS.UPDATE_QUESTION, payload);
const packageReportApi = (payload) =>
  apiClient.get(URIS.GET_PACKAGE_PERFORMANCE, payload);
const getPackageDemoApi = (payload) =>
  apiClient.get(URIS.GET_PACKAGE_DEMO, payload);
const getWebsitePackageApi = (payload) =>
  apiClient.get(URIS.WEBSITE_PACKAGE_DATA, payload);
const getUserSurveyApi = (payload) =>
  apiClient.get(URIS.GET_USER_SURVEY, payload);
const startTrialApi = (payload) => apiClient.patch(URIS.START_TRIAL, payload);
const getLiveClassApi = payload => apiClient.get(URIS.GET_LIVE_CLASS, payload);
const getStaffRatingApi = payload => apiClient.get(URIS.GET_STAFF_RATING, payload);
const getStaffReviewsApi = payload => apiClient.get(URIS.GET_STAFF_REVIEW, payload);
const addStaffReviewApi = payload => apiClient.post(URIS.GET_STAFF_REVIEW, payload);
const getLectureZoomSignatureApi = payload => apiClient.get(URIS.GET_ZOOM_LECTURE_SIGNATURE, payload);

export const apis = {
  startTrialApi,
  getPackageDemoApi,
  packageReportApi,
  updateQuestionApi,
  deleteQueApi,
  getStudentRollApi,
  getDoubtApi,
  createNewDoubt,
  getAllTeachersApi,
  redeemPointsApi,
  getReferralApi,
  unlockPackageApi,
  getSingleTicketApi,
  getJWMediaUrl,
  updateNoteApi,
  deleteNoteApi,
  getNotesApi,
  addNotesApi,
  logoutApi,
  logoutOthers,
  getDashboardApi,
  addReviewApi,
  delReviewApi,
  getReviewApi,
  updateUserDevice,
  getNotificationsApi,
  getSubjContentApi,
  updateUserProfileApi,
  resetUserPasswordApi,
  updateAvatarApi,
  updateContactOTPApi,

  // User Login
  loginApi,
  requestOtpApi,
  verifyOtpApi,
  validateGoogleAccountApi,

  // Coupon Login
  verifyCouponCodeApi,

  // Cart
  // requestUserCartApi,
  // addToUserCartApi,

  // Orders
  requestUserOrdersApi,

  // User
  requestUserApi,
  updateUserApi,
  addEducationApi,
  editEducationApi,
  deleteEducationApi,
  addExperienceApi,
  editExperienceApi,
  deleteExperienceApi,

  // LMS Config
  getDefaultDataApi,

  // Packages
  getPackagesApi,

  // Courses
  getCoursesApi,

  //TestAttempt
  getSingleTestDataApi,
  startTestAttemptsApi,
  resumeAttemptsApi,
  getStudentTestAttemptsApi,
  actionResponseApi,
  getSingleCoursesApi,
  getSinglePackageApi,
  getWebsiteDataApi,
  checkoutOrderApi,
  verifyOrderPaymentApi,
  verifyPromoApi,
  getPkgContentsApi,
  getTestAttemptApi,
  uploadSheetApi,
  uploadFileApi,
  addToWishlistApi,
  getWishlistApi,
  rmvFromWishlistApi,
  addCommentApi,
  getCommentsApi,
  updateCommentApi,
  addLikeApi,
  removeCmntApi,
  getRepliesApi,
  reactContentApi,
  getContentReactionApi,
  addToLibraryApi,
  removeFromLibApi,
  addFolderApi,
  getFoldersApi,
  updateFolderApi,
  removeFolderApi,
  moveFromLibraryApi,
  getUserBookmarkApi,
  addToBookmarkApi,
  createLibraryApi,
  createBookmarkApi,
  removeFromBkmrkApi,
  addCourseTrackingApi,
  getCourseTrackingApi,
  getFolderAction,
  selectOptionApi,
  getTopicAnsApi,
  getAllNoticeApi,
  getPublicContentApi,
  // Ticket
  createTicketApi,
  getUserTicketsApi,

  // Wishlist
  createWishlistApi,
  // Wallet
  requestUserWalletApi,
  getTestSyllabusApi,
  getAssignmentAttemptsApi,
  getLibraryApi,

  // Feedback
  requestUserFeedbackApi,
  getForumsApi,
  getSingleForumApi,

  // Address
  updateUserAddressApi,
  requestUserAddressApi,
  userAddressUpdateApi,

  topicReactApi,
  addNewForumApi,
  getQuestionDiscussApi,
  getSingleQuestionDiscussApi,
  addNewQuestionDiscussApi,
  getAnswerCommentApi,
  fetchStateCityDataApi,

  //Library
  createLibFolderApi,
  getLibContentApi,
  getUserLibraryFilesApi,
  getFileApi,
  removeLibFileApi,
  moveLibFileApi,

  //Bookmark
  createBkmrkFolderApi,
  getBkmrkContentApi,
  getBkmrkFilesApi,
  addToBkmrkApi,
  removeBkmrkFileApi,

  //discussion
  moveBkmrkFileApi,
  getCourseSampleContent,

  getAllEventsApi,
  testToppersApi,
  assignmentToppersApi,
  checkoutWalletOrderApi,
  walletOrdersApi,
  purchaseUsingWallet,
  getWebsitePackageApi,
  getUserSurveyApi,
  getLiveClassApi,
  getStaffRatingApi,
  getStaffReviewsApi,
  addStaffReviewApi,
  getLectureZoomSignatureApi
};
