import { configureStore } from "@reduxjs/toolkit";
import visitInfoReducer from "./reducerSlices/visitInfoSlice";
import protocolReducer from "./reducerSlices/protocolSlice";
import deviceReducer from "./reducerSlices/deviceSlice";
import locationsReducer from "./reducerSlices/locationsSlice";
import samplesReducer from "./reducerSlices/samplesSlice";
import formDataReducer from "./reducerSlices/formDataSlice";
import userReducer from "./reducerSlices/userSlice";
import utilityReducer from "./reducerSlices/utilitySlice";
// import { bullseyeDevice } from "./reducerSlices/api";

// Redux toolkit 'configureStore' function automatically adds redux-thunk middleware and redux dev tools.
// No need to set those up manually like before
export default configureStore({
  reducer: {
    visitInfo: visitInfoReducer,
    protocol: protocolReducer,
    device: deviceReducer,
    locations: locationsReducer,
    samples: samplesReducer,
    formData: formDataReducer,
    user: userReducer,
    utility: utilityReducer,
    // [bullseyeDevice.reducerPath]: bullseyeDevice.reducer,
  },

  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(bullseyeDevice.middleware),
});
