import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { STATUS } from "../../../App/Constants"
import { apis } from '../../../services/api/apis'
import _ from 'lodash'
import { LoadingRef } from '../../../App/AppProvider'

export const getQuestionDiscussAction = createAsyncThunk(
    'question/student',
    async(payload, thunkAPI) => {
        const response = await apis.getQuestionDiscussApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getSingleQuestionAction = createAsyncThunk(
    'question/studentNew',
    async(payload, thunkAPI) => {
        const response = await apis.getSingleQuestionDiscussApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getQuestionAnswerComments = createAsyncThunk(
    'question/change',
    async(payload, thunkAPI) => {
        const response = await apis.getAnswerCommentApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const addNewQuestionDiscussAction = createAsyncThunk(
    'question/addnewforum',
    async(payload, thunkAPI) => {
        const response = await apis.addNewQuestionDiscussApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateQuestionAction = createAsyncThunk(
    'question/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateQuestionApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const topicReactAction = createAsyncThunk(
    'content-reaction_new-/post',
    async(payload, thunkAPI) => {
        const response = await apis.topicReactApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const selectOptionAction = createAsyncThunk(
    'option/add',
    async(payload, thunkAPI) => {
        const response = await apis.selectOptionApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getTopicAnsAction = createAsyncThunk(
    'option/get',
    async(payload, thunkAPI) => {
        const response = await apis.getTopicAnsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const addQuestionTopicAction  = createAsyncThunk(
    'add/question-topic',
    async(payload, thunkAPI) => {
        const response = await apis.addNewForumApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const deleteQueAction =  createAsyncThunk(
    'que/delete-topic',
    async(payload, thunkAPI) => {
        LoadingRef.current.show()
        const response = await apis.deleteQueApi(payload)
        LoadingRef.current.hide()
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)


const filterRouteData = (action) => {
    let data = JSON.parse(localStorage.getItem("questionRoute")) || []
    let oldDataIndex = _.findIndex(data, d => d._id == action.payload._id) //get the last index from data

    if(oldDataIndex != -1){
        //get all the data till particuler index
        let dataTillIndex = _.slice(data, 0, oldDataIndex+1)
        localStorage.setItem("questionRoute", JSON.stringify(_.uniqBy(_.compact(dataTillIndex))))
    }else{
        //check if there is already data
        if(data.length > 0){
            //if data then check for last index and see if there is same subTopic that we got in the action 
            let lastData = data[data.length - 1]
            let findSubChild = _.findIndex(lastData.subTopics.docs, d => d._id === action.payload._id)
            
            if(findSubChild != -1){
                localStorage.setItem("questionRoute", JSON.stringify(_.uniqBy(_.compact(_.concat(data, action.payload)), '_id')))    
            }else{
                localStorage.removeItem("questionRoute")
                return 'reload'
            }
        }else{
            localStorage.setItem("questionRoute", JSON.stringify(_.uniqBy(_.compact(_.concat(data, action.payload)), '_id')))
        }
    }
}

let initialState = {
        questionList:[]
    }

const questionDiscussSlice = createSlice({
    name:'questionDiscuss',
    initialState,
    reducers:{
        resetModalStatus: (state) => {
            state.addNewQuestionDiscussStatus = STATUS.NOT_STARTED
        },

        resetSelectOptStatus: (state) => {
            state.selectOptionStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [updateQuestionAction.pending]: (state) => {
            state.updateQuestionStatus = STATUS.FETCHING
        },
        [updateQuestionAction.fulfilled]: (state, action) => {
            state.updateQuestionStatus = STATUS.SUCCESS
            state.currentQuestionData = action.payload
            
        },
        [updateQuestionAction.pending]: (state) => {
            state.updateQuestionStatus = STATUS.FETCHING
        },
        
        [deleteQueAction.pending]: (state) => {
            state.deleteQueStatus = STATUS.FETCHING
        },
        [deleteQueAction.fulfilled]: (state, action) => {
            state.deleteQueStatus = STATUS.SUCCESS
            _.remove(state.currentQuestionData.subTopics.docs,d => d._id === action.payload._id)
            
        },
        [deleteQueAction.pending]: (state) => {
            state.deleteQueStatus = STATUS.FETCHING
        },
        
        [addQuestionTopicAction.pending]: (state) => {
            state.addQueTopicStatus = STATUS.FETCHING
        },
        [addQuestionTopicAction.fulfilled]: (state, action) => {
            state.addQueTopicStatus = STATUS.SUCCESS
            
            if(state.questionList?.docs)
                state.questionList.docs.unshift(action.payload)
        },
        [addQuestionTopicAction.pending]: (state) => {
            state.addQueTopicStatus = STATUS.FETCHING
        },
        
        [getTopicAnsAction.pending]: (state) => {
            state.getTopicAnsStatus = STATUS.FETCHING
        },
        [getTopicAnsAction.fulfilled]: (state, action) => {
            state.getTopicAnsStatus = STATUS.SUCCESS,
            state.answersCount = action.payload
        },
        [getTopicAnsAction.pending]: (state) => {
            state.getTopicAnsStatus = STATUS.FETCHING
        },
        
        [selectOptionAction.pending]: (state) => {
            state.selectOptionStatus = STATUS.FETCHING
        },

        [selectOptionAction.fulfilled]: (state, action) => {
            state.selectOptionStatus = STATUS.SUCCESS
            state.answersCount = {...state.answersCount, self: action.meta.arg.optionId}
        },
        
        [selectOptionAction.pending]: (state) => {
            state.selectOptionStatus = STATUS.FETCHING
        },

        [getQuestionDiscussAction.fulfilled]: (state, action) => {
            localStorage.removeItem("questionRoute")
            state.getQuestionDiscussStatus = STATUS.SUCCESS
            state.questionList = action.payload
        },

        [getQuestionDiscussAction.rejected]:(state) => {
            state.getQuestionDiscussStatus = STATUS.FAILED
        },

        [getSingleQuestionAction.pending]: (state) => {
            state.getSingleQuestionDiscussStatus = STATUS.FETCHING
        },

        [getSingleQuestionAction.fulfilled]: (state, action) => {
            filterRouteData(action)
            state.getSingleQuestionDiscussStatus = STATUS.SUCCESS
            state.currentQuestionData = action.payload
        },

        [getSingleQuestionAction.rejected]:(state) => {
            state.getSingleQuestionDiscussStatus = STATUS.FAILED
        },

        [getQuestionAnswerComments.pending]: (state) => {
            state.getQuestionAnswerCommentsStatus = STATUS.FETCHING
        },

        [getQuestionAnswerComments.fulfilled]: (state, action) => {
            state.getQuestionAnswerCommentsStatus = STATUS.SUCCESS
            state.questionAnswerComments = action.payload
        },

        [getQuestionAnswerComments.rejected]:(state) => {
            state.getQuestionAnswerCommentsStatus = STATUS.FAILED
        },

        [addNewQuestionDiscussAction.pending]: (state) => {
            state.addNewQuestionDiscussStatus = STATUS.FETCHING
        },

        [addNewQuestionDiscussAction.fulfilled]: (state, action) => {
            state.addNewQuestionDiscussStatus = STATUS.SUCCESS
            state.currentQuestionData = Object.assign({}, state.currentQuestionData, {subTopics: {...state.currentQuestionData.subTopics, docs: _.concat(action.payload, state.currentQuestionData.subTopics.docs)}}) 
        },

        [addNewQuestionDiscussAction.rejected]:(state) => {
            state.addNewQuestionDiscussStatus = STATUS.FAILED
        },

        [topicReactAction.pending]: (state) => {
            state.topicReactStatus = STATUS.FETCHING
        },

        [topicReactAction.fulfilled]: (state, action) => {
            state.topicReactStatus = STATUS.SUCCESS
            state.currentQuestionData = {...action.payload}
        },

        [topicReactAction.rejected]:(state) => {
            state.topicReactStatus = STATUS.FAILED
        },
    }
})

export const {resetModalStatus, resetSelectOptStatus} = questionDiscussSlice.actions

export const questionDiscussReducer = questionDiscussSlice.reducer