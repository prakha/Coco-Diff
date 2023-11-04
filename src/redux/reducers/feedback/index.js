import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import thunk from "redux-thunk"
import { STATUS } from "../../../App/Constants"
import { removeAuthorizationHeader } from "../../../services/api"
import { apis } from "../../../services/api/apis"
import {useToast} from '@chakra-ui/react'
import { LoadingRef } from "../../../App/AppProvider"



// Feedback 
export const createUserFeedbackAction = createAsyncThunk(
  "feedback/post",
  async (payload, thunkAPI) => {
    // const response = {}
    // console.log("createUserFeedbackAction Called");
    const response = await apis.requestUserFeedbackApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

const initialState = {
}

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    //   hello : 'world'
  },
  extraReducers: {
    // Order
    [createUserFeedbackAction.pending]: (state, action) => {
        state.getFeedbackStatus = STATUS.FETCHING
    },

    [createUserFeedbackAction.rejected]: (state, action) => {
        state.getFeedbackStatus = STATUS.FAILED
    },

    [createUserFeedbackAction.fulfilled]: (state, action) => {
        state.getFeedbackStatus = STATUS.SUCCESS
        // console.log("createUserFeedbackAction.fulfilled : ", {state,action})
        state.feedbackData = action.payload
    },

  },
})

export const feedbackReducer = feedbackSlice.reducer