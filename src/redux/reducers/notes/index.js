import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import _ from 'lodash'
import { STATUS } from '../../../App/Constants'
import { apis } from '../../../services/api/apis'

export const addNotesAction = createAsyncThunk(
    'create/notes',
    async(payload, thunkAPI) => {
        const response = await apis.addNotesApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return data
        }
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getNotesAction = createAsyncThunk(
    'get/notes',
    async(payload, thunkAPI) => {
        const response = await apis.getNotesApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return data
        }
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const deleteNoteAction = createAsyncThunk(
    'delete/notes',
    async(payload, thunkAPI) => {
        const response = await apis.deleteNoteApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return {data, extrdaData:payload}
        }
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const updateNoteAction = createAsyncThunk(
    'update/notes',
    async(payload, thunkAPI) => {
        const response = await apis.updateNoteApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return data
        }
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

let initialState = { notesList:[] }
const NotesSlice = createSlice({
    name:'notes',
    initialState,
    reducers:{},
    extraReducers:{
        [addNotesAction.pending]:state => {
            state.addNotesStatus = STATUS.FETCHING
        },
        [addNotesAction.fulfilled]:(state, action) => {
            state.addNotesStatus  = STATUS.SUCCESS
            state.notesList.push(action.payload)
        },
        [addNotesAction.rejected]:state => {
            state.addNotesStatus = STATUS.FAILED
        },

        [getNotesAction.pending]:state => {
            state.getNotesStatus = STATUS.FETCHING
        },
        [getNotesAction.fulfilled]:(state, action) => {
            state.getNotesStatus  = STATUS.SUCCESS
            state.notesList = action.payload
        },
        [getNotesAction.rejected]:state => {
            state.getNotesStatus = STATUS.FAILED
        },

        [deleteNoteAction.pending]:state => {
            state.deleteNoteStatus = STATUS.FETCHING
        },
        [deleteNoteAction.fulfilled]:(state, action) => {
            state.deleteNoteStatus  = STATUS.SUCCESS
            _.remove(state.notesList,d => d._id === action.payload.extrdaData.noteId)
        },
        [deleteNoteAction.rejected]:state => {
            state.deleteNoteStatus = STATUS.FAILED
        },

        [updateNoteAction.pending]:state => {
            state.updateNoteStatus = STATUS.FETCHING
        },
        [updateNoteAction.fulfilled]:(state, action) => {
            state.updateNoteStatus  = STATUS.SUCCESS
            let indx = _.findIndex(state.notesList,l => l._id === action.payload._id)

            if(indx !== -1)
                state.notesList[indx].note = action.payload.note
        },
        [updateNoteAction.rejected]:state => {
            state.updateNoteStatus = STATUS.FAILED
        }
    }
})

export const notesReducer = NotesSlice.reducer