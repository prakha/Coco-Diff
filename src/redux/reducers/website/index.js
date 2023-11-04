import { STATUS } from "../../../App/Constants"
import { apis } from "../../../services/api/apis"

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

export const getWebsiteDataAction = createAsyncThunk(
    'website-content/get',
    async(payload, thunkAPI) => {
        const response = await apis.getWebsiteDataApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const uploadFileAction = createAsyncThunk(
    'app/image',
    async(payload, thunkAPI) => {
        const response = await apis.uploadFileApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const initialState = { 
    packagesList:[],
    uploadFileStatus: STATUS.NOT_STARTED
}

export const WebsiteSlice = createSlice({
    name:'website',
    initialState,
    reducers:{
        resetFileAction : (state, {payload}) => {
            state.uploadFileStatus = STATUS.NOT_STARTED,
            state.file = '' 
        }
    },
    extraReducers:{
        [getWebsiteDataAction.pending]: (state) => {
            state.getWebsiteDataStatus = STATUS.FETCHING
        },
        [getWebsiteDataAction.fulfilled]: (state, action) => {
            state.getWebsiteDataStatus = STATUS.SUCCESS
            state.websiteData = action.payload
        },
        [getWebsiteDataAction.rejected]:(state) => {
            state.getWebsiteDataStatus = STATUS.FAILED
        },

        [uploadFileAction.pending]: (state) => {
            state.uploadFileStatus = STATUS.FETCHING
        },
        [uploadFileAction.fulfilled]: (state, action) => {
            state.uploadFileStatus = STATUS.SUCCESS
            state.file = action.payload
        },
        [uploadFileAction.rejected]:(state) => {
            state.uploadFileStatus = STATUS.FAILED
        },
    }

})


export const {resetFileAction} = WebsiteSlice.actions
export const websiteReducer =  WebsiteSlice.reducer