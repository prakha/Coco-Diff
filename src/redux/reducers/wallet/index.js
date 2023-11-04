import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { STATUS } from "../../../App/Constants";
import { apis } from "../../../services/api/apis";

// Orders
export const requestUserWalletAction = createAsyncThunk(
  "wallet/get",
  async (payload, thunkAPI) => {
    const response = await apis.requestUserWalletApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);


// Orders
export const requestUserWalletOrders = createAsyncThunk(
  "wallet/get/orders",
  async (payload, thunkAPI) => {
    const response = await apis.walletOrdersApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const getReferralAction = createAsyncThunk(
  "get/referral",
  async (payload, thunkAPI) => {
    const response = await apis.getReferralApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const redeemPointsAction = createAsyncThunk(
  "redeem/points",
  async (payload, thunkAPI) => {
    const response = await apis.redeemPointsApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

const initialState = {};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    updateUserWalletAction: (state, action) => {
      state.wallet = action.payload;
    },

    resetRedeemPoints: (state, action) => {
      state.redeemPointsStatus = STATUS.NOT_STARTED
    }
  },
  extraReducers: {
    [requestUserWalletAction.pending]: (state, action) => {
      state.getWalletStatus = STATUS.FETCHING;
    },

    [requestUserWalletAction.rejected]: (state, action) => {
      state.getWalletStatus = STATUS.FAILED;
    },

    [requestUserWalletAction.fulfilled]: (state, action) => {
      state.getWalletStatus = STATUS.SUCCESS;
      state.wallet = action.payload;
    },

    [requestUserWalletOrders.pending]: (state, action) => {
      state.orderStatus = STATUS.FETCHING;
    },
    [requestUserWalletOrders.rejected]: (state, action) => {
      state.orderStatus = STATUS.FAILED;
    },
    [requestUserWalletOrders.fulfilled]: (state, action) => {
      state.orderStatus = STATUS.SUCCESS;
      state.orders = action.payload;
    },

    [getReferralAction.pending]: (state) => {
      state.getReferralStatus = STATUS.FETCHING;
    },
    [getReferralAction.rejected]: (state) => {
      state.getReferralStatus = STATUS.FAILED;
    },
    [getReferralAction.fulfilled]: (state, action) => {
      state.getReferralStatus = STATUS.SUCCESS;
      state.myReferral = action.payload
    },

    [redeemPointsAction.pending]: (state) => {
      state.redeemPointsStatus = STATUS.FETCHING;
    },
    [redeemPointsAction.rejected]: (state) => {
      state.redeemPointsStatus = STATUS.FAILED;
    },
    [redeemPointsAction.fulfilled]: (state, action) => {
      state.redeemPointsStatus = STATUS.SUCCESS
      state.myReferral = action.payload
    },
  },
});

export const { updateUserWalletAction, resetRedeemPoints } = walletSlice.actions
export const walletReducer = walletSlice.reducer;
