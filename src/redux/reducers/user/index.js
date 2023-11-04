import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
import { LoadingRef } from "../../../App/AppProvider";
import { STATUS } from "../../../App/Constants";
import { apis } from "../../../services/api/apis";
import { isSSR } from "../../../utils/ssrHelper";
// import { requestUserApi } from "../../services/api/UserApis"

// function statusAlert(props) {
//   const toast = useToast()
//   return (toast({ ...props, duration: 2000, isClosable: false, position: "bottom-right", }))
// }

export const requestUserProfileAction = createAsyncThunk(
  "user/me",
  async (payload, thunkAPI) => {
    const response = await apis.requestUserApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      // if (data.role !== "LEAD" && data.role !== "STUDENT") {
      //   return thunkAPI.rejectWithValue("Not Authorized");
      // }
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const updateUserDevice = createAsyncThunk(
  'user/device/post',
  async (payload, thunkAPI) => {
    // console.log('payload userdevice', payload);
    const user = thunkAPI.getState()?.user?.user
    if(!user){
      console.log({"No User" : true})
      return 
    }
    const final = payload
    const response = await apis.updateUserDevice(final);
    const {ok, problem, data} = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  },
);

export const validateGoogleAccountAction = createAsyncThunk(
  "user/me",
  async (payload, thunkAPI) => {
    const response = await apis.requestUserApi();
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const sendOtpRequestAction = createAsyncThunk(
  "user/sendOtp",
  async (payload, thunkAPI) => {
    const response = await apis.requestOtpApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      // statusAlert({ title: "OTP Sent.", description: "Check your Mobile Phone for the One Time Passcode", status: "success"})
      return data;
    } else {
      LoadingRef.current.showToast({
        status:"error",
        title:"Error",
        description: data.message
      })
      // statusAlert({ title: "Somthing's Wrong.", description: "Couldn't Send an OTP. Please Try Again.", status: "error"})
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const verifyOtpRequestAction = createAsyncThunk(
  "user/verifyOtp",
  async (payload, thunkAPI) => {
    const response = await apis.verifyOtpApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

// Coupon Code

export const verifyCouponCodeAction = createAsyncThunk(
  "user/verifyCoupon",
  async (payload, thunkAPI) => {
    // console.log('Verify Coupon API Call : ', payload)
    const response = await apis.verifyCouponCodeApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const updateUserAction = createAsyncThunk(
  "user/updateUser",
  async (payload, thunkAPI) => {
    const response = await apis.updateUserApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const updateUserProfileAction = createAsyncThunk(
  "settings/user/profile",
  async (payload, thunkAPI) => {
    const response = await apis.updateUserProfileApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(data);
    }
  }
);

export const updateAvatarAction = createAsyncThunk(
  "settings/user/avatar",
  async (payload, thunkAPI) => {
    const response = await apis.updateAvatarApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const getUserSurvey = createAsyncThunk(
  "user/survey",
  async (payload, thunkAPI) => {
    const response = await apis.getUserSurveyApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const startTrialAction = createAsyncThunk(
  "package/trial/start",
  async (payload, thunkAPI) => {
    const response = await apis.startTrialApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

const initialState = {
  status: STATUS.NOT_STARTED,
  addEducationStatus: STATUS.NOT_STARTED,
  deleteEducationStatus: STATUS.NOT_STARTED,
  addExperienceStatus: STATUS.NOT_STARTED,
  deleteExperienceStatus: STATUS.NOT_STARTED,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutAction:(state, action) =>{

    },
    setStudentData: (state, { payload }) => {
      state.student = payload.student;
    },
    resetLoginStatus: (state, action) => {
      state.verifyOtpStatus = STATUS.NOT_STARTED;
      state.otpStatus = STATUS.NOT_STARTED;
      state.verifyCouponStatus = STATUS.NOT_STARTED;
    },
    resetEducationStatusAction: (state, action) => {
      state.addEducationStatus = STATUS.NOT_STARTED;
      state.deleteEducationStatus = STATUS.NOT_STARTED;
    },
    resetExperienceStatusAction: (state, action) => {
      state.addExperienceStatus = STATUS.NOT_STARTED;
      state.deleteExperienceStatus = STATUS.NOT_STARTED;
    },
    resetUserStatusAction: (state, action) => {
      state.updateUserStatus = STATUS.NOT_STARTED;
    },
  },
  extraReducers: {
    // package trials
    [startTrialAction.pending]: (state, action) => {
      state.startTrialStatus = STATUS.FETCHING;
    },

    [startTrialAction.rejected]: (state, action) => {
      state.startTrialStatus = STATUS.FAILED;
      LoadingRef.current.showToast({
        status:"error",
        title:"Cannot access trial"
      })
    },

    [startTrialAction.fulfilled]: (state, action) => {
      state.startTrialStatus = STATUS.SUCCESS;
      state.student = action.payload
    },

    //user details request
    [requestUserProfileAction.pending]: (state, action) => {
      state.status = STATUS.FETCHING;
    },

    [requestUserProfileAction.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
    },

    [requestUserProfileAction.fulfilled]: (state, action) => {
      state.status = STATUS.SUCCESS;
      state.user = action.payload;
      state.student = action.payload?.student;
    },

    // Google Account Validation
    // [validateGoogleAccountAction.pending]: (state, action) => {
    //   state.status = STATUS.FETCHING
    // },

    // [validateGoogleAccountAction.rejected]: (state, action) => {
    //   state.status = STATUS.FAILED
    // },

    // [validateGoogleAccountAction.fulfilled]: (state, action) => {
    //   state.status = STATUS.SUCCESS
    //   state.user = action.payload
    // },

    // ---------------------------------------
    // Otp
    [sendOtpRequestAction.pending]: (state, action) => {
      state.otpStatus = STATUS.FETCHING;
    },

    [sendOtpRequestAction.rejected]: (state, action) => {
      state.otpStatus = STATUS.FAILED;
    },

    [sendOtpRequestAction.fulfilled]: (state, action) => {
      state.otpStatus = STATUS.SUCCESS;
      state.otpResponse = action.payload;
    },

    [verifyOtpRequestAction.pending]: (state, action) => {
      state.verifyOtpStatus = STATUS.FETCHING;
    },

    [verifyOtpRequestAction.rejected]: (state, action) => {
      state.verifyOtpStatus = STATUS.FAILED;
    },

    [verifyOtpRequestAction.fulfilled]: (state, action) => {
      state.verifyOtpStatus = STATUS.SUCCESS;
      state.verifyOtpResponse = action.payload;
    },

    // Coupon
    [verifyCouponCodeAction.pending]: (state, action) => {
      state.verifyCouponStatus = STATUS.FETCHING;
    },

    [verifyCouponCodeAction.rejected]: (state, action) => {
      state.verifyCouponStatus = STATUS.FAILED;
    },

    [verifyCouponCodeAction.fulfilled]: (state, action) => {
      state.verifyCouponStatus = STATUS.SUCCESS;
      state.verifyCouponResponse = action.payload;
    },

    //update user details

    [updateUserProfileAction.pending]: (state, action) => {
      state.updateUserStatus = STATUS.FETCHING;
    },

    [updateUserProfileAction.rejected]: (state, action) => {
      state.updateUserStatus = STATUS.FAILED;
      if(action.payload.statusCode === 406) {
        state.errorMessage = action.payload.message
      }
      //console.log('state.errorMessage', state.errorMessage)
    },

    [updateUserProfileAction.fulfilled]: (state, action) => {
      state.updateUserStatus = STATUS.SUCCESS;
      state.user = Object.assign({}, action.payload);
    },

    [updateUserAction.pending]: (state, action) => {
      state.updateUserStatus = STATUS.FETCHING;
    },

    [updateUserAction.rejected]: (state, action) => {
      state.updateUserStatus = STATUS.FAILED;
    },

    [updateUserAction.fulfilled]: (state, action) => {
      state.updateUserStatus = STATUS.SUCCESS;
      state.user = Object.assign({}, action.payload);
    },
  
  
  

    //update avatar

    [updateAvatarAction.pending]: (state, action) => {
      state.updateAvatarStatus = STATUS.FETCHING;
    },

    [updateAvatarAction.rejected]: (state, action) => {
        state.updateAvatarStatus = STATUS.FAILED;
    },

    [updateAvatarAction.fulfilled]: (state, action) => {
        state.updateAvatarStatus = STATUS.SUCCESS;
        state.user.avatar = action.payload.avatar;
    },
    
    [getUserSurvey.pending]: (state, action) => {
      state.getUserSurveyStatus = STATUS.FETCHING;
    },
    [getUserSurvey.rejected]: (state, action) => {
        state.getUserSurveyStatus = STATUS.FAILED;
    },
    [getUserSurvey.fulfilled]: (state, action) => {
        state.getUserSurveyStatus = STATUS.SUCCESS;
        const final = action.payload?.filter(s => s.accessibility)

        state.userSurvey = final //action.payload.length > 0 ? action.payload[0] : null;
    },
  },
});

export const {
  logoutAction,
  setStudentData,
  resetLoginStatus,
  resetEducationStatusAction,
  resetExperienceStatusAction,
  resetUserStatusAction,
  postUserSurveyResponse
} = userSlice.actions;
export const userReducer = userSlice.reducer;
