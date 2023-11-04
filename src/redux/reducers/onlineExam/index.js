const { createSlice, createAsyncThunk, current } = require("@reduxjs/toolkit")
import { STATUS } from "../../../App/Constants"
import { apis } from "../../../services/api/apis"
import _ from 'lodash'
import moment from 'moment'

const getQuestionResponse = (questionResponseData, questionId) => {
    return _.find(questionResponseData, s => s.questionId == questionId)
}

const payloadDataMapping = (data, stateData) => {
    let startTime = stateData.currentStartTime
    let endTime = moment(new Date()).format()
    //Current Question to map response --> either a particuler question or all the current questions
    let currentQuestion = stateData.currentQuestion
    
    let responseList = _.map(currentQuestion, que => {
        let questionResponse = getQuestionResponse(stateData.questionResponseData, que.question._id)
        return ({
            sectionId: que.section._id,
            questionId: que.question._id,
            action: questionResponse.action,
            answer: questionResponse.answer,
            startTime: startTime,
            endTime: endTime,
            timeSpent: (moment(endTime).valueOf() - moment(startTime).valueOf()) / 1000,
        })
    })

    return responseList
}

//ACTION CALLS--------->
export const getSingleTestDataAction = createAsyncThunk(
    'test/paper',
    async(payload, thunkAPI) => {
        const response = await apis.getSingleTestDataApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const startTestAttemptAction = createAsyncThunk(
    'attempt/paper',
    async(payload, thunkAPI) => {
        if(payload.id){
            const response = await apis.resumeAttemptsApi(payload)
            const {ok, problem, data} = response

            if(ok){
                return data
            }else{
                return thunkAPI.rejectWithValue(problem)
            }
        } else{
            const response = await apis.startTestAttemptsApi(payload)
            const {ok, problem, data} = response

            if(ok){
                return data
            }else{
                return thunkAPI.rejectWithValue(problem)
            }
        }
    }
)

export const actionSubmitAction = createAsyncThunk(
    'submit/actionCalled',
    async(payload, thunkAPI) => {
        let payloadData = _.clone(payload)
        const response = await apis.actionResponseApi(_.omit(payload, ['id']))

        const {ok, problem, data} = response
        if(ok){
            return {response: data, actionData: payloadData}
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

//-----------END------------


//FUNCTIONS TO CALCULATE DATA ------->
const currentQuestionChange = (actionData, pageWiseData) => {
    if(actionData.typeOfAction === 'sectionChange'){
        let pageIndex = _.findIndex(pageWiseData, pg => _.findIndex(pg, d => d.section._id == actionData.newSectionId) != -1)
        return {
            newCurrentQuestion: pageWiseData[pageIndex],
            newPageNumber: pageIndex 
        }
    }else if(actionData.typeOfAction === 'randomQuestion'){
        let pageIndex = _.findIndex(pageWiseData, pg => _.findIndex(pg, d => d.question._id == actionData.newQuestionId) != -1)
        return {
            newCurrentQuestion: pageWiseData[pageIndex],
            newPageNumber: pageIndex 
        }
    }else if(actionData.typeOfAction === 'prev'){
        return {
            newCurrentQuestion: pageWiseData[actionData.pageNumber - 1],
            newPageNumber: actionData.pageNumber - 1 
        }
    }else if(actionData.typeOfAction === 'next'){
        return {
            newCurrentQuestion: pageWiseData[actionData.pageNumber + 1],
            newPageNumber: actionData.pageNumber + 1
        }
    }else{
        return {
            newCurrentQuestion: pageWiseData[actionData.pageNumber],
            newPageNumber: actionData.pageNumber
        }
    }
}

const afterActionData = (action, allQuestionsResponse, currentQuestion) => {
    //Recalculating the AllQuestionResponse Array 
    let responseListData = allQuestionsResponse
    if(action.payload.typeOfAction == 'pageChange'){
        responseListData = _.map(allQuestionsResponse, s => {
            let findQue =  _.find(action?.payload?.currentQuestion, q => q.question._id == s.questionId)
            return Object.assign({}, s, {
                answer: s.answer, 
                action: findQue && s.action == 'not-viewed-yet' ? 'not-attempted' : s.action
            })
        })
    }else{ 
        responseListData = _.map(allQuestionsResponse, s => {
            let findQue =  action?.payload?.questionId === s.questionId
            return Object.assign({}, s, {
                answer: findQue && action?.payload?.answer ? action?.payload?.answer : s.answer, 
                action: findQue && action?.payload?.typeOfAction ? action?.payload?.typeOfAction : s.action
            })
        })
    }

    return {newQuestionResponseData: responseListData}
}
//------------END------------

const initialState = {  
   getSingleTestStatus: STATUS.NOT_STARTED,
   attemptStartStatus: STATUS.NOT_STARTED,
   allQuestionData: [],
   allSectionsData: [],
   actionQueue: [],
   actionSubmitActionStatus: STATUS.NOT_STARTED,
   finalActionData: undefined,
   pageNumber: undefined,
}

export const OnlineExamSlice = createSlice({
    name:'onlineExam',
    initialState,
    reducers:{
        resetAllStatus: (state) => {
            state.getSingleTestStatus = STATUS.NOT_STARTED
            state.attemptStartStatus = STATUS.NOT_STARTED
        },

        toggleExamWindowAction: (state, actions) => {
            state.newWindowData = {...actions.payload}
        },

        actionCalled: (state, actions) => {
            if(actions.payload.typeOfAction === 'sectionChange' || actions.payload.typeOfAction === 'randomQuestion' || actions.payload.typeOfAction === 'prev' || actions.payload.typeOfAction === 'next' || actions.payload.typeOfAction === 'submit'){
                let endDate = moment(new Date())
                state.actionQueue = _.compact(_.concat(
                    state.actionQueue, 
                    {
                        id: moment(new Date()).format(),
                        submittedAt:moment().toISOString(),
                        attemptedTestId: actions.payload.attemptedTestId,
                        responseList: payloadDataMapping(actions.payload, state),
                        totalTimeTaken: actions.payload.timeOver ? state.examTotalTime : (state.totalTimeTaken + endDate.diff(state.testStartTime)),
                        progressStatus: actions.payload.progressStatus ? 'completed' : 'in-progress',
                    }
                ))

                let data = currentQuestionChange(actions.payload, _.clone(state.pageWiseData))
                state.currentQuestion = data.newCurrentQuestion
                state.currentStartTime = moment(new Date()).format()
                state.pageNumber = data.newPageNumber
            }else{
                let data = afterActionData(actions, state.questionResponseData, state.currentQuestion)
                state.questionResponseData = data.newQuestionResponseData
            }
        }
    },
    extraReducers:{
        [getSingleTestDataAction.pending]: (state) => {
            state.getSingleTestStatus = STATUS.FETCHING
        },
        [getSingleTestDataAction.fulfilled]: (state, action) => {
            state.getSingleTestStatus = STATUS.SUCCESS
            state.singleTestData = action.payload
        },
        [getSingleTestDataAction.rejected]:(state) => {
            state.getSingleTestStatus = STATUS.FAILED
        },

        [startTestAttemptAction.pending]: (state) => {
            state.testAttemptStartStatus = STATUS.FETCHING
        },

        [startTestAttemptAction.fulfilled]: (state, action) => {
            let allQuestionData = _.compact(_.map(action.payload.finalResponse, (fr, i) => {
                let sectionData = _.find(state.singleTestData.sections, s => s._id == fr.sectionId)
                let questionData = _.find(sectionData?.questions, q => q._id == fr.questionId)

                return ({
                    section: sectionData,
                    question: questionData,
                    order: i+1,
                    endTime: fr?.endTime
                })
            }))

            const lastAttemptedQuestion = _.head(_.orderBy(_.clone(allQuestionData), ['endTime'], ['asc']))
            const testOption = state.singleTestData?.testOption
            const n =  testOption && testOption.numQuestionsPerPage && parseInt(testOption.numQuestionsPerPage) || 1 //------ change this with the per page question data from admin side ------
            state.numQuestionsPerPage = n
            let pageWiseQuestions = _.groupBy(_.clone(allQuestionData), 'section._id')

            //split all questions page wise in there respective sections
            const pageWiseData = _.flattenDepth(_.map(pageWiseQuestions, pagee => {
                let ddd = _.map(_.fill(new Array(Math.ceil(pagee.length / n))), _ => pagee.splice(0, n))
                return  ddd
            }), 1)

            let lastAttemptedPage = _.findIndex(pageWiseData, p => _.findIndex(p, que => que.question._id == lastAttemptedQuestion.question._id) != -1)

            let currentQuestionData = pageWiseData[lastAttemptedPage != -1 ? lastAttemptedPage : 0]

            state.testAttemptStartStatus = STATUS.SUCCESS
            state.testAttemptData = action.payload
            state.allSectionsData = _.chain(_.clone(allQuestionData)).groupBy('section._id').map((ques, sec) => ({section: _.head(ques).section, questions: ques})).value()
            state.currentQuestion = currentQuestionData
            state.allQuestionData = allQuestionData
            state.questionResponseData = action.payload.finalResponse
            state.pageWiseData = pageWiseData
            state.pageNumber = lastAttemptedPage != -1 ? lastAttemptedPage : 0 
            state.currentStartTime = moment().format("x")
            state.testStartTime = moment().format("x")
            state.examTotalTime = state.singleTestData.totalTime * 60000
            state.totalTimeTaken = action.payload.totalTimeTaken
        },

        [startTestAttemptAction.rejected]:(state) => {
            state.testAttemptStartStatus = STATUS.FAILED
        },

        [actionSubmitAction.pending]: (state, action) => {
            state.actionSubmitActionStatus = STATUS.FETCHING
        },

        [actionSubmitAction.fulfilled]: (state, action) => {
            state.actionSubmitActionStatus = STATUS.SUCCESS
            state.finalActionData = action.payload?.response?.testAttempt
            state.actionQueue = _.filter(state.actionQueue, q => q.id != action.payload.actionData.id)  
        },
        [actionSubmitAction.rejected]:(state) => {
            state.actionSubmitActionStatus = STATUS.FAILED
        },

    }
})

export const { toggleExamWindowAction, resetAllStatus, actionCalled } = OnlineExamSlice.actions
export const onlineExamReducer =  OnlineExamSlice.reducer