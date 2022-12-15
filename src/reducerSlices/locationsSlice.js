import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import {
  addNewLocation,
  deleteNewLocation,
  fetchGetProtocol,
  fetchLoadLocalVisit,
} from "./protocolSlice";
import { standardDeviation } from "../components/utilityFunctions";
import { logOut, quitVisit } from "./utilitySlice";
import visit2 from "../constants/fixtureFiles/visit2.json";
// import { bullseyeDevice } from "./api";
import {
  addNewSample,
  deleteAcqErrorSample,
  changeSampleLocation,
  updateSample,
  setSampleExcluded,
  selectAllSamples,
} from "./samplesSlice";

import visit1 from "../constants/fixtureFiles/visit1.json";
import orgData from "../constants/fixtureFiles/DEMO_ORG.json";
import FACE_SHORT from "../constants/fixtureFiles/FACE_SHORT.json";
import FOREARM from "../constants/fixtureFiles/FOREARM.json";
const examDefFiles = {
  FACE_SHORT: FACE_SHORT,
  FOREARM: FOREARM,
};
const allVisits = {
  visit1: visit1,
  visit2: visit2,
};
const locationsAdapter = createEntityAdapter({});
const initialState = locationsAdapter.getInitialState({
  selectedLocationId: null,
  // nextAutoStep: { form: null, locationId: null, sampleType: null },
});
export const locationsSlice = createSlice({
  name: "locations",
  initialState,

  reducers: {
    setSelectedLocationId: (draft, action) => {
      draft.selectedLocationId = action.payload;
    },

    setAverageThickness: (draft, action) => {
      locationsAdapter.updateOne(draft, {
        id: action.payload.id,
        changes: {
          thickness: {
            value: action.payload.meanThickness,
            standardDev: action.payload.standardDev,
          },
        },
      });
    },
    setAverageShearwave: (draft, action) => {
      locationsAdapter.updateOne(draft, {
        id: action.payload.id,
        changes: {
          shearwaveSpeed: {
            value: action.payload.meanSws,
            standardDev: action.payload.standardDev,
          },
        },
      });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logOut, () => initialState);
    builder.addCase(quitVisit, () => initialState);

    builder.addCase(addNewLocation, (draft, action) => {
      locationsAdapter.addOne(draft, {
        id: action.payload.locationId,
        samplesAcquiredBySampleType: {
          BMODE: 0,
          STL: 0,
        },
        // samplesProcessedBySampleType: {
        //   BMODE: 0,
        //   STL: 0,
        // },
        samplesExcludedBySampleType: {
          BMODE: 0,
          STL: 0,
        },
        alertSample: {
          status: false,
          ids: [],
          anyIncludedInVisit: false,
        },
        shearwaveSpeed: {
          value: null,
          standardDev: null,
        },
        thickness: {
          value: null,
          standardDev: null,
        },
        thicknessRefSampleId: {},
        sampleIds: [],
      });
    });

    builder.addCase(deleteNewLocation, (draft, action) => {
      locationsAdapter.removeOne(draft, action.payload);
    });
    builder.addCase(addNewSample, (draft, action) => {
      locationsAdapter.updateOne(draft, {
        id: action.payload.locationId,
        changes: {
          sampleIds: [
            ...draft.entities[action.payload.locationId].sampleIds,
            action.payload.uuid,
          ],
        },
      });
    });
    builder.addCase(updateSample, (draft, action) => {
      // console.log(action);
      locationsAdapter.updateOne(draft, {
        id: action.payload.locationId,
        changes: {
          samplesAcquiredBySampleType: {
            ...draft.entities[action.payload.locationId]
              .samplesAcquiredBySampleType,
            [action.payload.sampleType]:
              draft.entities[action.payload.locationId]
                .samplesAcquiredBySampleType[action.payload.sampleType] + 1,
          },
        },
      });
    });

    builder.addCase(deleteAcqErrorSample, (draft, action) => {
      locationsAdapter.updateOne(draft, {
        id: action.payload.locationId,
        changes: {
          sampleIds: draft.entities[action.payload.locationId].sampleIds.filter(
            (sampleId) => sampleId !== action.payload.uuid
          ),
        },
      });
    });
    builder.addCase(changeSampleLocation, (draft, action) => {
      locationsAdapter.updateOne(draft, {
        id: action.payload.oldLocationId,
        changes: {
          sampleIds: draft.entities[
            action.payload.oldLocationId
          ].sampleIds.filter((sampleId) => sampleId !== action.payload.id),
          samplesAcquiredBySampleType: {
            ...draft.entities[action.payload.oldLocationId]
              .samplesAcquiredBySampleType,
            [action.payload.sampleType]:
              draft.entities[action.payload.oldLocationId]
                .samplesAcquiredBySampleType[action.payload.sampleType] - 1,
          },
        },
      });

      locationsAdapter.updateOne(draft, {
        id: action.payload.newLocationId,
        changes: {
          sampleIds: [
            ...draft.entities[action.payload.newLocationId].sampleIds,
            action.payload.id,
          ],
          samplesAcquiredBySampleType: {
            ...draft.entities[action.payload.newLocationId]
              .samplesAcquiredBySampleType,
            [action.payload.sampleType]:
              draft.entities[action.payload.newLocationId]
                .samplesAcquiredBySampleType[action.payload.sampleType] + 1,
          },
        },
      });
    });

    builder.addCase(setSampleExcluded, (draft, action) => {
      locationsAdapter.updateOne(draft, {
        id: action.payload.locationId,
        changes: {
          samplesAcquiredBySampleType: {
            ...draft.entities[action.payload.locationId]
              .samplesAcquiredBySampleType,
            [action.payload.sampleType]: action.payload.excluded
              ? draft.entities[action.payload.locationId]
                  .samplesAcquiredBySampleType[action.payload.sampleType] - 1
              : draft.entities[action.payload.locationId]
                  .samplesAcquiredBySampleType[action.payload.sampleType] + 1,
          },
          samplesExcludedBySampleType: {
            ...draft.entities[action.payload.locationId]
              .samplesExcludedBySampleType,
            [action.payload.sampleType]: action.payload.excluded
              ? draft.entities[action.payload.locationId]
                  .samplesExcludedBySampleType[action.payload.sampleType] + 1
              : draft.entities[action.payload.locationId]
                  .samplesExcludedBySampleType[action.payload.sampleType] - 1,
          },
        },
      });
    });
    builder.addCase(fetchGetProtocol, (draft, action) => {
      let modifiedLocations = {};
      let examDef =
        examDefFiles[orgData.protocolDef[action.payload.protocolId].examDef];
      for (let location of Object.entries(examDef.locations.entities)) {
        let locationValue = location[1];
        modifiedLocations[locationValue.id] = {
          id: locationValue.id,
          samplesAcquiredBySampleType: Object.fromEntries(
            Object.keys(locationValue.sampleTypes).map((type) => [type, 0])
          ),
          samplesExcludedBySampleType: Object.fromEntries(
            Object.keys(locationValue.sampleTypes).map((type) => [type, 0])
          ),
          alertSample: {
            status: false,
            ids: [],
            anyIncludedInVisit: false,
          },
          shearwaveSpeed: {
            value: null,
            standardDev: null,
          },
          thickness: {
            value: null,
            standardDev: null,
          },
          thicknessRefSampleId: null,
          sampleIds: [],
        };
      }
      locationsAdapter.setAll(draft, modifiedLocations);
    });
    builder.addCase(fetchLoadLocalVisit, (draft, action) => {
      let visitLocations = allVisits[action.payload].locations;
      locationsAdapter.setAll(draft, visitLocations.entities);
    });

    // builder.addMatcher(
    //   bullseyeDevice.endpoints.fetchGetProtocol.matchFulfilled,
    //   (draft, action) => {
    //     let modifiedLocations = {};
    //     for (let location of Object.entries(
    //       action.payload.protocol.examDef.locations.entities
    //     )) {
    //       let locationValue = location[1];
    //       modifiedLocations[locationValue.id] = {
    //         id: locationValue.id,
    //         samplesAcquiredBySampleType: Object.fromEntries(
    //           Object.keys(locationValue.sampleTypes).map((type) => [type, 0])
    //         ),
    //         // samplesProcessedBySampleType: Object.fromEntries(
    //         //   Object.keys(locationValue.sampleTypes).map((type) => [type, 0])
    //         // ),
    //         samplesExcludedBySampleType: Object.fromEntries(
    //           Object.keys(locationValue.sampleTypes).map((type) => [type, 0])
    //         ),
    //         alertSample: {
    //           status: false,
    //           ids: [],
    //           anyIncludedInVisit: false,
    //         },
    //         shearwaveSpeed: {
    //           value: null,
    //           standardDev: null,
    //         },
    //         thickness: {
    //           value: null,
    //           standardDev: null,
    //         },
    //         thicknessRefSampleId: null,
    //         // roiReference: {
    //         //   locationWide: {
    //         //     sampleId: null,
    //         //     sampleType: null,
    //         //   },
    //         //   defaultSampleId: null,
    //         // },
    //         sampleIds: [],
    //       };
    //     }
    //     locationsAdapter.setAll(draft, modifiedLocations);
    //   }
    // );
  },
});

//getSelectors creates these selectors and we rename them with aliases using destructuring. getSelectors uses createSelector so memorizing is included
export const {
  selectEntities: selectAllLocations,
  selectById: selectLocationById,
  selectIds: selectLocationIds,
  // Pass in a selector that returns the posts slice of state
} = locationsAdapter.getSelectors((state) => state.locations);

export const getSelectedLocation = createSelector(
  [selectAllLocations, (state) => state.locations.selectedLocationId],
  (allLocations, selectedLocationId) => allLocations[selectedLocationId]
);

// Action creators are generated for each case reducer function
export const {
  setSelectedLocationId,
  setAverageThickness,
  setAverageShearwave,
} = locationsSlice.actions;

export function calculateAverageThicknessForLocation(locationId) {
  return (dispatch, getState) => {
    const state = getState();
    const locationSamplesIds = selectLocationById(state, locationId).sampleIds;
    const allSamples = selectAllSamples(state);
    const locationValidBmodeSampleIds = Object.keys(allSamples).filter(
      (sampleId) =>
        allSamples[sampleId].sampleType === "BMODE" &&
        locationSamplesIds.includes(sampleId) &&
        !allSamples[sampleId].excluded &&
        typeof allSamples[sampleId].thickness === "number"
    );
    const thicknessArray = locationValidBmodeSampleIds.map(
      (sampleId) => allSamples[sampleId].thickness
    );
    const totalThickness = thicknessArray.reduce(
      (thicknessValue, currentThickness) => thicknessValue + currentThickness,
      0
    );
    if (locationValidBmodeSampleIds.length !== 0) {
      const meanThickness = totalThickness / thicknessArray.length;
      const standardDev = standardDeviation(thicknessArray, totalThickness);
      dispatch(
        setAverageThickness({
          id: locationId,
          meanThickness: meanThickness,
          standardDev: standardDev,
        })
      );
    } else {
      // No samples are taken OR all samples are excluded from exam so thickness should be set to null

      dispatch(
        setAverageThickness({
          id: locationId,
          meanThickness: null,
          standardDev: null,
        })
      );
    }
  };
}

export function calculateAverageSwsForLocation(locationId) {
  return (dispatch, getState) => {
    const state = getState();
    const locationSamplesIds = selectLocationById(state, locationId).sampleIds;
    const allSamples = selectAllSamples(state);
    const locationValidCsiSampleIds = Object.keys(allSamples).filter(
      (sampleId) =>
        ["STL", "SINGLE"].includes(allSamples[sampleId].sampleType) &&
        locationSamplesIds.includes(sampleId) &&
        !allSamples[sampleId].excluded &&
        typeof allSamples[sampleId].shearwaveSpeed === "number"
    );
    const swsArray = locationValidCsiSampleIds.map(
      (sampleId) => allSamples[sampleId].shearwaveSpeed
    );
    const totalSws = swsArray.reduce(
      (swsValue, currentSws) => swsValue + currentSws,
      0
    );

    if (locationValidCsiSampleIds !== 0) {
      const meanSws = totalSws / swsArray.length;
      const standardDev = standardDeviation(swsArray, totalSws);
      dispatch(
        setAverageShearwave({
          id: locationId,
          meanSws: meanSws,
          standardDev: standardDev,
        })
      );
    } else {
      // No samples are taken OR all samples are excluded from exam so thickness should be set to null

      dispatch(
        setAverageShearwave({
          id: locationId,
          meanSws: null,
          standardDev: null,
        })
      );
    }
  };
}

export default locationsSlice.reducer;
