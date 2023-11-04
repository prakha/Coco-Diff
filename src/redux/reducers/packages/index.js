import { LoadingRef } from "../../../App/AppProvider"
import { STATUS } from "../../../App/Constants"
import { apis } from "../../../services/api/apis"
import _ from 'lodash'
import { setStudentData } from "../user"

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

export const getWebsitePackageAction = createAsyncThunk(
    "website/packages",
    async (payload, thunkAPI) => {
        const response = await apis.getWebsitePackageApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getPackagesAction = createAsyncThunk(
    'packages/all',
    async (payload, thunkAPI) => {
        const response = await apis.getPackagesApi(payload)
        const { ok, problem, data } = response

        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getSinglePackageAction = createAsyncThunk(
    'packages/get',
    async (payload, thunkAPI) => {
        const response = await apis.getSinglePackageApi(payload)
        const { ok, problem, data } = response

        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const addReviewAction = createAsyncThunk(
    'review/add',
    async (payload, thunkAPI) => {
        const response = await apis.addReviewApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const delReviewAction = createAsyncThunk(
    'review/del',
    async (payload, thunkAPI) => {
        const response = await apis.delReviewApi(payload)
        const { ok, problem, data } = response

        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getReviewAction = createAsyncThunk(
    'review/get',
    async (payload, thunkAPI) => {
        console.log({ "review": payload })
        const response = await apis.getReviewApi(payload)
        const { ok, problem, data } = response

        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const studentAttemptsAction = createAsyncThunk(
    'studentAttempts',
    async (payload, thunkAPI) => {
        const response = await apis.getStudentTestAttemptsApi(payload)
        const { ok, problem, data } = response

        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getPkgContentsAction = createAsyncThunk(
    'student/package',
    async (payload, thunkAPI) => {
        LoadingRef.current.show()
        const response = await apis.getPkgContentsApi(payload)
        LoadingRef.current.hide()
        const { ok, problem, data } = response

        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getTrialPkgContentsAction = createAsyncThunk(
    'student/package/trial',
    async (payload, thunkAPI) => {
        LoadingRef.current.show()
        const response = await apis.getPkgContentsApi(payload)
        LoadingRef.current.hide()
        const { ok, problem, data } = response

        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getTestSyllabusAction = createAsyncThunk(
    'student/testSyllabus',
    async (payload, thunkAPI) => {
        LoadingRef.current.show()
        const response = await apis.getTestSyllabusApi(payload)
        LoadingRef.current.hide()
        const { ok, problem, data } = response

        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const unlockPackageAction = createAsyncThunk(
    'package-unlock/post',
    async (payload, thunkAPI) => {
        LoadingRef.current.show()
        const response = await apis.unlockPackageApi(payload)
        LoadingRef.current.hide()
        const { ok, problem, data } = response

        if (ok) {
            LoadingRef.current.showToast({
                status: "success",
                "title": "Package Unlocked",
            })
            thunkAPI.dispatch(setStudentData({ student: data }))
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getAssignmentAttemptsAction = createAsyncThunk(
    'student/assignmentAttempts',
    async (payload, thunkAPI) => {
        LoadingRef.current.show()
        const response = await apis.getAssignmentAttemptsApi(payload)
        LoadingRef.current.hide()
        const { ok, problem, data } = response

        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getStudentRollAction = createAsyncThunk(
    'student-roll/get',
    async (payload, thunkAPI) => {
        const response = await apis.getStudentRollApi(payload)
        const { ok, problem, data } = response

        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const packageReportAction = createAsyncThunk(
    'package-performance/get',
    async (payload, thunkAPI) => {
        LoadingRef.current.show()
        const response = await apis.packageReportApi(payload)
        LoadingRef.current.hide()
        const { ok, problem, data } = response

        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getPackageDemoAction = createAsyncThunk(
    'packages-demo/get',
    async (payload, thunkAPI) => {
        LoadingRef.current.show()
        const response = await apis.getPackageDemoApi(payload)
        LoadingRef.current.hide()
        const { ok, problem, data } = response

        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const initialState = { packagesList: [], reviewsList: [] }

export const PackageSlice = createSlice({
    name: 'package',
    initialState,
    reducers: {
        resetGetSinglePkg: (state) => {
            state.getSinglePackgStatus = STATUS.NOT_STARTED
            state.currentPackage = {}
        },

        resetAddPackage: (state) => {
            state.addPackageStatus = STATUS.NOT_STARTED
            state.updatePkgStatus = STATUS.NOT_STARTED
        },

        updateAssignmentSubmission: (state, action) => {
            state.packageContents.assignments = state.packageContents.assignments.map(a => {
                if (a._id === action.payload.assignmentId) {
                    a.submissions = [action.payload]
                }
                return a
            }
            )
        }
    },
    extraReducers: {



        [getWebsitePackageAction.pending]: (state) => {
            state.getWebsitePackageStatus = STATUS.FETCHING
        },
        [getWebsitePackageAction.fulfilled]: (state, action) => {
            console.log({ action: action })
            const body = action.payload
            state.getWebsitePackageStatus = STATUS.SUCCESS
            state.packagesList = body.packages
            state.config = body.config || {}
            state.notices = body.notices
            state.events = body.events
            
        },
        [getWebsitePackageAction.rejected]: (state) => {
            state.getWebsitePackageStatus = STATUS.FAILED
        },

        [getPackageDemoAction.pending]: (state) => {
            state.getPackageDemoStatus = STATUS.FETCHING
        },
        [getPackageDemoAction.fulfilled]: (state, action) => {
            state.getPackageDemoStatus = STATUS.SUCCESS
            state.packageDemoContent = action.payload
        },
        [getPackageDemoAction.rejected]: (state) => {
            state.getPackageDemoStatus = STATUS.FAILED
        },

        [packageReportAction.pending]: (state) => {
            state.packageReportStatus = STATUS.FETCHING
        },
        [packageReportAction.fulfilled]: (state, action) => {
            state.packageReportStatus = STATUS.SUCCESS
            state.packageReport = action.payload
        },
        [packageReportAction.rejected]: (state) => {
            state.packageReportStatus = STATUS.FAILED
        },

        [getStudentRollAction.pending]: (state) => {
            state.getStudentRollStatus = STATUS.FETCHING
        },
        [getStudentRollAction.fulfilled]: (state, action) => {
            state.getStudentRollStatus = STATUS.SUCCESS
            state.studentRoll = action.payload
        },
        [getStudentRollAction.rejected]: (state) => {
            state.getStudentRollStatus = STATUS.FAILED
        },

        [unlockPackageAction.pending]: (state) => {
            state.unlockPackageStatus = STATUS.FETCHING
        },
        [unlockPackageAction.fulfilled]: (state, action) => {
            state.unlockPackageStatus = STATUS.SUCCESS
        },
        [unlockPackageAction.rejected]: (state) => {
            state.unlockPackageStatus = STATUS.FAILED
        },

        [getReviewAction.pending]: (state) => {
            state.getReviewStatus = STATUS.FETCHING
        },
        [getReviewAction.fulfilled]: (state, action) => {
            state.getReviewStatus = STATUS.SUCCESS
            state.reviewsList = action.payload
        },
        [getReviewAction.rejected]: (state) => {
            state.getReviewStatus = STATUS.FAILED
        },

        [addReviewAction.pending]: (state) => {
            state.addReviewStatus = STATUS.FETCHING
        },
        [addReviewAction.fulfilled]: (state, action) => {
            state.delReviewStatus = STATUS.NOT_STARTED
            state.getReviewStatus = STATUS.NOT_STARTED
            state.addReviewStatus = STATUS.SUCCESS
            state.reviewsList = [...state.reviewsList, action.payload]
        },
        [addReviewAction.rejected]: (state) => {
            state.addReviewStatus = STATUS.FAILED
        },

        [delReviewAction.pending]: (state) => {
            state.delReviewStatus = STATUS.FETCHING
        },
        [delReviewAction.fulfilled]: (state, action) => {
            state.addReviewStatus = STATUS.NOT_STARTED
            state.getReviewStatus = STATUS.NOT_STARTED
            state.delReviewStatus = STATUS.SUCCESS
            _.remove(state.reviewsList, r => r._id === action.payload._id)
        },
        [delReviewAction.rejected]: (state) => {
            state.delReviewStatus = STATUS.FAILED
        },

        [getPackagesAction.pending]: (state) => {
            state.getPackagesStatus = STATUS.FETCHING
        },
        [getPackagesAction.fulfilled]: (state, action) => {
            state.getPackagesStatus = STATUS.SUCCESS
            state.packagesList = action.payload
        },
        [getPackagesAction.rejected]: (state) => {
            state.getPackagesStatus = STATUS.FAILED
        },

        [getSinglePackageAction.pending]: (state) => {
            state.getSinglePackgStatus = STATUS.FETCHING
        },
        [getSinglePackageAction.fulfilled]: (state, action) => {
            state.getSinglePackgStatus = STATUS.SUCCESS
            state.currentPackage = action.payload
            //state.currentPackageReviews = action.payload?.[0]?.reviews
        },
        [getSinglePackageAction.rejected]: (state) => {
            state.getSinglePackgStatus = STATUS.FAILED
        },

        [studentAttemptsAction.pending]: (state) => {
            state.studentAttemptsStatus = STATUS.FETCHING
        },
        [studentAttemptsAction.fulfilled]: (state, action) => {
            state.studentAttemptsStatus = STATUS.SUCCESS
            state.attemptsData = action?.payload[0]
        },
        [studentAttemptsAction.rejected]: (state) => {
            state.studentAttemptsStatus = STATUS.FAILED
        },

        [getPkgContentsAction.pending]: (state) => {
            state.getPkgContentsStatus = STATUS.FETCHING
        },
        [getPkgContentsAction.fulfilled]: (state, action) => {
            state.getPkgContentsStatus = STATUS.SUCCESS
            console.log('payload', action.payload)
            state.packageContents = {
                ...action.payload,
                courses: action.payload.courses?.map(c => {
                    const subjects = c.subjects.map(s => {
                        return {
                            ...s,
                            countVideos: _.size(s.content?.videos) || 0,
                            countAudios: _.size(s.content?.audios) || 0,
                            countDocs: _.size(s.content?.documents) || 0,
                            countTexts: _.size(s.content?.texts) || 0,
                        };
                    });

                    return {
                        ...c,
                        subjects,
                        countVideos: _.sumBy(subjects, s => s.countVideos),
                        countAudios: _.sumBy(subjects, s => s.countAudios),
                        countDocs: _.sumBy(subjects, s => s.countDocs),
                        countTexts: _.sumBy(subjects, s => s.countTexts),
                    };
                })
            }
        },
        [getPkgContentsAction.rejected]: (state) => {
            state.getPkgContentsStatus = STATUS.FAILED
        },

        [getTestSyllabusAction.pending]: (state) => {
            state.getTestSyllabusStatus = STATUS.FETCHING
        },
        [getTestSyllabusAction.fulfilled]: (state, action) => {
            state.getTestSyllabusStatus = STATUS.SUCCESS
            state.testSyllabusData = action.payload
        },
        [getTestSyllabusAction.rejected]: (state) => {
            state.getTestSyllabusStatus = STATUS.FAILED
        },

        [getAssignmentAttemptsAction.pending]: (state) => {
            state.assignmentAttemptsStatus = STATUS.FETCHING
        },
        [getAssignmentAttemptsAction.fulfilled]: (state, action) => {
            state.assignmentAttemptsStatus = STATUS.SUCCESS
            state.assignmentAttemptsData = action.payload
        },
        [getAssignmentAttemptsAction.rejected]: (state) => {
            state.assignmentAttemptsStatus = STATUS.FAILED
        },
    }

})


export const { resetGetSinglePkg, resetAddPackage, updateAssignmentSubmission } = PackageSlice.actions
export const packageReducer = PackageSlice.reducer