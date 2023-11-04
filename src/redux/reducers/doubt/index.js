import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { STATUS } from "../../../App/Constants"
import { apis } from '../../../services/api/apis'
import _ from 'lodash'

export const getUserDoubtsAction = createAsyncThunk(
    'doubts/getdoubt',
    async(payload, thunkAPI) => {
        const response = await apis.getDoubtApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getTeacherDoubtsAction = createAsyncThunk(
    'doubts/getTeacherDoubt',
    async(payload, thunkAPI) => {
        const response = await apis.getDoubtApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)


export const getAllTeachers = createAsyncThunk(
    'doubts/getAllTeachers',
    async(payload, thunkAPI) => {
        const response = await apis.getAllTeachersApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getSingleDoubtAction = createAsyncThunk(
    'doubts/singledoubt',
    async(payload, thunkAPI) => {
        const response = await apis.getSingleDoubtApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const createNewDoubt = createAsyncThunk(
    'doubts/createNewDoubt',
    async(payload, thunkAPI) => {
        const response = await apis.createNewDoubt(payload)
        const {ok, problem, data} = response
        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)



let initialState = {
        userAskedDoubts:{},
        teacherDoubts: {},
        allTeachers: []
    }

const doubtSlice = createSlice({
    name:'doubt',
    initialState,
    reducers:{
        resetAddDoubtStatus: state => {
            state.createNewDoubtStatus = STATUS.NOT_STARTED
        },
        resetTeacherDoubts : state => {
            state.teacherDoubts = {}
        },
        resetUserDoubts:  state => {
            state.userAskedDoubts = {}
        }
    },
    extraReducers:{
        [getUserDoubtsAction.pending]: (state) => {
            
            if(!(current(state.userAskedDoubts)?.docs))
                state.getUserDoubtStatus = STATUS.FETCHING
            else 
                state.getMoreUserDoubtStatus = STATUS.FETCHING
        },

        [getUserDoubtsAction.fulfilled]: (state, action) => {
            if(!(current(state.userAskedDoubts)?.docs)){
                state.userAskedDoubts = action.payload;
                state.getUserDoubtStatus = STATUS.SUCCESS;
            }
            else {
                state.userAskedDoubts.docs = _.union( current(state.userAskedDoubts.docs), action.payload?.docs )
                state.userAskedDoubts.page = action.payload?.page;
                state.getMoreUserDoubtStatus = STATUS.SUCCESS
            }
        },

        [getUserDoubtsAction.rejected]:(state) => {
            if(!(current(state.userAskedDoubts)?.docs))
                state.userAskedDoubts = STATUS.FAILED;
            else 
                state.getMoreUserDoubtStatus = STATUS.FAILED;
        },
        
        [getTeacherDoubtsAction.pending]: (state) => {
            if(!(current(state.teacherDoubts)?.docs))
                state.getTeacherDoubtsStatus = STATUS.FETCHING
            else 
                state.getMoreTeacherDoubtStatus = STATUS.FETCHING
        },

        [getTeacherDoubtsAction.fulfilled]: (state, action) => {
            if(!(current(state.teacherDoubts)?.docs)){
                state.teacherDoubts = action.payload;
                state.getTeacherDoubtsStatus = STATUS.SUCCESS;
            }
            else {
                state.teacherDoubts.docs = _.union( current(state.teacherDoubts.docs), action.payload?.docs )
                state.teacherDoubts.page = action.payload?.page;
                state.getMoreTeacherDoubtStatus = STATUS.SUCCESS
            }
        },

        [getTeacherDoubtsAction.rejected]:(state) => {
            if(!(current(state.teacherDoubts)?.docs))
                state.getTeacherDoubtsStatus = STATUS.FAILED;
            else 
                state.getMoreTeacherDoubtStatus = STATUS.FAILED;
        },

        [getAllTeachers.pending]: (state) => {
            state.getAllTeachersStatus = STATUS.FETCHING
        },

        [getAllTeachers.fulfilled]: (state, action) => {
            state.getAllTeachersStatus = STATUS.SUCCESS;
            state.allTeachers = action.payload;
        },

        [getAllTeachers.rejected]:(state) => {
            state.getAllTeachersStatus = STATUS.FAILED
        },

        
        [createNewDoubt.pending]: (state) => {
            state.createNewDoubtStatus = STATUS.FETCHING
        },

        [createNewDoubt.fulfilled]: (state, action) => {
            state.createNewDoubtStatus = STATUS.SUCCESS;
            console.log('state.doubts',current(state.userAskedDoubts.docs),action.payload,_.union(state.userAskedDoubts, action.payload))
            state.userAskedDoubts.docs = _.union([action.payload],current(state.userAskedDoubts.docs));
            state.userAskedDoubts.total += 1; 
        },

        [createNewDoubt.rejected]:(state) => {
            state.createNewDoubtStatus = STATUS.FAILED
        },
    }
})

// export const {resetModalStatus} = discussionSlice.actions


export const { resetAddDoubtStatus, resetTeacherDoubts, resetUserDoubts } = doubtSlice.actions
export const doubtReducer = doubtSlice.reducer