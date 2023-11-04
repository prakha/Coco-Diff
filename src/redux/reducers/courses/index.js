import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { STATUS } from "../../../App/Constants"
import { apis } from '../../../services/api/apis'
import _ from 'lodash'

export const getCoursesAction = createAsyncThunk(
    'course/institute',
    async(payload, thunkAPI) => {
        const response = await apis.getCoursesApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getSingleCourseAction = createAsyncThunk(
    'course/single/institute',
    async(payload, thunkAPI) => {
        const response = await apis.getSingleCoursesApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const addCommentAction = createAsyncThunk(
    'course/video/comment/add',
    async(payload, thunkAPI) => {
        const response = await apis.addCommentApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const addReplyAction = createAsyncThunk(
    'course/video/reply/add',
    async(payload, thunkAPI) => {
        const response = await apis.addCommentApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateCommentAction = createAsyncThunk(
    'course/video/comment/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateCommentApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getCommentsAction = createAsyncThunk(
    'course/video/comment/get',
    async(payload, thunkAPI) => {
        const response = await apis.getCommentsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const addLikeAction = createAsyncThunk(
    'course/video/like/add',
    async(payload, thunkAPI) => {
        const response = await apis.addLikeApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const removeCmntAction = createAsyncThunk(
    'course/video/comment/remove',
    async(payload, thunkAPI) => {
        const response = await apis.removeCmntApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getRepliesAction = createAsyncThunk(
    'course/video/commeent/replies/get',
    async(payload, thunkAPI) => {
        const response = await apis.getRepliesApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const reactContentAction = createAsyncThunk(
    '/content-reaction/post',
    async(payload, thunkAPI) => {
        const response = await apis.reactContentApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getContentReactionAction = createAsyncThunk(
    '/content-reaction/get',
    async(payload, thunkAPI) => {
        const response = await apis.getContentReactionApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getPublicContentAction = createAsyncThunk(
    '/content-public/get',
    async(payload, thunkAPI) => {
        const response = await apis.getPublicContentApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getSubjContentAction = createAsyncThunk(
    '/subject-content/get',
    async(payload, thunkAPI) => {
        const response = await apis.getSubjContentApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return {data, extraData:payload}
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const toTree = (data, pid = null, pageData) => {
    return data.reduce((r, e) => {
        if (e.prentComment?._id == pid) {
            const obj = { ...e };
            const children = toTree(data, e._id);
            if (children.length) obj.children = children;
            r.push(obj);
        }
        return r
    }, [])
}


let initialState = {
        courseList:[],
        getCourseStudentStatus: STATUS.NOT_STARTED,
        commentRepliesList:[], nestedCmntList:[],
        subjectContent:[]
    }

const courseSlice = createSlice({
    name:'course',
    initialState,
    reducers:{
        resetCourseStatus:(state) => {
            state.addCourseStatus = STATUS.NOT_STARTED
            state.updateCourseStatus = STATUS.NOT_STARTED
        },
        resetCourseSubjectStatus:(state) => {
            state.addCourseSubjectStatus = STATUS.NOT_STARTED
            state.updateCourseSubjectStatus = STATUS.NOT_STARTED
        }, 
        resetCourseState: (state) => {
            state.addCourseContentStatus = STATUS.NOT_STARTED
        },

        resetRepliesAction: (state) => {
            state.repliesList = null
        },

        resetGetSubjContent : state => {
            state.getSubjContentStatus = STATUS.NOT_STARTED
            state.subjectContent = []
        },

        resetGetPublicContent : state => {
            state.getPublicContentStatus = STATUS.NOT_STARTED
            state.publicContent = null
        }
    },
    extraReducers:{
        [getSubjContentAction.pending]: (state) => {
            state.getSubjContentStatus = STATUS.FETCHING
        },
        [getSubjContentAction.fulfilled]: (state, action) => {
            state.getSubjContentStatus = STATUS.SUCCESS
            let subjIndx = state.subjectContent?.length ? _.findIndex(state.subjectContent,d => d.contentId == action.payload.extraData.id) : -1

            if(subjIndx === -1 ){
                state.subjectContent.push({contentId:action.payload.extraData.id, ...action.payload.data})
            }
        },
        [getSubjContentAction.rejected]:(state) => {
            state.getSubjContentStatus = STATUS.FAILED
        },
        
        [getPublicContentAction.pending]: (state) => {
            state.getPublicContentStatus = STATUS.FETCHING
        },
        [getPublicContentAction.fulfilled]: (state, action) => {
            state.getPublicContentStatus = STATUS.SUCCESS;

            const finalC = action.payload?.subjects?.map(s => {
                let newS = {...s};
                let videoD = _.keyBy(s.contents?.videodata, '_id');
                newS.videos = _.map(s.contents?.videos, v => {
                return Object.assign({}, v, {
                    data: videoD[v.data],
                });
                });

                let audioD = _.keyBy(s.contents?.audiodata, '_id');
                newS.audios = _.map(s.contents?.audios, v => {
                return Object.assign({}, v, {
                    data: audioD[v.data],
                });
                });

                let dD = _.keyBy(s.contents?.documentdata, '_id');
                newS.documents = _.map(s.contents?.documents, v => {
                return Object.assign({}, v, {
                    data: dD[v.data],
                });
                });

                let td = _.keyBy(s.contents?.textdata, '_id');
                newS.texts = _.map(s.contents?.texts, v => {
                return Object.assign({}, v, {
                    data: td[v.data],
                });
                });
                delete newS.contents;
                return newS;
            });
            state.publicContent = {...action.payload, subjects: finalC};
        },
        [getPublicContentAction.rejected]:(state) => {
            state.getPublicContentStatus = STATUS.FAILED
        },
        
        [getContentReactionAction.pending]: (state) => {
            state.getContentReactionStatus = STATUS.FETCHING
        },
        [getContentReactionAction.fulfilled]: (state, action) => {
            state.getContentReactionStatus = STATUS.SUCCESS
            state.contentReactions = action.payload
        },
        [getContentReactionAction.rejected]:(state) => {
            state.getContentReactionStatus = STATUS.FAILED
        },
        
        [reactContentAction.pending]: (state) => {
            state.reactContentStatus = STATUS.FETCHING
        },
        [reactContentAction.fulfilled]: (state, action) => {
            state.reactContentStatus = STATUS.SUCCESS
            state.contentReactions = action.payload
        },
        [reactContentAction.rejected]:(state) => {
            state.reactContentStatus = STATUS.FAILED
        },
        
        [getCoursesAction.pending]: (state) => {
            state.getCoursesStatus = STATUS.FETCHING
        },
        [getCoursesAction.fulfilled]: (state, action) => {
            state.getCoursesStatus = STATUS.SUCCESS
            state.courseList=action.payload
        },
        [getCoursesAction.rejected]:(state) => {
            state.getCoursesStatus = STATUS.FAILED
        },

        [getSingleCourseAction.pending]: (state) => {
            state.getSingleCourseStatus = STATUS.FETCHING
        },
        [getSingleCourseAction.fulfilled]: (state, action) => {
            state.getSingleCourseStatus = STATUS.SUCCESS
            state.currentCourse=action.payload
        },
        [getSingleCourseAction.rejected]:(state) => {
            state.getSingleCourseStatus = STATUS.FAILED
        },

        [addCommentAction.pending]: (state) => {
            state.addCommentStatus = STATUS.FETCHING
        },
        [addCommentAction.fulfilled]: (state, action) => {
            state.addCommentStatus = STATUS.SUCCESS
            let pageDetails = action.payload.parentComment ? _.findIndex(state.commentsList.docs,d => d.parentComment?._id == action.payload.parentComment._id) != -1 ?
                _.find(state.commentsList.docs,d => d.parentComment?._id == action.payload.parentComment._id).pageDetails : {page:1, pages:1, limit:1} : null
            
            state.commentsList.docs.unshift({...action.payload, pageDetails})
            // if(state.commentsList)
            //     state.commentsList.docs.unshift(action.payload)
            // else
            //     state.commentsList = {total:1, limit:1, page:1, pages:1, docs:[action.payload]}
        },
        [addCommentAction.rejected]:(state) => {
            state.addCommentStatus = STATUS.FAILED
        },

        [addReplyAction.pending]: (state) => {
            state.addReplyStatus = STATUS.FETCHING
        },
        [addReplyAction.fulfilled]: (state, action) => {
            state.addReplyStatus = STATUS.SUCCESS
            let pageDetails = action.payload.parentComment ? _.findIndex(state.commentsList.docs,d => d.parentComment?._id == action.payload.parentComment._id) != -1 ?
                _.find(state.commentsList.docs,d => d.parentComment?._id == action.payload.parentComment._id).pageDetails : {page:1, pages:1, limit:1} : null
            
            state.commentsList.docs.unshift({...action.payload, pageDetails})
            state.currentAddedCmnt = action.payload
        },
        [addReplyAction.rejected]:(state) => {
            state.addReplyStatus = STATUS.FAILED
        },

        [getCommentsAction.pending]: (state) => {
            state.getCommentsStatus = STATUS.FETCHING
        },
        [getCommentsAction.fulfilled]: (state, action) => {
            state.getCommentsStatus = STATUS.SUCCESS,
            state.commentsList = action.payload
            state.nestedCmntList = action.payload
        },
        [getCommentsAction.rejected]:(state) => {
            state.getCommentsStatus = STATUS.FAILED
        },

        [updateCommentAction.pending]: (state) => {
            state.updateCommentStatus = STATUS.FETCHING
        },
        [updateCommentAction.fulfilled]: (state, action) => {
            state.updateCommentStatus = STATUS.SUCCESS  
            state.commentsList.docs = state.commentsList.docs.map(d => d._id == action.payload._id ? ({...action.payload, pageDetails:d.pageDetails}) : d)
            // if(action.payload.parentComment)
            //     state.repliesList.docs = state.repliesList.docs.map(d => d._id == action.payload._id ? action.payload : d)
            // else
            //     state.commentsList.docs = state.commentsList.docs.map(d => d._id == action.payload._id ? action.payload : d)
        },
        [updateCommentAction.rejected]:(state) => {
            state.updateCommentStatus = STATUS.FAILED
        },

        [addLikeAction.pending]: (state) => {
            state.addLikeStatus = STATUS.FETCHING
        },
        [addLikeAction.fulfilled]: (state, action) => {
            state.addLikeStatus = STATUS.SUCCESS

            // if(action.payload.parentComment)
            //     state.repliesList.docs = state.repliesList.docs.map(d => d._id == action.payload._id ? action.payload : d)
            // else
            //     state.commentsList.docs = state.commentsList.docs.map(d => d._id == action.payload._id ? action.payload : d)

            state.commentsList.docs = state.commentsList.docs.map(d => d._id == action.payload._id ? ({...action.payload, pageDetails:d.pageDetails}) : d)
        },
        [addLikeAction.rejected]:(state) => {
            state.addLikeStatus = STATUS.FAILED
        },

        [removeCmntAction.pending]: (state) => {
            state.removeCmntStatus = STATUS.FETCHING
        },
        [removeCmntAction.fulfilled]: (state, action) => {
            state.removeCmntStatus = STATUS.SUCCESS
            _.remove(state.commentsList.docs,d => d._id == action.payload._id)

            // if(action.payload.parentComment)
            //     _.remove(state.repliesList.docs,d => d._id == action.payload._id)
            // else
            //     _.remove(state.commentsList.docs,d => d._id == action.payload._id)
        },
        [removeCmntAction.rejected]:(state) => {
            state.removeCmntStatus = STATUS.FAILED
        },

        [getRepliesAction.pending]: (state) => {
            state.getRepliesStatus = STATUS.FETCHING
        },
        [getRepliesAction.fulfilled]: (state, action) => {
            let list = _.unionBy(_.concat(state.commentsList.docs, action.payload.docs), '_id')
            list = list.map(l => l.parentComment && action.payload.docs.length && l.parentComment._id == action.payload.docs[0].parentComment._id ? 
                    ({...l, pageDetails:_.omit(action.payload, ['docs'])})
                    :
                    l
                )
            // console.log('action',  action.payload, state.repliesList)
            // if(state.repliesList?.docs.length && action.payload?.docs.length && state.repliesList.docs[0].parentComment._id == action.payload.docs[0].parentComment._id){
            //     state.repliesList = {...action.payload, docs:_.concat(state.repliesList.docs, action.payload.docs)}
            //     console.log('hello')
            // }
            // else
            //     state.repliesList = action.payload
            
            state.commentsList.docs = list
            state.getRepliesStatus = STATUS.SUCCESS
            
        },
        [getRepliesAction.rejected]:(state) => {
            state.getRepliesStatus = STATUS.FAILED
        },
    }
})

export const {resetCourseStatus, resetRepliesAction, resetCourseSubjectStatus, resetCourseState, resetGetSubjContent,
    resetGetPublicContent
} = courseSlice.actions

export const courseReducer = courseSlice.reducer