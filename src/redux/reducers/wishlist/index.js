import { LoadingRef } from "../../../App/AppProvider"
import { STATUS } from "../../../App/Constants"
import { apis } from "../../../services/api/apis"

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

export const addToWishlistAction = createAsyncThunk(
    'wishlist/add',
    async(payload, thunkAPI) => {
        const response = await apis.addToWishlistApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getWishlistAction = createAsyncThunk(
    'wishlist/get',
    async(payload, thunkAPI) => {
        LoadingRef.current.show()
        const response = await apis.getWishlistApi(payload)
        LoadingRef.current.hide()
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const rmvFromWishlistAciton = createAsyncThunk(
    'wishlist/remove',
    async(payload, thunkAPI) => {
        const response = await apis.rmvFromWishlistApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return {data, extraData:payload}
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const initialState = { }

export const WishlistSlice = createSlice({
    name:'wishlist',
    initialState,
    reducers:{

    },
    extraReducers:{
        [addToWishlistAction.pending]: (state) => {
            state.addWishlistStatus = STATUS.FETCHING
        },
        [addToWishlistAction.fulfilled]: (state, action) => {
            state.addWishlistStatus = STATUS.SUCCESS
            state.wishlistPackages = action.payload
        },
        [addToWishlistAction.rejected]:(state) => {
            state.addWishlistStatus = STATUS.FAILED
        },

        [getWishlistAction.pending]: (state) => {
            state.getWishlistStatus = STATUS.FETCHING
        },
        [getWishlistAction.fulfilled]: (state, action) => {
            state.getWishlistStatus = STATUS.SUCCESS,
            state.wishlistPackages = action.payload
        },
        [getWishlistAction.rejected]:(state) => {
            state.getWishlistStatus = STATUS.FAILED
        },

        [rmvFromWishlistAciton.pending]: (state) => {
            state.rmvFromWishlistStatus = STATUS.FETCHING
        },
        [rmvFromWishlistAciton.fulfilled]: (state, action) => {
            state.rmvFromWishlistStatus = STATUS.SUCCESS
            _.remove(state.wishlistPackages.packages,p => p._id == action.payload.extraData.packageId)
        },
        [rmvFromWishlistAciton.rejected]:(state) => {
            state.rmvFromWishlistStatus = STATUS.FAILED
        },
    }

})


export const {} = WishlistSlice.actions
export const wishListReducer =  WishlistSlice.reducer
