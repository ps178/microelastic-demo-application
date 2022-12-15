import { createSlice } from "@reduxjs/toolkit";
import { logOut, quitVisit } from "./utilitySlice";
const initialState = {
  // connectionFetching: false,
  connected: false,
  serialNumber: null,
  simulate: false,
  serverVersion: null,
  calibGelThickness: null,
  calibGelSws: null,
  isHealthy: false,
  acquiring: false,
  aLineData: {},
  autoAdvace: true,
  // deviceLocation: null,
  // lastSetLocation: { location: null, sampleType: null },
};
export const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    resetDeviceHealthCheck: (draft) => {
      draft.isHealthy = false;
    },
    setDeviceInfo: (draft, action) => {
      draft.connected = true;
      draft.serialNumber = action.payload.serialNumber;
      draft.simulate = action.payload.simulate;
    },
    setDeviceHeath: (draft, action) => {
      draft.calibGelThickness = action.payload.calibGelThickness;
      draft.calibGelSws = action.payload.calibGelSws;
      draft.isHealthy = action.payload.isHealthy;
    },
    setAcquiring: (draft, action) => {
      draft.acquiring = action.payload;
    },
    setAlineData: (draft, action) => {
      draft.aLineData = action.payload;
    },
    closeDevice: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(logOut, () => initialState);
    builder.addCase(quitVisit, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const {
  resetDeviceHealthCheck,
  setDeviceInfo,
  setDeviceHeath,
  closeDevice,
  setAcquiring,
  setAlineData,
} = deviceSlice.actions;

export default deviceSlice.reducer;
