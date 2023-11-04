import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import _ from 'lodash';
import { LoadingRef } from '../../App/AppProvider';
import { STATUS } from '../../App/Constants';
import { apis } from '../../services/api/apis';

export const requestCourseTrackingsAction = createAsyncThunk(
  'trackings/get',
  async (payload, thunkAPI) => {
    LoadingRef.current.show()
    const response = await apis.getCourseTrackingApi(payload);
    LoadingRef.current.hide()
    const {ok, problem, data} = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  },
);

export const postTrackingAction = createAsyncThunk(
  'tracking/post',
  async (payload, thunkAPI) => {
    const response = await apis.addCourseTrackingApi(payload);
    const {ok, problem, data} = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  },
);

const getTrackingMapped = trackings => {
  return _.reduce(
    trackings,
    (last, current, index, all) => {
      if (!last[current.parentContentId]) {
        last[current.parentContentId] = {};
      }
      if (!last[current.parentContentId][current.objectType]) {
        last[current.parentContentId][current.objectType] = {};
      }
      last[current.parentContentId][current.objectType][current.objectId] =
        current;
      return last;
    },
    {},
  );
};

const getTrackingMappedUpdate = (update, trackings) => {
  if(trackings){
    if (!trackings[update.parentContentId]) {
      trackings[update.parentContentId] = {};
    }
    if (!trackings[update.parentContentId][update.objectType]) {
      trackings[update.parentContentId][update.objectType] = {};
    }
  
    trackings[update.parentContentId][update.objectType][update.objectId] =
      update;
  }
};

const initialState = {};

const trackingSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {},
  extraReducers: {
    [requestCourseTrackingsAction.pending]: (state, action) => {
      state.status = STATUS.FETCHING;
    },

    [requestCourseTrackingsAction.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
      state.error = action.payload;
    },

    [requestCourseTrackingsAction.fulfilled]: (state, action) => {
      state.status = STATUS.SUCCESS;
      // state.trackings = action.payload;

      const trackingsmapped = getTrackingMapped(action.payload);
      state.trackings = trackingsmapped;
    },

    [postTrackingAction.pending]: state => {
      state.addStatus = STATUS.FETCHING;
    },

    [postTrackingAction.fulfilled]: (state, action) => {
      state.addStatus = STATUS.SUCCESS;
      state.trackingUpdateData = action?.payload;
      getTrackingMappedUpdate(action.payload, state.trackings);
    },

    [postTrackingAction.rejected]: state => {
      state.addStatus = STATUS.FAILED;
    },
  },
});

// export const {setActiveStaff} = trackingSlice.actions;
export const trackingReducer = trackingSlice.reducer;
