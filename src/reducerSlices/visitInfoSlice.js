import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
// import { bullseyeDevice } from "./api";
import { setUser } from "./userSlice";
import { quitVisit, logOut } from "./utilitySlice";
import visit1 from "../constants/fixtureFiles/visit1.json";
import visit2 from "../constants/fixtureFiles/visit2.json";

import { fetchLoadLocalVisit } from "./protocolSlice";
const allVisits = {
  visit1: visit1,
  visit2: visit2,
};
const initialState = {
  organizationId: null,
  organizationName: null,
  protocolId: null,
  protocolName: null,
  visitId: null,
  participantId: null,
  participantSecondaryId: null,
  visitProgress: 0,
  softwareVersion: null,
  visitDate: null,
  visitHash: null,
  username: null,
  visitSaved: false,
  visitNotes: "",
  allDataLocal: true,
  // requestSave: false,
  saveFolder: null,
  saveFilename: null,
  wipFolder: null,
};
export const visitInfoSlice = createSlice({
  name: "visitInfo",
  initialState,
  reducers: {
    setVisitInformation: (draft, action) => {
      draft.organizationId = action.payload.organizationId;
      draft.organizationName = action.payload.organizationName;
      draft.participantId = action.payload.participantId;
      draft.participantSecondaryId = action.payload.participantSecondaryId;
      draft.protocolId = action.payload.protocolId;
      draft.protocolName = action.payload.protocolName;
      draft.visitDate = action.payload.visitDate;
      draft.visitId = action.payload.visitId;
      draft.wipFolder = action.payload.wipFolder;
      draft.saveFolder = action.payload.saveFolder;
      draft.saveFilename = action.payload.saveFilename;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(setUser, (draft, action) => {
      draft.username = action.payload.username;
    });
    builder.addCase(quitVisit, (draft) => ({
      ...initialState,
      username: draft.username,
    }));
    builder.addCase(logOut, () => initialState);
    builder.addCase(fetchLoadLocalVisit, (draft, action) => {
      let visit = allVisits[action.payload].visitInfo;
      draft.organizationId = visit.organizationId;
      draft.organizationName = visit.organizationName;
      draft.protocolId = visit.protocolId;
      draft.protocolName = visit.protocolName;
      draft.visitId = visit.visitId;
      draft.participantId = visit.participantId;
      draft.participantSecondaryId = visit.participantSecondaryId;
      draft.visitProgress = visit.visitProgress;
      draft.softwareVersion = visit.softwareVersion;
      draft.visitDate = visit.visitDate;
      draft.visitHash = visit.visitHash;
      draft.username = visit.username;
      draft.visitSaved = visit.visitSaved;
      draft.visitNotes = visit.visitNotes;
      draft.allDataLocal = visit.allDataLocal;
      draft.saveFolder = visit.saveFolder;
      draft.saveFilename = visit.saveFilename;
      draft.wipFolder = visit.wipFolder;
    });
  },
});

export const getCurrentVisitFolder = createSelector(
  [
    (state) => state.visitInfo.saveFolder,
    (state) => state.visitInfo.wipFolder,
    (state) => state.visitInfo.visitSaved,
  ],
  (saveFolder, wipFolder, visitSaved) => (visitSaved ? saveFolder : wipFolder)
);
// Action creators are generated for each case reducer function
export const { setVisitInformation } = visitInfoSlice.actions;

export default visitInfoSlice.reducer;
