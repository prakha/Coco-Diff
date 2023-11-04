import _ from 'lodash';
import { STATUS } from "../../../App/Constants";
import { apis } from "../../../services/api/apis";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const getDefaultDataAction = createAsyncThunk(
    'create/getDefaultData',
    async(payload, thunkAPI) => {
        const response = await apis.getDefaultDataApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return data
        }
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getInstituteDefaultAction = createAsyncThunk(
    'create/getInstituteDefault',
    async(payload, thunkAPI) => {
        const response = await apis.getInstituteDefaultApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)



// export const addInstituteDefaultAction = createAsyncThunk(
//     'create/addInstituteDefault',
//     async(payload, thunkAPI) => {
//         const response = await apis.addInstituteDefaultApi(payload)
//         const {ok, problem, data} = response
//         if(ok)
//             return data
//         else
//             return thunkAPI.rejectWithValue(problem)
//     }
// )

// export const addConfigAction = createAsyncThunk(
//     'create/addConfigData',
//     async(payload, thunkAPI) => {
//         const response = await apis.addLmsConfigApi(payload)
//         const {ok, problem, data} = response
//         if(ok)
//             return {data, payloadData: payload}
//         else
//             return thunkAPI.rejectWithValue(problem)
//     }
// )

// export const updateConfigAction = createAsyncThunk(
//     'create/updateConfigData',
//     async(payload, thunkAPI) => {
//         const response = await apis.editLmsConfigApi(payload)
//         const {ok, problem, data} = response
//         if(ok)
//             return {data, payloadData: payload}
//         else
//             return thunkAPI.rejectWithValue(problem)
//     }
// )

const initialState = {
    defaultDataStatus: STATUS.NOT_STARTED,
    addConfigStatus: STATUS.NOT_STARTED,
    instituteDefaultStatus: STATUS.NOT_STARTED,
    updateConfigStatus: STATUS.NOT_STARTED,
    addInstituteDefaultStatus: STATUS.NOT_STARTED
}


const setKeyedData = (state , data) =>{
        state.keyedData = {
                exams: _.keyBy(data.exams , '_id'),
                boards: _.keyBy(data.boards , '_id'),
                competitions: _.keyBy(data.competitions , '_id'),
                subjects: _.keyBy(data.subjects , '_id'),
                standards: _.keyBy(data.standards , '_id'),
        }
}


const lmsConfigSlice = createSlice({
    name:'lmsConfig',
    initialState,
    reducers: {
        resetEducationStatusAction: (state, action) => {
          state.addEducationStatus = STATUS.NOT_STARTED
          state.deleteAlumniEducationStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [getDefaultDataAction.pending] : (state, action) => {
            state.defaultDataStatus = STATUS.FETCHING
        },
        [getDefaultDataAction.fulfilled]:(state, action)=>{
            state.defaultDataStatus = STATUS.SUCCESS
            state.defaultData = action.payload
            setKeyedData(state, action.payload)
        },
        [getDefaultDataAction.rejected]:(state, action)=>{
            state.defaultDataStatus = STATUS.FAILED
        },

        [getInstituteDefaultAction.pending] : (state, action) => {
            state.instituteDefaultStatus = STATUS.FETCHING
        },
        [getInstituteDefaultAction.fulfilled]:(state, action)=>{
            state.instituteDefaultStatus = STATUS.SUCCESS
            state.instituteDefaultData = action.payload
        },
        [getInstituteDefaultAction.rejected]:(state, action)=>{
            state.instituteDefaultStatus = STATUS.FAILED
        },

        // [addInstituteDefaultAction.pending] : (state, action) => {
        //     state.addInstituteDefaultStatus = STATUS.FETCHING
        // },
        // [addInstituteDefaultAction.fulfilled]:(state, action)=>{
        //     state.addInstituteDefaultStatus = STATUS.SUCCESS
        //     state.instituteDefaultData = action.payload
        // },
        // [addInstituteDefaultAction.rejected]:(state, action)=>{
        //     state.addInstituteDefaultStatus = STATUS.FAILED
        // },

        // [addConfigAction.pending] : (state, action) => {
        //     state.addConfigStatus = STATUS.FETCHING
        // },
        // [addConfigAction.fulfilled]:(state, action)=>{
        //     console.log(action)
        //     state.addConfigStatus = STATUS.SUCCESS
        //     state.defaultData[_.lowerCase(action.payload.payloadData.type)+'s'] = _.concat(state.defaultData[_.lowerCase(action.payload.payloadData.type)+'s'], action.payload.data)
        //     if(action.payload.payloadData.type === 'EXAM'){
        //         let findIndexOfComp = _.findIndex(state.defaultData.competitions, s => s._id === action.payload.payloadData.extra.competitionId)
        //         if(findIndexOfComp != -1){
        //             state.defaultData.competitions[findIndexOfComp].exams = _.concat(state.defaultData.competitions[findIndexOfComp].exams, action.payload.data._id)
        //         }
        //     }

        //     SuccessMessage("Added")
        // },
        // [addConfigAction.rejected]:(state, action)=>{
        //     state.addConfigStatus = STATUS.FAILED
        //     ErrorMessage(action.error.message)
        // },
        // [updateConfigAction.pending] : (state, action) => {
        //     state.updateConfigStatus = STATUS.FETCHING
        // },
        // [updateConfigAction.fulfilled]:(state, action)=>{
        //     state.updateConfigStatus = STATUS.SUCCESS
        //     SuccessMessage("Updated")
        // },
        // [updateConfigAction.rejected]:(state, action)=>{
        //     state.updateConfigStatus = STATUS.FAILED
        //     ErrorMessage(action.error.message)
        // }
    }
})

export const { resetEducationStatusAction } = lmsConfigSlice.actions
export const lmsConfigReducer = lmsConfigSlice.reducer