import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { locationProgressPercentage } from "../utilityFunctions";
import LocationInformation from "./LocationInformation";
import { locationSubviews } from "../../constants/pageMap";
import SampleGallery from "./SampleGallery";
import CsiSample from "./sampleSubview/CsiSample";
import BmodeSample from "./sampleSubview/BmodeSample";
import {
  getSelectedProtocolLocation,
  selectProtocolLocationById,
} from "../../reducerSlices/protocolSlice";
import {
  getSelectedLocation,
  selectLocationById,
  setSelectedLocationId,
} from "../../reducerSlices/locationsSlice";
import { getSelectedSample } from "../../reducerSlices/samplesSlice";
import { setLocationSubview } from "../../reducerSlices/utilitySlice";

function SelectedLocationPage() {
  const dispatch = useDispatch();
  const selectedLocationProgress = useSelector((state) =>
    locationProgressPercentage(
      getSelectedLocation(state).samplesAcquiredBySampleType,
      getSelectedProtocolLocation(state).sampleTypes
    )
  );

  const locationsById = useSelector((state) =>
    Object.fromEntries(
      state.locations.ids.map((locationId) => {
        let protocolLocation = selectProtocolLocationById(state, locationId);
        let location = selectLocationById(state, locationId);
        return [
          locationId,
          locationProgressPercentage(
            location.samplesAcquiredBySampleType,
            protocolLocation.sampleTypes
          ),
        ];
      })
    )
  );

  const locationSubview = useSelector((state) => state.utility.locationSubview);
  const selectedSample = useSelector((state) => ({
    selectedSampleId: state.samples.selectedSampleId,
    sampleType: getSelectedSample(state)?.sampleType,
  }));

  const handleAdvanceClick = () => {
    if (selectedLocationProgress >= 100) {
      let nextLocationId = Object.keys(locationsById).find(
        (locationId) => locationsById[locationId] < 100
      );
      if (nextLocationId) {
        dispatch(setLocationSubview(locationSubviews.locationInformation));
        dispatch(setSelectedLocationId(nextLocationId));
      }
    }
  };

  return (
    <div class="app-body selectedLocationPage">
      <SampleGallery />

      {locationSubview === locationSubviews.locationInformation ? (
        <LocationInformation />
      ) : locationSubview === locationSubviews.sample &&
        selectedSample.selectedSampleId !== null ? (
        selectedSample.sampleType === "BMODE" ? (
          <BmodeSample />
        ) : (
          <CsiSample />
        )
      ) : (
        <LocationInformation />
      )}

      <div
        class={`selectedLocationPage-progress  ${
          selectedLocationProgress === 100 && "clickable"
        }`}
        onClick={() => handleAdvanceClick()}
      >
        {selectedLocationProgress === 100 && (
          <p class="font--small">
            Click HERE to move to the next location or press button handle
          </p>
        )}
        <span
          style={{
            width: `${selectedLocationProgress}%`,
          }}
        />
      </div>
    </div>
  );
}

export default SelectedLocationPage;
