import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
//import { LoadingRef } from "../../../App/AppProvider";
import { STATUS } from "../../../App/Constants";
import { apis } from "../../../services/api/apis";

// Address
export const updateUserAddressAction = createAsyncThunk(
  "address/post",
  async (payload, thunkAPI) => {
    // const response = {}
    // console.log("updateUserAddressAction Called")
    const response = await apis.updateUserAddressApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      // console.log("updateUserAddressAction Failed");
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const userAddressUpdateAction = createAsyncThunk(
  "address/patch",
  async (payload, thunkAPI) => {
    // const response = {}
    // console.log("updateUserAddressAction Called")
    const response = await apis.userAddressUpdateApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      // console.log("updateUserAddressAction Failed");
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const requestUserAddressAction = createAsyncThunk(
  "address/get",
  async (payload, thunkAPI) => {
    // const response = {}
    // console.log("requestUserAddressAction Called")
    const response = await apis.requestUserAddressApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      // console.log("requestUserAddressAction Success : Data -> ", data);
      return data;
    } else {
      // console.log("requestUserAddressAction Failed");
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

const initialState = {};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    //   hello : 'world'
  },
  extraReducers: {
    // Add a new address
    [updateUserAddressAction.pending]: (state, action) => {
      state.addressUpdateStatus = STATUS.FETCHING;
    },

    [updateUserAddressAction.rejected]: (state, action) => {
      state.addressUpdateStatus = STATUS.FAILED;
    },

    [updateUserAddressAction.fulfilled]: (state, action) => {
      state.addressUpdateStatus = STATUS.SUCCESS;
      // console.log("updateUserAddressAction.fulfilled : ", {state,action})
      let newAddressData = action.payload;
      let existingAddresses = JSON.parse(JSON.stringify(state.userAddress));
      //state.userAddress = [...(state.userAddress || []), action.payload];
      let newAddresses = [...existingAddresses, newAddressData]
      state.userAddress = newAddresses
      //console.log(current(state.userAddress))
    },

    //update a particular address

    [userAddressUpdateAction.pending]: (state, action) => {
      state.updateAddressStatus = STATUS.FETCHING;
    },

    [userAddressUpdateAction.rejected]: (state, action) => {
      state.updateAddressStatus = STATUS.FAILED;
    },

    [userAddressUpdateAction.fulfilled]: (state, action) => {
      state.updateAddressStatus = STATUS.SUCCESS;
      // LoadingRef.current.showToast({
      //   status:"success",
      //   title:"success"
      // })
      //console.log('changed address', action.payload)
      //state.addressData = action.payload;
      state.userAddress[current(state.userAddress).map((a) => {return a._id}).indexOf(action.payload._id)] = Object.assign({}, action.payload)
      //console.log(current(state.userAddress));
    },

    // Address GET
    [requestUserAddressAction.pending]: (state, action) => {
      state.addressRequestStatus = STATUS.FETCHING;
    },

    [requestUserAddressAction.rejected]: (state, action) => {
      state.addressRequestStatus = STATUS.FAILED;
    },

    [requestUserAddressAction.fulfilled]: (state, action) => {
      state.addressRequestStatus = STATUS.SUCCESS;
      //console.log('action.payload', action.payload)
      state.userAddress = action.payload;
    },
  },
});

export const addressReducer = addressSlice.reducer;
