import { createSlice } from "@reduxjs/toolkit";
// import { bullseyeDevice } from "./api";
import orgData from "../constants/fixtureFiles/DEMO_ORG.json";
import { logOut } from "./utilitySlice";

const initialState = {
  username: null,
  password: null,
  name: null,
  rememberMeAllowed: false,
  rememberMe: false,
  organizations: [],
  organizationId: null,
  organizationName: null,
  organizationProtocols: {},
  organizationParticipants: {},
  organizationVisitMetadata: {},
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (draft, action) => {
      draft.username = action.payload.username;
      draft.password = action.payload.password;
      draft.name = action.payload.name;
      draft.rememberMeAllowed = action.payload.rememberMeAllowed;
      draft.rememberMe = action.payload.rememberMe;
      draft.organizations = action.payload.organizations;
    },

    addNewParticipant: (draft, action) => {
      draft.organizationParticipants[action.payload.participantId] = {
        participantSecondaryId: action.payload.participantSecondaryId,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        dateOfBirth: action.payload.dateOfBirth,
      };
    },

    toggleRememberMe: (draft, action) => {
      draft.rememberMe = !draft.rememberMe;
      if (!draft.rememberMe) {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
      } else {
        localStorage.setItem("username", draft.username);
        localStorage.setItem("password", draft.password);
      }
    },

    fetchGetOrganization: (draft, action) => {
      draft.organizationId = orgData.organizationId;
      draft.organizationName = orgData.organizationName;
      draft.organizationProtocols = orgData.protocols;
      draft.organizationParticipants = orgData.participants;
      draft.organizationVisitMetadata = orgData.visitMetadata;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logOut, () => initialState);
    // builder.addMatcher(
    //   bullseyeDevice.endpoints.fetchSyncUser.matchFulfilled,
    //   (draft, { payload }) => {
    //     draft.organizations = payload.organizations;
    //   }
    // );
    // builder.addMatcher(
    //   bullseyeDevice.endpoints.fetchSyncOrganization.matchFulfilled,
    //   (draft, { payload }) => {
    //     draft.organizationProtocols = payload.available_protocols;
    //     draft.organizationParticipants = payload.available_participants;
    //     draft.organizationVisitMetadata = payload.visit_metadata;
    //   }
    // );
  },
});

// Action creators are generated for each case reducer function
export const {
  addNewParticipant,
  toggleRememberMe,
  setUser,
  fetchGetOrganization,
} = userSlice.actions;

export default userSlice.reducer;
