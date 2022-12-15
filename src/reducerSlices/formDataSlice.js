import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
// import { bullseyeDevice } from "./api";
import { logOut, quitVisit } from "./utilitySlice";

import orgData from "../constants/fixtureFiles/DEMO_ORG.json";
import SKIN_CONDITION from "../constants/fixtureFiles/SKIN_CONDITION.json";
import ARM from "../constants/fixtureFiles/ARM.json";
import { fetchGetProtocol, fetchLoadLocalVisit } from "./protocolSlice";
import visit1 from "../constants/fixtureFiles/visit1.json";
import visit2 from "../constants/fixtureFiles/visit2.json";
const formFiles = {
  SKIN_CONDITION: SKIN_CONDITION,
  ARM: ARM,
};
const allVisits = {
  visit1: visit1,
  visit2: visit2,
};
const formDataAdapter = createEntityAdapter({});
const initialState = formDataAdapter.getInitialState();
export const formDataSlice = createSlice({
  name: "formData",
  initialState,
  reducers: {
    updateFormData: (draft, action) => {
      formDataAdapter.updateOne(draft, {
        id: action.payload.formId,
        changes: {
          completed: action.payload.completed,
          data: action.payload.formData,
        },
      });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logOut, () => initialState);
    builder.addCase(quitVisit, () => initialState);
    builder.addCase(fetchGetProtocol, (draft, action) => {
      let formDef = {
        entities: {
          [orgData.protocolDef[action.payload.protocolId].formDef]: {
            ...formFiles[
              orgData.protocolDef[action.payload.protocolId].formDef
            ],
          },
        },
      };
      let modifiedForms = Object.fromEntries(
        Object.keys(formDef.entities).map((formId) => [
          formId,
          {
            id: formId,
            completed: false,
            data: Object.fromEntries(
              Object.entries(formDef.entities[formId].form).map((formItem) => [
                formItem[1]["Variable / Field Name"],
                [
                  "text",
                  "descriptive",
                  "notes",
                  "slider",
                  "radio",
                  "dropdown",
                  "yesno",
                  "truefalse",
                ].includes(formItem[1]["Field Type"])
                  ? ""
                  : [],
              ])
            ),
          },
        ])
      );

      formDataAdapter.setAll(draft, modifiedForms);
    });
    builder.addCase(fetchLoadLocalVisit, (draft, action) => {
      formDataAdapter.setAll(
        draft,
        allVisits[action.payload].formData.entities
      );
    });
    // builder.addMatcher(
    //   bullseyeDevice.endpoints.fetchGetProtocol.matchFulfilled,
    //   (draft, { payload }) => {
    //     let modifiedForms = Object.fromEntries(
    //       payload.protocol.formDef.ids.map((formId) => [
    //         formId,
    //         {
    //           id: formId,
    //           completed: false,
    //           data: Object.fromEntries(
    //             Object.entries(
    //               payload.protocol.formDef.entities[formId].form
    //             ).map((formItem) => [
    //               formItem[1]["Variable / Field Name"],
    //               [
    //                 "text",
    //                 "descriptive",
    //                 "notes",
    //                 "slider",
    //                 "radio",
    //                 "dropdown",
    //                 "yesno",
    //                 "truefalse",
    //               ].includes(formItem[1]["Field Type"])
    //                 ? ""
    //                 : [],
    //             ])
    //           ),
    //         },
    //       ])
    //     );
    //     formDataAdapter.setAll(draft, modifiedForms);
    //   }
    // );
  },
});

export const {
  selectEntities: selectAllFormData,
  selectById: selectFormDataById,
  selectIds: selectFormDataIds,
  // Pass in a selector that returns the posts slice of state
} = formDataAdapter.getSelectors((state) => state.formData);

// Action creators are generated for each case reducer function
export const { updateFormData } = formDataSlice.actions;

export default formDataSlice.reducer;
