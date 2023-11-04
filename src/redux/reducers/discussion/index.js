import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { STATUS } from "../../../App/Constants"
import { apis } from '../../../services/api/apis'
import _ from 'lodash'

export const getForumsAction = createAsyncThunk(
    'discussion/student',
    async(payload, thunkAPI) => {
        const response = await apis.getForumsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getSubTopicForumsAction = createAsyncThunk(
    'discussion/subTopicsForums',
    async(payload, thunkAPI) => {
        const response = await apis.getForumsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)


export const getSingleForumAction = createAsyncThunk(
    'discussion/single/student',
    async(payload, thunkAPI) => {
        const response = await apis.getSingleForumApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const topicReactAction = createAsyncThunk(
    'content-reaction/post',
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

export const addNewForumAction  = createAsyncThunk(
    'addnewforum',
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

const filterRouteData = (action) => {
    let data = JSON.parse(localStorage.getItem("discussionRoute")) || []
    let oldDataIndex = _.findIndex(data, d => d._id == action.payload._id) //get the last index from data

    if(oldDataIndex != -1){
        //get all the data till particuler index
        let dataTillIndex = _.slice(data, 0, oldDataIndex+1)
        localStorage.setItem("discussionRoute", JSON.stringify(_.uniqBy(_.compact(dataTillIndex))))
    }else{
        //check if there is already data
        if(data.length > 0){
            //if data then check for last index and see if there is same subTopic that we got in the action 
            let lastData = data[data.length - 1]
            let findSubChild = _.findIndex(lastData.subTopics.docs, d => d._id === action.payload._id)
            
            if(findSubChild != -1){
                localStorage.setItem("discussionRoute", JSON.stringify(_.uniqBy(_.compact(_.concat(data, action.payload)), '_id')))    
            }else{
                localStorage.removeItem("discussionRoute")
                return 'reload'
            }
        }else{
            localStorage.setItem("discussionRoute", JSON.stringify(_.uniqBy(_.compact(_.concat(data, action.payload)), '_id')))
        }
    }
}

let initialState = {
        forumList:[],
        commentRepliesList:[], 
        nestedCmntList:[],
        addNewForumStatus: STATUS.NOT_STARTED
    }

const discussionSlice = createSlice({
    name:'discussion',
    initialState,
    reducers:{
        resetModalStatus: (state) => {
            state.addNewForumStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [getForumsAction.pending]: (state) => {
            state.getForumsStatus = STATUS.FETCHING
        },

        [getForumsAction.fulfilled]: (state, action) => {
            localStorage.removeItem("discussionRoute")
            state.getForumsStatus = STATUS.SUCCESS
            state.forumList=action.payload
        },

        [getForumsAction.rejected]:(state) => {
            state.getForumsStatus = STATUS.FAILED
        },

        [getSubTopicForumsAction.pending]: (state) => {
            state.getSubTopicForumsStatus = STATUS.FETCHING
        },

        [getSubTopicForumsAction.fulfilled]: (state, action) => {
            state.getSubTopicForumsStatus = STATUS.SUCCESS
            state.currentForum = Object.assign({}, state.currentForum, {subTopics:{...action.payload}})
        },

        [getSubTopicForumsAction.rejected]:(state) => {
            state.getSubTopicForumsStatus = STATUS.FAILED
        },

        [getSingleForumAction.pending]: (state) => {
            state.getSingleForumStatus = STATUS.FETCHING
        },

        [getSingleForumAction.fulfilled]: (state, action) => {
            filterRouteData(action)
            state.getSingleForumStatus = STATUS.SUCCESS
            state.currentForum=action.payload
        },

        [getSingleForumAction.rejected]:(state) => {
            state.getSingleForumStatus = STATUS.FAILED
        },

        [topicReactAction.pending]: (state) => {
            state.topicReactStatus = STATUS.FETCHING
        },

        [topicReactAction.fulfilled]: (state, action) => {
            state.topicReactStatus = STATUS.SUCCESS
            state.currentForum = {...action.payload, subTopics:state.currentForum.subTopics}
        },

        [topicReactAction.rejected]:(state) => {
            state.topicReactStatus = STATUS.FAILED
        },

        [addNewForumAction.pending]: (state) => {
            state.addNewForumStatus = STATUS.FETCHING
        },

        [addNewForumAction.fulfilled]: (state, action) => {
            state.addNewForumStatus = STATUS.SUCCESS
            if(action.payload.parentTopic){
                state.currentForum = Object.assign({}, state.currentForum, {subTopics: {...state.currentForum.subTopics, docs: _.concat([action.payload], state.currentForum.subTopics.docs)}}) 
            }else{
                state.forumList = Object.assign({}, state.forumList, {docs: _.concat(state.forumList.docs, action.payload)})
            }
        },

        [addNewForumAction.rejected]:(state) => {
            state.addNewForumStatus = STATUS.FAILED
        },
    }
})

export const {resetModalStatus} = discussionSlice.actions

export const discussionReducer = discussionSlice.reducer