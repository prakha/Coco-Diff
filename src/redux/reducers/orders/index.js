import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { STATUS } from "../../../App/Constants"
import { apis } from "../../../services/api/apis"



// Orders 
export const requestUserOrdersAction = createAsyncThunk(
  "order/get",
  async (payload, thunkAPI) => {
    // const response = {}
    // console.log("requestUserOrdersAction Called")
    const response = await apis.requestUserOrdersApi(payload)
    const { ok, problem, data } = response
    if (ok) {
        // console.log("requestUserOrdersAction Success : Data -> ", data);
      return data
    } else {
        // console.log("requestUserOrdersAction Failed");
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

const initialState = {
}

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    //   hello : 'world'
  },
  extraReducers: {
    // Order
    [requestUserOrdersAction.pending]: (state, action) => {
        state.getOrderStatus = STATUS.FETCHING
    },

    [requestUserOrdersAction.rejected]: (state, action) => {
        state.getOrderStatus = STATUS.FAILED
    },

    [requestUserOrdersAction.fulfilled]: (state, action) => {
        state.getOrderStatus = STATUS.SUCCESS
        // console.log("requestUserOrdersAction.fulfilled : ", {state,action})
        state.userOrder = action.payload
    },

  },
})

export const orderReducer = orderSlice.reducer