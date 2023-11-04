import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { STATUS } from '../../../App/Constants'
import { apis } from '../../../services/api/apis'
import _ from 'lodash'

export const getNotificationsAciton = createAsyncThunk(
    'get/notifications',
    async (payload, thunkAPI) => {
        const response = await apis.getNotificationsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)


const initialState = {notificationList:[]}

const notificationslice = createSlice({
    name:'notifications',
    initialState,
    reducers:{},
    extraReducers:{
        [getNotificationsAciton.pending]:(state) => {
            state.getNotificationsStatus = STATUS.FETCHING
        },
        [getNotificationsAciton.fulfilled]:(state, action) => {
            state.getNotificationsStatus = STATUS.SUCCESS
            const data = action.payload;
            if (data?.page === 1) {
                state.notificationList = data?.docs;
            } else {
                state.notificationList = _.concat(state.notificationList, data?.docs || []);
            }
            
            state.pageData = data && {
                limit: data.limit,
                page: data.page,
                pages: data.pages,
                total: data.total,
            }
        },
        [getNotificationsAciton.rejected]:(state, action) => {
            state.getNotificationsStatus = STATUS.FAILED
        },
    }
})

export const notificationReducer = notificationslice.reducer 