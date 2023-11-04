import _ from "lodash";
import { STATUS } from "../../../App/Constants";
import { apis } from "../../../services/api/apis";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
  loginModal: false,
};

const UISlice = createSlice({
  name: "lmsConfig",
  initialState,
  reducers: {
    setLectureId: (state, action) => {
      state.lectureId = action.payload;
    },
    setPageDetailsData: (state, action) => {
      state.pageDetailsData = action.payload;
    },
    resetPageDetailsData: (state) => {
      state.pageDetailsData = null;
    },
    setLoginModalAction: (state, action) => {
      state.loginModal = action.payload || false;
    },
    setLoginModalType: (state, action) => {
      state.loginModalType = action.payload;
    },
    setOtherData :  (state, action) => {
      state.loginModalType = action.payload;
    },
    resetPdfId: (state, action) => {
      if (state.pdfId === action.payload) state.pdfId = null;
      else state.pdfId = action.payload;
    },
  },
  extraReducers: {},
});

export const {
  setLoginModalAction,
  setLoginModalType,
  setLectureId,
  setPageDetailsData,
  resetPageDetailsData,
  resetPdfId,
} = UISlice.actions;
export const UIReducer = UISlice.reducer;
