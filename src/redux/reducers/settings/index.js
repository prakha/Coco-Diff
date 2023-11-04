import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { STATUS } from "../../../App/Constants";
import { apis } from "../../../services/api/apis";


export const updateUserProfileAction = createAsyncThunk(
  "settings/user/profile",
  async (payload, thunkAPI) => {
    const response = await apis.updateUserProfileApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const resetUserPasswordAction = createAsyncThunk(
    "settings/user/password",
    async (payload, thunkAPI) => {
      const response = await apis.resetUserPasswordApi(payload);
      const { ok, problem, data } = response;
      if (ok) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(problem);
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


export const sendOtpRequestAction = createAsyncThunk(
  "settings/contact/sendOtp",
  async (payload, thunkAPI) => {
    const response = await apis.requestOtpApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      // statusAlert({ title: "OTP Sent.", description: "Check your Mobile Phone for the One Time Passcode", status: "success"})
      return data;
    } else {
      // statusAlert({ title: "Somthing's Wrong.", description: "Couldn't Send an OTP. Please Try Again.", status: "error"})
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const verifyOtpRequestAction = createAsyncThunk(
  "settings/contact/verifyOtp",
  async (payload, thunkAPI) => {
    const response = await apis.updateContactOTPApi(payload);
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
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    resetPasswordChangeStatus: (state, action) => {
      state.passwordChangeStatus = STATUS.NOT_STARTED
    },
    resetUpdateUserStatus: (state, action) => {
      state.updateUserStatus = STATUS.NOT_STARTED
    },
    resetUpdateAvatarStatus: (state, action) => {
      state.updateAvatarStatus = STATUS.NOT_STARTED
    },
    resetotpStatus: (state, action) => {
      state.otpStatus = STATUS.NOT_STARTED
    }
    
  },
  extraReducers: {

    [updateUserProfileAction.pending]: (state, action) => {
        state.updateUserStatus = STATUS.FETCHING;
    },

    [updateUserProfileAction.rejected]: (state, action) => {
        state.updateUserStatus = STATUS.FAILED;
    },

    [updateUserProfileAction.fulfilled]: (state, action) => {
        state.updateUserStatus = STATUS.SUCCESS;
        //console.log({actionP: action.payload})
        state.userProfileDetails = Object.assign({}, action.payload);
        //console.log('state.userProfileDetails', state.userProfileDetails)
    },

    [updateAvatarAction.pending]: (state, action) => {
        state.updateAvatarStatus = STATUS.FETCHING;
    },

    [updateAvatarAction.rejected]: (state, action) => {
        state.updateAvatarStatus = STATUS.FAILED;
    },

    [updateAvatarAction.fulfilled]: (state, action) => {
        state.updateAvatarStatus = STATUS.SUCCESS;
        state.avatar = action.payload.avatar;
    },

    [resetUserPasswordAction.pending]: (state, action) => {
        state.passwordChangeStatus = STATUS.FETCHING;
    },

    [resetUserPasswordAction.rejected]: (state, action) => {
        state.passwordChangeStatus = STATUS.FAILED;
    },

    [resetUserPasswordAction.fulfilled]: (state, action) => {
        state.passwordChangeStatus = STATUS.SUCCESS;
        state.passwordChangeResponse = action.payload;
    },

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
      state.otpResponse = action.payload.token;
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
  },
});

export const {
  resetPasswordChangeStatus,
  resetUpdateAvatarStatus,
  resetUpdateUserStatus,
  resetotpStatus
} = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
