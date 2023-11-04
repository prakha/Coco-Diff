import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import React from 'react'
import { STATUS } from '../../../App/Constants'
import { apis } from '../../../services/api/apis'

export const getDashboardAction = createAsyncThunk(
    'get/dashboard',
    async (payload, thunkAPI) => {
        const response = await apis.getDashboardApi(payload)
        let {ok, data, problem} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    } 
)

let initialState = {}

const dashboardSlice = createSlice({
    name:'dashboard',
    initialState,
    reducers:{
        resetDashboard:state => {
            state.getDashboardStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [getDashboardAction.pending]:state => {
            state.getDashboardStatus = STATUS.FETCHING
        },
        [getDashboardAction.fulfilled]:(state, action) => {
            state.getDashboardStatus = STATUS.SUCCESS
            state.dashboardData = action.payload
        },
        [getDashboardAction.rejected]:state => {
            state.getDashboardStatus = STATUS.FAILED
        }
    }
})

export const {resetDashboard} = dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer 