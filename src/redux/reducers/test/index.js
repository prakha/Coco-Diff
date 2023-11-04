import { STATUS } from "../../../App/Constants"
import { apis } from "../../../services/api/apis"
import { updateAssignmentSubmission } from "../packages"
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

export const getTestAttemptAction = createAsyncThunk(
    '/test/attempt',
    async(payload, thunkAPI) => {
        const response = await apis.getTestAttemptApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const uploadSheetAction = createAsyncThunk(
    '/assignment/submit',
    async(payload, thunkAPI) => {
        const response = await apis.uploadSheetApi(payload)
        const {ok, problem, data} = response

        if(ok){
            thunkAPI.dispatch(updateAssignmentSubmission(data));
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const initialState = { }

export const TestSlice = createSlice({
    name:'test',
    initialState,
    reducers:{
        resetUploadSheet:(state) => {
            state.uploadSheetStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [getTestAttemptAction.pending]: (state) => {
            state.getAttemptStatus = STATUS.FETCHING
        },
        [getTestAttemptAction.fulfilled]: (state, action) => {
            state.getAttemptStatus = STATUS.SUCCESS
            state.currentAttempt = action.payload
        },
        [getTestAttemptAction.rejected]:(state) => {
            state.getAttemptStatus = STATUS.FAILED
        },

        [uploadSheetAction.pending]: (state) => {
            state.uploadSheetStatus = STATUS.FETCHING
        },
        [uploadSheetAction.fulfilled]: (state, action) => {
            state.uploadSheetStatus = STATUS.SUCCESS
        },
        [uploadSheetAction.rejected]:(state) => {
            state.uploadSheetStatus = STATUS.FAILED
        },
    }

})


export const {resetUploadSheet} = TestSlice.actions
export const testReducer =  TestSlice.reducer