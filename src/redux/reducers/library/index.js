import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import _ from "lodash"
import { STATUS } from "../../../App/Constants"
import { apis } from "../../../services/api/apis"

export const getLibraryAction = createAsyncThunk(
  "user-library/get",
  async (payload, thunkAPI) => {
    const response = await apis.getLibContentApi({...payload, type:'Library'})
    const { ok, problem, data } = response
    if (ok) {
      return {data, extraData:payload}
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getLibFoldersAction = createAsyncThunk(
  "user-library/get/folders",
  async (payload, thunkAPI) => {
    const response = await apis.getLibContentApi({...payload, type:'Library'})
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getUserLibFilesAction = createAsyncThunk(
  'library/get',
  async (payload, thunkAPI) => {
    const response = await apis.getUserLibraryFilesApi(payload);
    const {ok, problem, data} = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  },
);

export const createLibraryAction = createAsyncThunk(
  "user-library/post",
  async (payload, thunkAPI) => {
    const response = await apis.createLibFolderApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

// dumped code
export const addToLibraryAction = createAsyncThunk(
    "user-library/patch",
    async (payload, thunkAPI) => {
      const response = await apis.addToLibraryApi(payload)
      const { ok, problem, data } = response
      if (ok) {
        return data
      } else {
          return thunkAPI.rejectWithValue(problem)
      }
    }
  )

export const removeFromLibAction = createAsyncThunk(
    "user-library/remove",
    async (payload, thunkAPI) => {
      const response = await apis.removeFromLibApi(payload)
      const { ok, problem, data } = response
      if (ok) {
        return data
      } else {
          return thunkAPI.rejectWithValue(problem)
      }
    }
  )

export const addFolderAction = createAsyncThunk(
    "folder/add",
    async (payload, thunkAPI) => {
      const response = await apis.addFolderApi({...payload})
      const { ok, problem, data } = response
      if (ok) {
        return data
      } else {
          return thunkAPI.rejectWithValue(data)
      }
    }
)

export const addChildFolderAction = createAsyncThunk(
  "folder-child/add",
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

export const getFoldersAction = createAsyncThunk(
  "folder/get",
  async (payload, thunkAPI) => {
    const response = await apis.getLibContentApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const updateFolderAction = createAsyncThunk(
  "folder/update",
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

export const deleteFolderAction = createAsyncThunk(
  "folder/delete",
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

export const removeFolderAction = createAsyncThunk(
  "folder/remove",
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

export const moveFromLibraryAction = createAsyncThunk(
  "user-library/move",
  async (payload, thunkAPI) => {
    const response = await apis.moveFromLibraryApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getFileAction = createAsyncThunk(
  "get/file",
  async (payload, thunkAPI) => {
    const response = await apis.getFileApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const removeLibFileAction = createAsyncThunk(
  "remove/file",
  async (payload, thunkAPI) => {
    const response = await apis.removeLibFileApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const moveLibFileAction = createAsyncThunk(
  "move/file",
  async (payload, thunkAPI) => {
    const response = await apis.moveLibFileApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return {data, extraData:payload}
    } else {
        return thunkAPI.rejectWithValue(problem)
    }
  }
)

const initialState = {libFiles:[], libraryFolders:[]}

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    resetAddFolderStatus:(state) => {
      state.addFolderStatus = STATUS.NOT_STARTED
      state.addChildFolderStatus = STATUS.NOT_STARTED
      state.updateFolderStatus = STATUS.NOT_STARTED
      state.folderError = null
    }, 

    resetGetFolders : (state) => {
      state.getFoldersStatus = STATUS.NOT_STARTED
      state.updateFolderStatus = STATUS.NOT_STARTED
      state.addToLibraryStatus = STATUS.NOT_STARTED
      state.getLibFoldersStatus = STATUS.NOT_STARTED
      state.libraryContent = null
    },

    resetMoveLibFile : (state) => {
      state.moveLibFileStatus = STATUS.NOT_STARTED
    }
  },
  extraReducers: {
    [moveLibFileAction.pending]: (state) => {
        state.moveLibFileStatus = STATUS.FETCHING
    },
    [moveLibFileAction.rejected]: (state) => {
        state.moveLibFileStatus = STATUS.FAILED
    },
    [moveLibFileAction.fulfilled]: (state, action) => {
        state.moveLibFileStatus = STATUS.SUCCESS
        if(action.payload.extraData.folderId != state.libraryContent._id)
          _.remove(state.libraryContent.files,f => f._id == action.payload.extraData.fileId)
    },
    
    [addToLibraryAction.pending]: (state) => {
        state.addToLibraryStatus = STATUS.FETCHING
    },
    [addToLibraryAction.rejected]: (state, action) => {
        state.addToLibraryStatus = STATUS.FAILED
    },
    [addToLibraryAction.fulfilled]: (state, action) => {
        state.addToLibraryStatus = STATUS.SUCCESS
        state.libFiles.push(action.payload)
    },

    [getLibFoldersAction.pending]: (state) => {
        state.getLibFoldersStatus = STATUS.FETCHING
    },
    [getLibFoldersAction.rejected]: (state, action) => {
        state.getLibFoldersStatus = STATUS.FAILED
    },
    [getLibFoldersAction.fulfilled]: (state, action) => {
        state.getLibFoldersStatus = STATUS.SUCCESS
        state.libraryFolders = action.payload.childFolders
    },
    
    [removeLibFileAction.pending]: (state) => {
        state.removeLibFileStatus = STATUS.FETCHING
    },
    [removeLibFileAction.rejected]: (state) => {
        state.removeLibFileStatus = STATUS.FAILED
    },
    [removeLibFileAction.fulfilled]: (state, action) => {
        state.removeLibFileStatus = STATUS.SUCCESS
        state.libraryContent && _.remove(state.libraryContent.files,f => f._id == action.payload._id)
    
      if(state.libFiles?.length){
        _.remove(state.libFiles,l => l._id === action.payload._id)
      }
    },

    [getFileAction.pending]: (state) => {
        state.getFileStatus = STATUS.FETCHING
    },
    [getFileAction.rejected]: (state) => {
        state.getFileStatus = STATUS.FAILED
    },
    [getFileAction.fulfilled]: (state, action) => {
        state.getFileStatus = STATUS.SUCCESS
        state.currentFile = action.payload
    },
    
    [createLibraryAction.pending]: (state) => {
        state.createLibraryStatus = STATUS.FETCHING
    },
    [createLibraryAction.rejected]: (state, action) => {
        state.createLibraryStatus = STATUS.FAILED
    },
    [createLibraryAction.fulfilled]: (state, action) => {
        state.createLibraryStatus = STATUS.SUCCESS
        state.libraryContent = action.payload
    },
    
    [getLibraryAction.pending]: (state) => {
        state.getLibraryStatus = STATUS.FETCHING
    },
    [getLibraryAction.rejected]: (state, action) => {
        state.getLibraryStatus = STATUS.FAILED
        state.getLibraryError = action.error
    },
    [getLibraryAction.fulfilled]: (state, action) => {
        state.getLibraryStatus = STATUS.SUCCESS
        state.libraryContent = action.payload.data

        if(!state.libraryFolders?.length)
        state.libraryFolders = action.payload.data.childFolders
    },

    [getUserLibFilesAction.pending]: (state, action) => {
      state.filesStatus = STATUS.FETCHING;
    },

    [getUserLibFilesAction.rejected]: (state, action) => {
      state.filesStatus = STATUS.FAILED;
      state.error = action.payload;
    },

    [getUserLibFilesAction.fulfilled]: (state, action) => {
      state.filesStatus = STATUS.SUCCESS;
      if (action.payload) {
        state.libFiles = action.payload;
      }
    },

    [removeFromLibAction.pending]: (state) => {
        state.removeFromLibStatus = STATUS.FETCHING
    },
    [removeFromLibAction.rejected]: (state) => {
        state.removeFromLibStatus = STATUS.FAILED
    },
    [removeFromLibAction.fulfilled]: (state, action) => {
        state.removeFromLibStatus = STATUS.SUCCESS
        state.libraryContent =  {...action.payload, folders:state.libraryContent.childFolders}
    },

    [addFolderAction.pending]: (state) => {
        state.addFolderStatus = STATUS.FETCHING
    },
    [addFolderAction.rejected]: (state, action) => {
        state.addFolderStatus = STATUS.FAILED
        state.folderError = action.payload
    },
    [addFolderAction.fulfilled]: (state, action) => {
      state.addFolderStatus = STATUS.SUCCESS
      state.libraryFolders.push(action.payload)
    },

    [getFoldersAction.pending]: (state) => {
        state.getFoldersStatus = STATUS.FETCHING
    },
    [getFoldersAction.rejected]: (state) => {
        state.getFoldersStatus = STATUS.FAILED
    },
    [getFoldersAction.fulfilled]: (state, action) => {
        state.getFoldersStatus = STATUS.SUCCESS
        state.libraryContent = action.payload
    },

    [updateFolderAction.pending]: (state) => {
        state.updateFolderStatus = STATUS.FETCHING
    },
    [updateFolderAction.rejected]: (state, action) => {
        state.updateFolderStatus = STATUS.FAILED
        state.folderError = action.payload
    },
    [updateFolderAction.fulfilled]: (state, action) => {
        state.updateFolderStatus = STATUS.SUCCESS
        
        if(state.libraryContent || libraryFolders)
          // state.libraryContent.childFolders = state.libraryContent.childFolders.map(f => f._id == action.payload._id ? action.payload : f)
          state.libraryFolders = state.libraryFolders.map(f => f._id == action.payload._id ? action.payload : f)

        },

    [removeFolderAction.pending]: (state) => {
        state.removeFolderStatus = STATUS.FETCHING
    },
    [removeFolderAction.rejected]: (state) => {
        state.removeFolderStatus = STATUS.FAILED
    },
    [removeFolderAction.fulfilled]: (state, action) => {
        state.removeFolderStatus = STATUS.SUCCESS
        // _.remove(state.libraryContent?.childFolders || [], d => d?._id == action.payload.folderId)
        _.remove(state.libraryFolders || [], d => d?._id == action.payload._id)
    },

    [moveFromLibraryAction.pending]: (state) => {
        state.moveFromLibraryStatus = STATUS.FETCHING
    },
    [moveFromLibraryAction.rejected]: (state) => {
        state.moveFromLibraryStatus = STATUS.FAILED
    },
    [moveFromLibraryAction.fulfilled]: (state, action) => {
        state.moveFromLibraryStatus = STATUS.SUCCESS
    },

  },
})

export const {resetGetFolders, resetAddFolderStatus, resetMoveLibFile} = librarySlice.actions
export const libraryReducer = librarySlice.reducer