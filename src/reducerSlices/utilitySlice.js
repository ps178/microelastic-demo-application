import { createSelector, createSlice } from "@reduxjs/toolkit";
import pageIds, { locationSubviews } from "../constants/pageMap";

const initialState = {
  themeMode: "dark",
  pageId: pageIds.loginPage,
  locationSubview: locationSubviews.locationInformation,

  showCompletedLocations: true,
  showExcludedSamples: true,

  selectedLocationId: null,
  selectedSampleId: null,

  wifi: {
    availableNetworks: [],
    fetchingCheckWifi: false,
    wifiConnection: false,
    fetchingWifiConnection: false,
  },
  dateTime: {
    fetchingDateTime: false,
    currentDateTime: null,
    dateTimeSet: false,
  },

  snackbar: {
    type: null,
    status: false,
    message: null,
  },

  // error: {
  //   status: false,
  //   message: null,
  // },
  // warning: {
  //   status: false,
  //   message: null,
  // },
  // success: {
  //   status: false,
  //   message: null,
  // },
};

export const utilitySlice = createSlice({
  name: "utility",
  initialState,
  reducers: {
    updateSnackbarStatus: (draft, action) => {
      draft.snackbar.type = action.payload.type;
      draft.snackbar.status = true;
      draft.snackbar.message = action.payload.message;
    },

    resetSnackbar: (draft, action) => {
      draft.snackbar.type = null;
      draft.snackbar.status = false;
      draft.snackbar.message = null;
    },

    logOut: () => initialState,

    quitVisit: (draft) => ({
      ...initialState,
      wifi: draft.dateTime,
      datetime: draft.dateTime,
      pageId: pageIds.organizationPage,
    }),

    toggleAutoAdvance: (draft) => {
      draft.autoAdvace = !draft.autoAdvace;
    },

    // updateSnackbarStatus: (draft, action) => {
    //   draft.error.status = action.payload.status;
    //   draft.error.message = action.payload.message;
    // },
    // updateWarningStatus: (draft, action) => {
    //   draft.warning.status = action.payload.status;
    //   draft.warning.message = action.payload.message;
    // },
    // updateSuccessStatus: (draft, action) => {
    //   draft.success.status = action.payload.status;
    //   draft.success.message = action.payload.message;
    // },

    // resetError: (draft, action) => {
    //   draft.error.status = false;
    //   draft.error.message = null;
    // },
    // resetWarning: (draft, action) => {
    //   draft.warning.status = false;
    //   draft.warning.message = null;
    // },
    // resetSuccess: (draft, action) => {
    //   draft.success.status = false;
    //   draft.success.message = null;
    // },

    setPageId: (draft, action) => {
      draft.pageId = action.payload;
    },
    setLocationSubview: (draft, action) => {
      draft.locationSubview = action.payload;
    },
    toggleShowExcludedSamples: (draft) => {
      draft.showExcludedSamples = !draft.showExcludedSamples;
    },
    toggleShowCompletedLocations: (draft) => {
      draft.showCompletedLocations = !draft.showCompletedLocations;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  toggleAutoAdvance,
  updateSnackbarStatus,
  quitVisit,
  logOut,
  resetSnackbar,
  setPageId,
  toggleShowCompletedLocations,
  toggleShowExcludedSamples,
  setLocationSubview,
} = utilitySlice.actions;

export default utilitySlice.reducer;
