import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { STATUS } from "../../../App/Constants"
import { apis } from "../../../services/api/apis"

export const getAllNoticeAction = createAsyncThunk(
  "notices/get",
  async (payload, thunkAPI) => {
    const response = await apis.getAllNoticeApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getAllEventsAction = createAsyncThunk(
  "events/get",
  async (payload, thunkAPI) => {
    const response = await apis.getAllEventsApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

const initialState = {noticeList:[]}

const noticeSlice = createSlice({
  name: "notice",
  initialState,
  reducers: {

  },
  extraReducers: {
    [getAllNoticeAction.pending]: (state) => {
        state.getAllNoticeStatus = STATUS.FETCHING
    },
    [getAllNoticeAction.rejected]: (state) => {
        state.getAllNoticeStatus = STATUS.FAILED
    },
    [getAllNoticeAction.fulfilled]: (state, action) => {
        state.getAllNoticeStatus = STATUS.SUCCESS
        state.noticeList = action.payload
    },

    [getAllEventsAction.pending]: (state) => {
        state.getAllEventsStatus = STATUS.FETCHING
    },
    [getAllEventsAction.rejected]: (state) => {
        state.getAllEventsStatus = STATUS.FAILED
    },
    [getAllEventsAction.fulfilled]: (state, action) => {
        state.getAllEventsStatus = STATUS.SUCCESS
        state.eventsList = action.payload
    },

  },
})

export const noticeReducer = noticeSlice.reducer