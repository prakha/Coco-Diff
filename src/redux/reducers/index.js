import { combineReducers } from "redux";
import { logoutAction, userReducer } from "./user";
import { lmsConfigReducer } from "./lmsConfig";
import { packageReducer } from "./packages";
import { courseReducer } from "./courses";
import { onlineExamReducer } from "./onlineExam";
import { websiteReducer } from "./website";
import { orderReducer } from "./orders";
import { testReducer } from "./test";
import { wishListReducer } from "./wishlist";
import { ticketReducer } from "./tickets";
import { walletReducer } from "./wallet";
import { libraryReducer } from "./library";
import { feedbackReducer } from "./feedback";
import { discussionReducer } from "./discussion";
import { addressReducer } from "./address";
import { doubtReducer } from "./doubt";
import { questionDiscussReducer } from "./questionDiscuss";
import { bookmarkReducer } from "./bookmarks";
import { trackingReducer } from "../tracking";
import { UIReducer } from "./UI";
import { noticeReducer } from "./notice&events";
import { settingsReducer } from "./settings";
import { notificationReducer } from "./notifications";
import { dashboardReducer } from "./dashboard";
import { notesReducer } from "./notes";
import { liveClassReducer } from "./liveClass"

const appReducer = combineReducers({
  user: userReducer,
  order: orderReducer,
  lmsConfig: lmsConfigReducer,

  // Package Reducer
  package: packageReducer,

  // Course Reduser
  course: courseReducer,
  onlineExam: onlineExamReducer,
  website: websiteReducer,
  test: testReducer,
  wishlist: wishListReducer,
  library: libraryReducer,
  bookmark: bookmarkReducer,
  tracking: trackingReducer,
  // Ticket Reducer
  ticket: ticketReducer,

  // Wallet
  wallet: walletReducer,

  // Feedback
  feedback: feedbackReducer,
  discussion: discussionReducer,

  // Address
  address: addressReducer,
  questionDiscuss: questionDiscussReducer,
  UI: UIReducer,
  notice: noticeReducer,
  notifications: notificationReducer,
  dashboard: dashboardReducer,

  //settings
  settings: settingsReducer,
  notes: notesReducer,
  doubts: doubtReducer,
  liveClass: liveClassReducer,
});

export const reducer = (state, action) => {
  if (logoutAction.match(action)) {
    console.log("match logout", action);
    // state = {
    //   package: {
    //     config: state.package.config || {},
    //     notices: state.package.notices,
    //     events: state.package.events,
    //   },
    // }

    state = {
      package: state.package,
    };
  }
  return appReducer(state, action);
};
