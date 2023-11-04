import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { STATUS } from "../../../App/Constants"
import { apis } from "../../../services/api/apis"



// ticket 
export const createTicketAction = createAsyncThunk(
  "ticket/post",
  async (payload, thunkAPI) => {
    // const response = {}
    // console.log("requestUserOrdersAction Called")
    const response = await apis.createTicketApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const requestUserTicketAction = createAsyncThunk(
  "ticket/get",
  async (payload, thunkAPI) => {
    // const response = {}
    // console.log("requestUserOrdersAction Called")
    const response = await apis.getUserTicketsApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getSingleTicketAction = createAsyncThunk(
  "single-ticket/get",
  async (payload, thunkAPI) => {
    const response = await apis.getSingleTicketApi(payload)
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

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    //   hello : 'world'
  },
  extraReducers: {
    // Ticket
    [createTicketAction.pending]: (state, action) => {
        state.getTicketStatus = STATUS.FETCHING
    },

    [createTicketAction.rejected]: (state, action) => {
        state.getTicketStatus = STATUS.FAILED
    },

    [createTicketAction.fulfilled]: (state, action) => {
        state.getTicketStatus = STATUS.SUCCESS
        state.ticket = action.payload
    },

    // GET

  [requestUserTicketAction.pending]: (state, action) => {
      state.getTicketRequestStatus = STATUS.FETCHING
  },

  [requestUserTicketAction.rejected]: (state, action) => {
      state.getTicketRequestStatus = STATUS.FAILED
  },

  [requestUserTicketAction.fulfilled]: (state, action) => {
      state.getTicketRequestStatus = STATUS.SUCCESS
      state.userTickets = action.payload
  },

  [getSingleTicketAction.pending]: (state, action) => {
      state.getTicketStatus = STATUS.FETCHING
  },

  [getSingleTicketAction.rejected]: (state, action) => {
      state.getTicketStatus = STATUS.FAILED
  },

  [getSingleTicketAction.fulfilled]: (state, action) => {
      state.getTicketStatus = STATUS.SUCCESS
      state.currentTicket = action.payload
  },

  },
})

export const ticketReducer = ticketSlice.reducer