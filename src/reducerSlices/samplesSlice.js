import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
// import { bullseyeDevice } from "./api";
import { logOut, quitVisit } from "./utilitySlice";
import { isAnyOf } from "@reduxjs/toolkit";
import { fetchGetProtocol, fetchLoadLocalVisit } from "./protocolSlice";
import bmodeFixture from "../constants/fixtureFiles/bmode.json";
import bmode20_0 from "../constants/fixtureFiles/bmode/bmode_-20_0.jpg";
import bmode40_20 from "../constants/fixtureFiles/bmode/bmode_-40_-20.jpg";
import bmode40_0 from "../constants/fixtureFiles/bmode/bmode_-40_0.jpg";
import bmode60_20 from "../constants/fixtureFiles/bmode/bmode_-60_-20.jpg";
import bmode60_40 from "../constants/fixtureFiles/bmode/bmode_-60_-40.jpg";
import bmode60_0 from "../constants/fixtureFiles/bmode/bmode_-60_0.jpg";
import stlFixture from "../constants/fixtureFiles/stl.json";
import stl_0_4 from "../constants/fixtureFiles/stl/stl_0_4.jpg";
import stl_0_8 from "../constants/fixtureFiles/stl/stl_0_8.jpg";
import stl_0_12 from "../constants/fixtureFiles/stl/stl_0_12.jpg";
import stl_4_8 from "../constants/fixtureFiles/stl/stl_4_8.jpg";
import stl_4_12 from "../constants/fixtureFiles/stl/stl_4_12.jpg";
import stl_8_12 from "../constants/fixtureFiles/stl/stl_8_12.jpg";
import visit1 from "../constants/fixtureFiles/visit1.json";
import visit2 from "../constants/fixtureFiles/visit2.json";
const allBmodeImages = {
  "bmode_-20_0.jpg": bmode20_0,
  "bmode_-40_-20.jpg": bmode40_20,
  "bmode_-40_0.jpg": bmode40_0,
  "bmode_-60_-20.jpg": bmode60_20,
  "bmode_-60_-40.jpg": bmode60_40,
  "bmode_-60_0.jpg": bmode60_0,
};
const allStlImages = {
  "stl_0_4.jpg": stl_0_4,
  "stl_0_8.jpg": stl_0_8,
  "stl_0_12.jpg": stl_0_12,
  "stl_4_8.jpg": stl_4_8,
  "stl_4_12.jpg": stl_4_12,
  "stl_8_12.jpg": stl_8_12,
};
const allVisits = {
  visit1: visit1,
  visit2: visit2,
};
const samplesAdapter = createEntityAdapter({});
const initialState = samplesAdapter.getInitialState({
  selectedSampleId: null,
});
export const samplesSlice = createSlice({
  name: "samples",
  initialState,
  reducers: {
    addNewSample: (draft, action) => {
      samplesAdapter.addOne(draft, {
        id: action.payload.uuid,
        sampleType: action.payload.sampleType,
        processing: true,
        valueDisplay: false,
        selectable: false,
        dataSaved: false,
        locationId: action.payload.locationId,
        alert: {
          status: false,
          message: null,
        },
        excluded: false,
        notes: null,
        plot: {},
      });
    },

    deleteAcqErrorSample: (draft, action) => {
      samplesAdapter.removeOne(draft, action.payload.uuid);
    },

    updateSample: (draft, action) => {
      if (action.payload.sampleType === "BMODE") {
        samplesAdapter.updateOne(draft, {
          id: action.payload.uuid,
          changes: {
            processing: false,
            valueDisplay: true,
            selectable: true,
            dataSaved: true, // Potentially have a different recuder to set this variable
            alert: bmodeFixture.alert,
            excluded: bmodeFixture.alert.status, //Automaticall exclude sample if there is an alert
            thickness: bmodeFixture.thickness,
            autoDetectedTopSurface: bmodeFixture.topSurface,
            autoDetectedThickness: bmodeFixture.thickness,
            autoDetectedBottomSurface: bmodeFixture.bottomSurface,
            topSurface: bmodeFixture.topSurface,
            bottomSurface: bmodeFixture.bottomSurface,
            setToAutoDetectedThickness: true,
            plot: {
              image:
                allBmodeImages[
                  `bmode_${bmodeFixture.colorBar.range[0]}_${bmodeFixture.colorBar.range[1]}.jpg`
                ],
              xAxis: bmodeFixture.xAxis,
              yAxis: bmodeFixture.yAxis,
              colorBar: bmodeFixture.colorBar,
            },
          },
        });
      } else if (["STL", "SINGLE", "SWS"].includes(action.payload.sampleType)) {
        samplesAdapter.updateOne(draft, {
          id: action.payload.uuid,
          changes: {
            processing: false,
            valueDisplay: true,
            selectable: true,
            dataSaved: true, // Potentially have a different recuder to set this variable
            alert: stlFixture.alert,
            excluded: stlFixture.alert.status, //Automaticall exclude sample if there is an alert
            shearwaveSpeed: stlFixture.shearwaveSpeed,
            percentSliceWidth: stlFixture.percentSliceWidth,
            dz: stlFixture.dz,
            z: stlFixture.z,
            plot: {
              image:
                allStlImages[
                  `stl_${stlFixture.colorBar.yAxis.range[0]}_${stlFixture.colorBar.yAxis.range[1]}.jpg`
                ],
              xAxis: stlFixture.xAxis,
              yAxis: stlFixture.yAxis,
              colorBar: stlFixture.colorBar,
            },
          },
        });
      }
    },

    setSelectedSampleId: (draft, action) => {
      draft.selectedSampleId = action.payload;
    },

    setSampleNotes: (draft, action) => {
      samplesAdapter.updateOne(draft, {
        id: action.payload.id,
        changes: { notes: action.payload.notes },
      });
    },
    setSampleExcluded: (draft, action) => {
      samplesAdapter.updateOne(draft, {
        id: action.payload.id,
        changes: { excluded: action.payload.excluded },
      });
    },

    changeSampleLocation: (draft, action) => {
      samplesAdapter.updateOne(draft, {
        id: action.payload.id,
        changes: { locationId: action.payload.newLocationId },
      });
    },

    // CSI SAMPLES

    fetchGetSwsImage: (draft, action) => {
      // console.log(action);
      samplesAdapter.updateOne(draft, {
        id: action.payload.id,
        changes: {
          processing: false,
          valueDisplay: true,
          selectable: true,
          // alert: action.payload.alert,
          // excluded: action.payload.alert.status, //Automaticall exclude sample if there is an alert
          plot: {
            image:
              allStlImages[
                `stl_${action.payload.swsLimits[0]}_${action.payload.swsLimits[1]}.jpg`
              ],

            xAxis: stlFixture.xAxis,
            yAxis: stlFixture.yAxis,
            colorBar: {
              ...stlFixture.colorBar,
              yAxis: {
                range: action.payload.swsLimits,
                label: "SWS",
                unit: "m/s",
              },
            },
          },
        },
      });
    },

    fetchGetSwsValue: (draft, action) => {
      let dz = Math.abs(action.payload.dz[1] - action.payload.dz[0]);
      let roi_dz = dz * action.payload.percentSliceWidth * 0.01;
      let z = (action.payload.dz[1] + action.payload.dz[0]) / 2;
      let zRange = [z - roi_dz / 2, z + roi_dz / 2];
      let closestZIndex = [];
      closestZIndex[0] = stlFixture.zArray.indexOf(
        stlFixture.zArray.reduce((prev, curr) => {
          return Math.abs(curr - zRange[0]) < Math.abs(prev - zRange[0])
            ? curr
            : prev;
        })
      );
      closestZIndex[1] = stlFixture.zArray.indexOf(
        stlFixture.zArray.reduce((prev, curr) => {
          return Math.abs(curr - zRange[1]) < Math.abs(prev - zRange[1])
            ? curr
            : prev;
        })
      );
      let swsValue =
        stlFixture.swsArray
          .slice(closestZIndex[0], closestZIndex[1])
          .reduce((a, b) => a + b) /
        stlFixture.swsArray.slice(closestZIndex[0], closestZIndex[1]).length;

      samplesAdapter.updateOne(draft, {
        id: action.payload.id,
        changes: {
          processing: false,
          valueDisplay: true,
          selectable: true,
          shearwaveSpeed: swsValue,
          percentSliceWidth: action.payload.percentSliceWidth,
          z: z,
          dz: dz,
        },
      });
    },

    // BMODE SAMPLE ACTIONS
    setBmodeSampleThickness: (draft, action) => {
      samplesAdapter.updateOne(draft, {
        id: action.payload.id,
        changes: {
          thickness: action.payload.thickness,
          topSurface: action.payload.topSurface,
          bottomSurface: action.payload.bottomSurface,
        },
      });
    },

    setBmodeAutoDetectedThickness: (draft, action) => {
      if (action.payload.autoDetect) {
        samplesAdapter.updateOne(draft, {
          id: action.payload.id,
          changes: {
            setToAutoDetectedThickness: action.payload.autoDetect,
            thickness: draft.entities[action.payload.id].autoDetectedThickness,
            topSurface:
              draft.entities[action.payload.id].autoDetectedTopSurface,
            bottomSurface:
              draft.entities[action.payload.id].autoDetectedBottomSurface,
          },
        });
      } else {
        samplesAdapter.updateOne(draft, {
          id: action.payload.id,
          changes: { setToAutoDetectedThickness: action.payload.autoDetect },
        });
      }
    },

    fetchGetBmodeImage: (draft, action) => {
      samplesAdapter.updateOne(draft, {
        id: action.payload.id,
        changes: {
          processing: false,
          valueDisplay: true,
          selectable: true,
          // alert: action.payload.alert,
          // excluded: action.payload.alert.status, //Automaticall exclude sample if there is an alert
          plot: {
            image:
              allBmodeImages[
                `bmode_${action.payload.amplitudeLimits[0]}_${action.payload.amplitudeLimits[1]}.jpg`
              ],

            xAxis: bmodeFixture.xAxis,
            yAxis: bmodeFixture.yAxis,
            colorBar: {
              range: action.payload.amplitudeLimits,
              label: "Amplitude",
              unit: "dB",
            },
          },
        },
      });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logOut, () => initialState);
    builder.addCase(quitVisit, () => initialState);
    builder.addCase(fetchLoadLocalVisit, (draft, action) => {
      samplesAdapter.setAll(draft, allVisits[action.payload].samples.entities);
    });

    //   builder.addMatcher(
    //     isAnyOf(
    //       bullseyeDevice.endpoints.fetchGetBmodeImage.matchFulfilled,
    //       bullseyeDevice.endpoints.fetchGetSwsImage.matchFulfilled
    //     ),
    //     (draft, action) => {
    //       samplesAdapter.updateOne(draft, {
    //         id: action.payload.uuid,
    //         changes: {
    //           processing: false,
    //           valueDisplay: true,
    //           selectable: true,
    //           alert: action.payload.alert,
    //           excluded: action.payload.alert.status, //Automaticall exclude sample if there is an alert
    //           plot: {
    //             image: action.payload.image,
    //             xAxis: action.payload.xAxis,
    //             yAxis: action.payload.yAxis,
    //             colorBar: action.payload.colorBar,
    //           },
    //         },
    //       });
    //     }
    //   );

    //   builder.addMatcher(
    //     bullseyeDevice.endpoints.fetchGetSwsValue.matchFulfilled,
    //     (draft, action) => {
    //       samplesAdapter.updateOne(draft, {
    //         id: action.payload.uuid,
    //         changes: {
    //           processing: false,
    //           valueDisplay: true,
    //           selectable: true,
    //           shearwaveSpeed: action.payload.shearwaveSpeed,
    //           percentSliceWidth: action.payload.percentSliceWidth,
    //           z: action.payload.z,
    //           dz: action.payload.dz,
    //         },
    //       });
    //     }
    //   );

    //   builder.addMatcher(
    //     isAnyOf(
    //       bullseyeDevice.endpoints.fetchGetBmodeImage.matchPending,
    //       bullseyeDevice.endpoints.fetchGetSwsImage.matchPending,
    //       bullseyeDevice.endpoints.fetchGetSwsValue.matchPending
    //     ),
    //     (draft, action) => {
    //       samplesAdapter.updateOne(draft, {
    //         id: action.meta.arg.originalArgs.id,
    //         changes: {
    //           processing: true,
    //         },
    //       });
    //     }
    //   );
    //   builder.addMatcher(
    //     isAnyOf(
    //       bullseyeDevice.endpoints.fetchGetBmodeImage.matchRejected,
    //       bullseyeDevice.endpoints.fetchGetSwsImage.matchRejected,
    //       bullseyeDevice.endpoints.fetchGetSwsValue.matchRejected
    //     ),

    //     (draft, action) => {
    //       samplesAdapter.updateOne(draft, {
    //         id: action.payload.uuid,
    //         changes: {
    //           processing: false,
    //           valueDisplay: true,
    //           selectable: true,
    //         },
    //       });
    //     }
    //   );
  },
});

//getSelectors creates these selectors and we rename them with aliases using destructuring. getSelectors uses createSelector so memorizing is included
export const {
  selectEntities: selectAllSamples,
  selectById: selectSampleById,
  selectIds: selectSampleIds,
  // Pass in a selector that returns the posts slice of state
} = samplesAdapter.getSelectors((state) => state.samples);

export const getSelectedSample = createSelector(
  [selectAllSamples, (state) => state.samples.selectedSampleId],
  (allSamples, selectedSampleId) => allSamples[selectedSampleId]
);

// Action creators are generated for each case reducer function
export const {
  setSelectedSampleId,
  setBmodeAutoDetectedThickness,
  setSampleNotes,
  setSampleExcluded,
  setBmodeSampleThickness,
  addNewSample,
  deleteAcqErrorSample,
  updateSample,
  changeSampleLocation,
  fetchGetBmodeImage,
  fetchGetSwsImage,
  fetchGetSwsValue,
} = samplesSlice.actions;

export default samplesSlice.reducer;
