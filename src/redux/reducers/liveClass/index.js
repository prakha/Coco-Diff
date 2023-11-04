import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit"
import _, { concat, find, map } from "lodash"
import { STATUS } from "../../../App/Constants"
import { apis } from "../../../services/api/apis"

export const getTodayLiveClassAction = createAsyncThunk(
    "today-live-class/get",
    async (payload, thunkAPI) => {
      const response = await apis.getLiveClassApi({...payload })
      const { ok, problem, data } = response
      if (ok) {
        return {data, extraData:payload}
      } else {
          return thunkAPI.rejectWithValue(problem)
      }
    }
  )

  export const getUpcomingLiveClassAction = createAsyncThunk(
    "upcoming-live-class/get",
    async (payload, thunkAPI) => {
      const response = await apis.getLiveClassApi({...payload })
      const { ok, problem, data } = response
      if (ok) {
        return {data, extraData:payload}
      } else {
          return thunkAPI.rejectWithValue(problem)
      }
    }
  )

  export const getStaffRatingAction = createAsyncThunk(
    "staff-ratings/get",
    async (payload, thunkAPI) => {
      const response = await apis.getStaffRatingApi({...payload })
      const { ok, problem, data } = response
      if (ok) {
        return {data, extraData:payload}
      } else {
          return thunkAPI.rejectWithValue(problem)
      }
    }
  )

  export const getStaffReviewAction = createAsyncThunk(
    "staff-review/get",
    async (payload, thunkAPI) => {
      const response = await apis.getStaffReviewsApi({...payload })
      const { ok, problem, data } = response
      if (ok) {
        return {data, extraData:payload}
      } else {
          return thunkAPI.rejectWithValue(problem)
      }
    }
  )

  export const addStaffReviewAction = createAsyncThunk(
    "staff-review/post",
    async (payload, thunkAPI) => {
      const response = await apis.addStaffReviewApi({...payload })
      const { ok, problem, data } = response
      if (ok) {
        return {data, extraData:payload}
      } else {
          return thunkAPI.rejectWithValue(problem)
      }
    }
  )
  
  export const getUserStaffReviewAction = createAsyncThunk(
    "staff-review/user/get",
    async (payload, thunkAPI) => {
      const response = await apis.getStaffReviewsApi({...payload })
      const { ok, problem, data } = response
      if (ok) {
        return {data, extraData:payload}
      } else {
          return thunkAPI.rejectWithValue(problem)
      }
    }
  )

 export const getZoomLectureSignatureAction = createAsyncThunk(
    "lecture/zoom/get",
    async (payload, thunkAPI) => {
      const response = await apis.getLectureZoomSignatureApi({...payload })
      const { ok, problem, data } = response
      if (ok) {
        return {data, extraData:payload}
      } else {
          return thunkAPI.rejectWithValue(problem)
      }
    }
  )
  

const initialState = {
  staffRatings : []
}

const liveClassSlice = createSlice({
  name: "liveClass",
  initialState,
  reducers: {
    resetAddReviewStatusAction: (state, action) => {
      state.addStaffReviewStatus = STATUS.NOT_STARTED
    },
    resetLectureZoomSigmaDetails: (state, action) => {
      state.getZoomLectureSignatureStatus = STATUS.NOT_STARTED;
      state.lectureZoomSignatureDetails = null;
    }
  },
  extraReducers: {
    [getTodayLiveClassAction.pending]: (state) => {
        state.getTodayLiveClassStatus = STATUS.FETCHING;
        state.todayLiveClasses = null
    },
    [getTodayLiveClassAction.rejected]: (state) => {
        state.getTodayLiveClassStatus = STATUS.FAILED
    },
    [getTodayLiveClassAction.fulfilled]: (state, action) => {
        state.getTodayLiveClassStatus = STATUS.SUCCESS;
        state.todayLiveClasses = action.payload.data;
    },

    
    [getUpcomingLiveClassAction.pending]: (state) => {
      state.getUpcomingLiveClassStatus = STATUS.FETCHING;
      state.batchUpcomingClasses = null;
    },
    [getUpcomingLiveClassAction.rejected]: (state) => {
        state.getUpcomingLiveClassStatus = STATUS.FAILED
    },
    [getUpcomingLiveClassAction.fulfilled]: (state, action) => {
        state.getUpcomingLiveClassStatus = STATUS.SUCCESS;
        state.batchUpcomingClasses = action.payload.data
    },

    [getStaffRatingAction.pending]: (state) => {
        state.getStaffRatingStatus = STATUS.FETCHING;
        state.staffRatings = null;
    },
    [getStaffRatingAction.rejected]: (state) => {
        state.getStaffRatingStatus = STATUS.FAILED
    },
    [getStaffRatingAction.fulfilled]: (state, action) => {
        state.getStaffRatingStatus = STATUS.SUCCESS;
        state.staffRatings = action.payload.data
    },

    [getStaffReviewAction.pending]: (state) => {
      state.getStaffReviewStatus = STATUS.FETCHING;
    },
    [getStaffReviewAction.rejected]: (state) => {
        state.getStaffReviewStatus = STATUS.FAILED
    },
    [getStaffReviewAction.fulfilled]: (state, action) => {
        state.getStaffReviewStatus = STATUS.SUCCESS;
        state.staffReviews = action.payload.data;
        if(action.payload.data.page === 1)
          state.staffReviewComments = action.payload.data.docs;
        else
          state.staffReviewComments = concat(state.staffReviewComments, action.payload.data.docs);

    },

    [addStaffReviewAction.pending]: (state) => {
      state.addStaffReviewStatus = STATUS.FETCHING;
    },
    [addStaffReviewAction.rejected]: (state) => {
        state.addStaffReviewStatus = STATUS.FAILED
    },
    [addStaffReviewAction.fulfilled]: (state, action) => {
        state.addStaffReviewStatus = STATUS.SUCCESS;
        state.staffReviewComments = concat(state.staffReviewComments,action.payload.data);
        if(find(state.staffRatings, s => s.staffId === action.payload.data.staff._id ))
          state.staffRatings = map(state.staffRatings, s => s.staffId === action.payload.data.staff._id ? ({ ...s, noOfRatings : s.noOfRatings + 1, sumOfRating: s.sumOfRating + action.payload.data.rating }) : s )
        else
          state.staffRatings = [...state.staffRatings, action.payload.data ];
        state.userStaffReviews = concat( state.userStaffReviews, action.payload.data );  
    },
          
    [getUserStaffReviewAction.pending]: (state) => {
      state.getUserStaffReviewStatus = STATUS.FETCHING;
    },
    [getUserStaffReviewAction.rejected]: (state) => {
        state.getUserStaffReviewStatus = STATUS.FAILED
    },
    [getUserStaffReviewAction.fulfilled]: (state, action) => {
        state.getUserStaffReviewStatus = STATUS.SUCCESS;
        state.userStaffReviews = action.payload.data.docs;
    },

    
    [getZoomLectureSignatureAction.pending]: (state) => {
      state.getZoomLectureSignatureStatus = STATUS.FETCHING;
      state.lectureZoomSignatureDetails = null;
    },
    [getZoomLectureSignatureAction.rejected]: (state) => {
        state.getZoomLectureSignatureStatus = STATUS.FAILED
    },
    [getZoomLectureSignatureAction.fulfilled]: (state, action) => {
        state.getZoomLectureSignatureStatus = STATUS.SUCCESS;
        state.lectureZoomSignatureDetails = action.payload.data;
    }
  },
})

export const { resetAddReviewStatusAction, resetLectureZoomSigmaDetails } = liveClassSlice.actions
export const liveClassReducer = liveClassSlice.reducer