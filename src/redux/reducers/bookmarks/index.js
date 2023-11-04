import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import _ from "lodash"
import { STATUS } from "../../../App/Constants"
import { apis } from "../../../services/api/apis"

export const getBookmarkAction = createAsyncThunk(
  "user-bookmark/get",
  async (payload, thunkAPI) => {
    const response = await apis.getBkmrkContentApi({...payload, type:'Bookmark'})
    const { ok, problem, data } = response
    if (ok) {
      return {data, extraData:payload}
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getBkmrkFoldersAction = createAsyncThunk(
  "user-bookmark/get/folder",
  async (payload, thunkAPI) => {
    const response = await apis.getBkmrkContentApi({...payload, type:'Bookmark'})
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getBkmrkFilesAction = createAsyncThunk(
  'bookmark/get',
  async (payload, thunkAPI) => {
    const response = await apis.getBkmrkFilesApi(payload);
    const {ok, problem, data} = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  },
);

export const createBookmarkAction = createAsyncThunk(
  "user-bookmark/post",
  async (payload, thunkAPI) => {
    const response = await apis.createBookmarkApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const addToBookmarkAction = createAsyncThunk(
    "user-bookmark/patch",
    async (payload, thunkAPI) => {
      const response = await apis.addToBkmrkApi(payload)
      const { ok, problem, data } = response
      if (ok) {
        return data
      } else {
          return thunkAPI.rejectWithValue(problem)
      }
    }
  )

export const removeFromBkmrkAction = createAsyncThunk(
    "user-bookmark/remove",
    async (payload, thunkAPI) => {
      const response = await apis.removeBkmrkFileApi(payload)
      const { ok, problem, data } = response
      if (ok) {
        return data
      } else {
          return thunkAPI.rejectWithValue(problem)
      }
    }
  )

export const addBkmrkFolderAction = createAsyncThunk(
    "bkmrk-folder/add",
    async (payload, thunkAPI) => {
      const response = await apis.addFolderApi(payload)
      const { ok, problem, data } = response
      if (ok) {
        return data
      } else {
          return thunkAPI.rejectWithValue(data)
      }
    }
)

export const addBkmrkChildFolderAction = createAsyncThunk(
  "bkmrk-folder-child/add",
  async (payload, thunkAPI) => {
    const response = await apis.addFolderApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const updateBkmrkFolderAction = createAsyncThunk(
  "bkmrk-folder/update",
  async (payload, thunkAPI) => {
    const response = await apis.updateFolderApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(data)
    }
  }
)

export const deleteBkmrkFolderAction = createAsyncThunk(
  "bkmrk-folder/delete",
  async (payload, thunkAPI) => {
    const response = await apis.updateFolderApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const removeBkmrkFolderAction = createAsyncThunk(
  "bkmrk-folder/remove",
  async (payload, thunkAPI) => {
    const response = await apis.removeFolderApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const moveFromBookmarkAction = createAsyncThunk(
  "user-bookmark/move",
  async (payload, thunkAPI) => {
    const response = await apis.moveFromBookmarkApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const moveBkmrkFileAction = createAsyncThunk(
  "move/bookmark/file",
  async (payload, thunkAPI) => {
    const response = await apis.moveBkmrkFileApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return {data, extraData:payload}
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

const initialState = {bookmarkFolders:[], bkmrkFiles:[]}

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    resetAddFolderStatus:(state) => {
      // state.getBkmrkFoldersStatus = STATUS.NOT_STARTED
      state.addBkmrkChildFolderStatus = STATUS.NOT_STARTED
      state.updateBkmrkFolderStatus = STATUS.NOT_STARTED
      state.addBkmrkFolderStatus = STATUS.NOT_STARTED
      state.folderError = null
    }, 

    resetGetFolders : (state) => {
      state.getBkmrkFoldersStatus = STATUS.NOT_STARTED
      state.updateBkmrkFolderStatus = STATUS.NOT_STARTED
      state.addToBookmarkStatus = STATUS.NOT_STARTED,
      state.bookmarkContent = null
    },

    resetMoveLibFile : (state) => {
      state.moveBkmrkFileStatus = STATUS.NOT_STARTED
    }
  },
  extraReducers: {
    [moveBkmrkFileAction.pending]: (state) => {
        state.moveBkmrkFileStatus = STATUS.FETCHING
    },
    [moveBkmrkFileAction.rejected]: (state) => {
        state.moveBkmrkFileStatus = STATUS.FAILED
    },
    [moveBkmrkFileAction.fulfilled]: (state, action) => {
        state.moveBkmrkFileStatus = STATUS.SUCCESS
        if(action.payload.extraData.folderId != state.bookmarkContent._id)
          _.remove(state.bookmarkContent.files,f => f._id == action.payload.extraData.fileId)
    },

    [getBookmarkAction.pending]: (state) => {
        state.getBookmarkStatus = STATUS.FETCHING
    },
    [getBookmarkAction.rejected]: (state, action) => {
        state.getBookmarkStatus = STATUS.FAILED
        state.getBookmarkError = action.error.data
    },
    [getBookmarkAction.fulfilled]: (state, action) => {
        state.getBookmarkStatus = STATUS.SUCCESS
        state.bookmarkContent = action.payload.data

        if(!state.bookmarkFolders?.length)
          state.bookmarkFolders = action.payload.data.childFolders
    },

    [getBkmrkFilesAction.pending]: (state) => {
        state.getBkmrkFilesStatus = STATUS.FETCHING
    },
    [getBkmrkFilesAction.rejected]: (state, action) => {
        state.getBkmrkFilesStatus = STATUS.FAILED
    },
    [getBkmrkFilesAction.fulfilled]: (state, action) => {
        state.getBkmrkFilesStatus = STATUS.SUCCESS
        if (action.payload) {
          state.bkmrkFiles = action.payload
        }
    },

    [createBookmarkAction.pending]: (state) => {
        state.createBookmarkStatus = STATUS.FETCHING
    },
    [createBookmarkAction.rejected]: (state, action) => {
        state.createBookmarkStatus = STATUS.FAILED
    },
    [createBookmarkAction.fulfilled]: (state, action) => {
        state.createBookmarkStatus = STATUS.SUCCESS
        state.bookmarkContent = action.payload
    },

    [addToBookmarkAction.pending]: (state) => {
        state.addToBookmarkStatus = STATUS.FETCHING
    },
    [addToBookmarkAction.rejected]: (state) => {
        state.addToBookmarkStatus = STATUS.FAILED
    },
    [addToBookmarkAction.fulfilled]: (state, action) => {
        state.addToBookmarkStatus = STATUS.SUCCESS
        state.bkmrkFiles.push(action.payload)
    },

    [removeFromBkmrkAction.pending]: (state) => {
        state.removeFromBkmrkStatus = STATUS.FETCHING
    },
    [removeFromBkmrkAction.rejected]: (state) => {
        state.removeFromBkmrkStatus = STATUS.FAILED
    },
    [removeFromBkmrkAction.fulfilled]: (state, action) => {
        state.removeFromBkmrkStatus = STATUS.SUCCESS
        state.bookmarkContent && _.remove(state.bookmarkContent.files,f => f._id == action.payload._id)
    
        if(state.bkmrkFiles?.length){
          _.remove(state.bkmrkFiles,l => l._id === action.payload._id)
        }
    },

    [addBkmrkFolderAction.pending]: (state) => {
        state.addBkmrkFolderStatus = STATUS.FETCHING
    },
    [addBkmrkFolderAction.rejected]: (state, action) => {
        state.addBkmrkFolderStatus = STATUS.FAILED
        state.folderError = action.payload
    },
    [addBkmrkFolderAction.fulfilled]: (state, action) => {
        state.addBkmrkFolderStatus = STATUS.SUCCESS
        state.bookmarkFolders.push(action.payload)
      },

    [addBkmrkChildFolderAction.pending]: (state) => {
        state.addBkmrkChildFolderStatus = STATUS.FETCHING
    },
    [addBkmrkChildFolderAction.rejected]: (state) => {
        state.addBkmrkChildFolderStatus = STATUS.FAILED
    },
    [addBkmrkChildFolderAction.fulfilled]: (state, action) => {
        state.addBkmrkChildFolderStatus = STATUS.SUCCESS

        if(state.folderContent.childFolders)
          state.folderContent.childFolders.push(action.payload)
        else
          state.folderContent.childFolders = [action.payload]

    },

    [getBkmrkFoldersAction.pending]: (state) => {
        state.getBkmrkFoldersStatus = STATUS.FETCHING
    },
    [getBkmrkFoldersAction.rejected]: (state) => {
        state.getBkmrkFoldersStatus = STATUS.FAILED
    },
    [getBkmrkFoldersAction.fulfilled]: (state, action) => {
        state.getBkmrkFoldersStatus = STATUS.SUCCESS
        state.bookmarkFolders = action.payload.childFolders
    },

    [deleteBkmrkFolderAction.pending]: (state) => {
        state.deleteBkmrkFolderStatus = STATUS.FETCHING
    },
    [deleteBkmrkFolderAction.rejected]: (state) => {
        state.deleteBkmrkFolderStatus = STATUS.FAILED
    },
    [deleteBkmrkFolderAction.fulfilled]: (state, action) => {
        state.deleteBkmrkFolderStatus = STATUS.SUCCESS
        state.folderContent = {...action.payload, folders:state.folderContent?.childFolders || []}
    },

    [updateBkmrkFolderAction.pending]: (state) => {
        state.updateBkmrkFolderStatus = STATUS.FETCHING
    },
    [updateBkmrkFolderAction.rejected]: (state, aciton) => {
        state.updateBkmrkFolderStatus = STATUS.FAILED
        state.folderError = aciton.payload
    },
    [updateBkmrkFolderAction.fulfilled]: (state, action) => {
        state.updateBkmrkFolderStatus = STATUS.SUCCESS
        if(state.bookmarkContent)
          // state.bookmarkContent.childFolders = state.bookmarkContent.childFolders.map(f => f._id == action.payload._id ? action.payload : f)
          state.bookmarkFolders = state.bookmarkFolders.map(f => f._id == action.payload._id ? action.payload : f)
    },

    [removeBkmrkFolderAction.pending]: (state) => {
        state.removeBkmrkFolderStatus = STATUS.FETCHING
    },
    [removeBkmrkFolderAction.rejected]: (state) => {
        state.removeBkmrkFolderStatus = STATUS.FAILED
    },
    [removeBkmrkFolderAction.fulfilled]: (state, action) => {
        state.removeBkmrkFolderStatus = STATUS.SUCCESS
        // _.remove(state.bookmarkContent?.childFolders || [], d => d?._id == action.payload._id)
        _.remove(state.bookmarkFolders || [], d => d?._id == action.payload._id)
    },

    [moveFromBookmarkAction.pending]: (state) => {
        state.moveFromBookmarkStatus = STATUS.FETCHING
    },
    [moveFromBookmarkAction.rejected]: (state) => {
        state.moveFromBookmarkStatus = STATUS.FAILED
    },
    [moveFromBookmarkAction.fulfilled]: (state, action) => {
        state.moveFromBookmarkStatus = STATUS.SUCCESS
    },

  },
})

export const {resetGetFolders, resetAddFolderStatus, resetMoveLibFile} = bookmarkSlice.actions
export const bookmarkReducer = bookmarkSlice.reducer