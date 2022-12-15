import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
// import { bullseyeDevice } from "./api";
import { isAnyOf } from "@reduxjs/toolkit";
import { logOut, quitVisit } from "./utilitySlice";
import visit1 from "../constants/fixtureFiles/visit1.json";
import orgData from "../constants/fixtureFiles/DEMO_ORG.json";
import FACE_SHORT from "../constants/fixtureFiles/FACE_SHORT.json";
import FOREARM from "../constants/fixtureFiles/FOREARM.json";
import SKIN_CONDITION from "../constants/fixtureFiles/SKIN_CONDITION.json";
import ARM from "../constants/fixtureFiles/ARM.json";
import forearm_map from "../constants/fixtureFiles/maps/forearm_map.png";
import generic_face from "../constants/fixtureFiles/maps/generic_face.png";

import visit2 from "../constants/fixtureFiles/visit2.json";
import cheekLeft from "../constants/fixtureFiles/illustrations/cheekLeft.png";
import cheekRight from "../constants/fixtureFiles/illustrations/cheekRight.png";
import jawRight from "../constants/fixtureFiles/illustrations/jawRight.png";
import jawLeft from "../constants/fixtureFiles/illustrations/jawLeft.png";
import undereyeRight from "../constants/fixtureFiles/illustrations/undereyeRight.png";
import undereyeLeft from "../constants/fixtureFiles/illustrations/undereyeLeft.png";
import forearmFlexedRight from "../constants/fixtureFiles/illustrations/forearmFlexedRight.png";
import forearmExtendedRight from "../constants/fixtureFiles/illustrations/forearmExtendedRight.png";
import forearmFlexedLeft from "../constants/fixtureFiles/illustrations/forearmFlexedLeft.png";
import forearmExtendedLeft from "../constants/fixtureFiles/illustrations/forearmExtendedLeft.png";
const allVisits = {
  visit1: visit1,
  visit2: visit2,
};
const examDefFiles = {
  FACE_SHORT: FACE_SHORT,
  FOREARM: FOREARM,
};
const formFiles = {
  SKIN_CONDITION: SKIN_CONDITION,
  ARM: ARM,
};

const allMaps = {
  "forearm_map.png": forearm_map,
  "generic_face.png": generic_face,
};
const allIllustrations = {
  "cheekLeft.png": cheekLeft,
  "cheekRight.png": cheekRight,
  "jawRight.png": jawRight,
  "jawLeft.png": jawLeft,
  "undereyeRight.png": undereyeRight,
  "undereyeLeft.png": undereyeLeft,
  "forearmFlexedRight.png": forearmFlexedRight,
  "forearmExtendedRight.png": forearmExtendedRight,
  "forearmFlexedLeft.png": forearmFlexedLeft,
  "forearmExtendedLeft.png": forearmExtendedLeft,
};

const protocolLocationsAdapter = createEntityAdapter({});
const protocolFormDefAdapter = createEntityAdapter({});
const initialState = {
  protocolId: null,
  protocolName: null,
  examDef: {
    examDefId: null,
    examDefName: null,
    modified: false,
    locationTemplate: {},
    locations: protocolLocationsAdapter.getInitialState(),
    maps: {},
  },
  formDef: protocolFormDefAdapter.getInitialState(),
};
export const protocolSlice = createSlice({
  name: "protocol",
  initialState,
  reducers: {
    addNewLocation: (draft, action) => {
      draft.examDef.modified = true;
      protocolLocationsAdapter.addOne(draft.examDef.locations, {
        id: action.payload.locationId,
        ...draft.examDef.locationTemplate,
        name: action.payload.locationName,
      });
    },
    deleteNewLocation: (draft, action) => {
      protocolLocationsAdapter.removeOne(
        draft.examDef.locations,
        action.payload
      );
    },

    setLocationNotes: (draft, action) => {
      protocolLocationsAdapter.updateOne(draft.examDef.locations, {
        id: action.payload.locationId,
        changes: { notes: action.payload.notes },
      });
    },

    setLocationExcluded: (draft, action) => {
      protocolLocationsAdapter.updateOne(draft.examDef.locations, {
        id: action.payload.locationId,
        changes: { excluded: action.payload.excluded },
      });
    },

    setNewLocationName: (draft, action) => {
      protocolLocationsAdapter.updateOne(draft.examDef.locations, {
        id: action.payload.locationId,
        changes: { name: action.payload.locationName },
      });
    },

    fetchGetProtocol: (draft, action) => {
      draft.protocolId = action.payload.protocolId;
      draft.protocolName = action.payload.protocolName;

      let examDef =
        examDefFiles[orgData.protocolDef[action.payload.protocolId].examDef];

      Object.keys(examDef.maps).map((mapId) => {
        examDef.maps[mapId].image = allMaps[examDef.maps[mapId].filename];
      });

      Object.keys(examDef.locations.entities).map((locationId) => {
        examDef.locations.entities[locationId].instructions.illustration.map(
          (illus) => {
            illus.image = allIllustrations[illus.filename];
          }
        );
      });

      let formDef = {
        entities: {
          [orgData.protocolDef[action.payload.protocolId].formDef]: {
            ...formFiles[
              orgData.protocolDef[action.payload.protocolId].formDef
            ],
          },
        },
      };

      draft.examDef.examDefId = examDef.examDefId;
      draft.examDef.examDefName = examDef.examDefName;
      draft.examDef.modified = examDef.modified;
      draft.examDef.locationTemplate = examDef.locationTemplate;
      draft.examDef.maps = examDef.maps;
      protocolLocationsAdapter.setAll(
        draft.examDef.locations,
        examDef.locations.entities
      );
      protocolFormDefAdapter.setAll(draft.formDef, formDef.entities);
    },

    fetchLoadLocalVisit: (draft, action) => {
      let visitProtocol = allVisits[action.payload].protocol;
      draft.protocolId = visitProtocol.protocolId;
      draft.protocolName = visitProtocol.protocolName;

      draft.examDef.examDefId = visitProtocol.examDef.examDefId;
      draft.examDef.examDefName = visitProtocol.examDef.examDefName;
      draft.examDef.modified = visitProtocol.examDef.modified;
      draft.examDef.locationTemplate = visitProtocol.examDef.locationTemplate;
      console.log(visitProtocol.examDef);
      Object.keys(visitProtocol.examDef.maps).map((mapId) => {
        visitProtocol.examDef.maps[mapId].image =
          allMaps[visitProtocol.examDef.maps[mapId].filename];
      });

      Object.keys(visitProtocol.examDef.locations.entities).map(
        (locationId) => {
          visitProtocol.examDef.locations.entities[
            locationId
          ].instructions.illustration.map((illus) => {
            console.log(illus.filename, Object.keys(allMaps));
            illus.image = allIllustrations[illus.filename];
          });
        }
      );

      draft.examDef.maps = visitProtocol.examDef.maps;

      protocolLocationsAdapter.setAll(
        draft.examDef.locations,
        visitProtocol.examDef.locations.entities
      );
      protocolFormDefAdapter.setAll(
        draft.formDef,
        visitProtocol.formDef.entities
      );
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logOut, () => initialState);
    builder.addCase(quitVisit, () => initialState);

    // builder.addMatcher(
    //   isAnyOf(
    //     bullseyeDevice.endpoints.fetchGetProtocol.matchFulfilled,
    //     bullseyeDevice.endpoints.fetchLoadLocalVisit.matchFulfilled
    //   ),
    //   (draft, action) => {
    //     console.log(action);
    //     draft.protocolId = action.payload.protocol.protocolId;
    //     draft.protocolName = action.payload.protocol.protocolName;
    //     draft.examDef.examDefId = action.payload.protocol.examDef.examDefId;
    //     draft.examDef.examDefName = action.payload.protocol.examDef.examDefName;
    //     draft.examDef.modified = action.payload.protocol.examDef.modified;
    //     draft.examDef.locationTemplate =
    //       action.payload.protocol.examDef.locationTemplate;
    //     draft.examDef.maps = action.payload.protocol.examDef.maps;
    //     protocolLocationsAdapter.setAll(
    //       draft.examDef.locations,
    //       action.payload.protocol.examDef.locations.entities
    //     );
    //     protocolFormDefAdapter.setAll(
    //       draft.formDef,
    //       action.payload.protocol.formDef.entities
    //     );
    //   }
    // );
  },
});

export const {
  selectEntities: selectAllProtocolLocations,
  selectById: selectProtocolLocationById,
  selectIds: selectProtocolLocationIds,
  // Pass in a selector that returns the posts slice of state
} = protocolLocationsAdapter.getSelectors(
  (state) => state.protocol.examDef.locations
);

export const {
  selectEntities: selectAllProtocolForms,
  selectById: selectProtocolFormById,
  selectIds: selectProtocolFormIds,
  // Pass in a selector that returns the posts slice of state
} = protocolFormDefAdapter.getSelectors((state) => state.protocol.formDef);

export const getSelectedProtocolLocation = createSelector(
  [selectAllProtocolLocations, (state) => state.locations.selectedLocationId],
  (allLocations, selectedLocationId) => allLocations[selectedLocationId]
);

// Action creators are generated for each case reducer function
export const {
  addNewLocation,
  setLocationExcluded,
  setNewLocationName,
  setLocationNotes,
  deleteNewLocation,
  fetchGetProtocol,
  fetchLoadLocalVisit,
} = protocolSlice.actions;

export default protocolSlice.reducer;
