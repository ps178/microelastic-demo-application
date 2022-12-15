import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import {
  elasticityAvgStamp,
  Icon,
  thicknessAvgStamp,
} from "../sharedComponents";
import MobileStepper from "@mui/material/MobileStepper";
import TextField from "@mui/material/TextField";
import {
  setPageId,
  // toggleShowExcludedSamples,
} from "../../reducerSlices/utilitySlice";
import {
  deleteNewLocation,
  getSelectedProtocolLocation,
  selectProtocolLocationById,
  setLocationExcluded,
  setLocationNotes,
} from "../../reducerSlices/protocolSlice";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  getSelectedLocation,
  selectLocationById,
} from "../../reducerSlices/locationsSlice";
import pageIds from "../../constants/pageMap";

function LocationInformation() {
  const dispatch = useDispatch();
  const [activeMapStep, setActiveMapStep] = React.useState(0);
  // const showExcludedSamples = useSelector(
  //   (state) => state.utility.showExcludedSamples
  // );
  const location = useSelector((state) => {
    const selectedLocation = getSelectedLocation(state);
    const selectedProtocolLocation = getSelectedProtocolLocation(state);
    return {
      locationId: state.locations.selectedLocationId,
      illustrations: selectedProtocolLocation.instructions.illustration,
      instructions: selectedProtocolLocation.instructions.text,
      notes: selectedProtocolLocation.notes,
      excluded: selectedProtocolLocation.excluded,
      shearwaveSpeed: selectedLocation.shearwaveSpeed,
      thickness: selectedLocation.thickness,
      samplesAcquiredBySampleType: selectedLocation.samplesAcquiredBySampleType,
      sampleTypes: selectedProtocolLocation.sampleTypes,
      anySamples: selectedLocation.sampleIds.length > 0,
    };
  });

  return (
    <div class="locationInformation">
      {location.illustrations.length > 0 && (
        <div class="card shadow--dark locationInformation-illustrations">
          <img src={location.illustrations[activeMapStep]?.image} />
          {location.illustrations.length > 1 && (
            <MobileStepper
              steps={location.illustrations.length}
              position="static"
              activeStep={activeMapStep}
              nextButton={
                <Button
                  size="small"
                  onClick={() =>
                    setActiveMapStep((prevActiveStep) => prevActiveStep + 1)
                  }
                  disabled={activeMapStep === location.illustrations.length - 1}
                >
                  <Icon
                    class={`icon--small icon--white ${
                      activeMapStep === location.illustrations.length - 1 &&
                      "icon--disabled"
                    }`}
                    id="arrow_right"
                  />
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={() =>
                    setActiveMapStep((prevActiveStep) => prevActiveStep - 1)
                  }
                  disabled={activeMapStep === 0}
                >
                  <Icon
                    class={`icon--small icon--white ${
                      activeMapStep === 0 && "icon--disabled"
                    }`}
                    id="arrow_left"
                  />
                </Button>
              }
            />
          )}
        </div>
      )}

      <div class="card shadow--dark">
        <div class="card-content card-content--denseSpacing ">
          <div class="locationInformation-averageValues">
            {thicknessAvgStamp(
              location.thickness.value,
              location.thickness.standardDev,
              location.samplesAcquiredBySampleType["BMODE"],
              location.sampleTypes["BMODE"].displayName
            )}
            {elasticityAvgStamp(
              location.shearwaveSpeed.value,
              location.shearwaveSpeed.standardDev,
              location.samplesAcquiredBySampleType["STL"],
              location.sampleTypes["STL"].displayName
            )}
          </div>
          <p>{location.instructions}</p>
          <TextField
            label="Notes"
            multiline
            rows={3}
            value={location.notes}
            onChange={(event) =>
              dispatch(
                setLocationNotes({
                  locationId: location.locationId,
                  notes: event.target.value,
                })
              )
            }
          />{" "}
          {/* <FormControlLabel
            control={
              <Switch
                size="large"
                checked={showExcludedSamples}
                onChange={() => dispatch(toggleShowExcludedSamples())}
              />
            }
            label="Show excluded samples"
          /> */}
          <FormControlLabel
            control={
              <Switch
                size="large"
                checked={location.excluded}
                onChange={(event) =>
                  dispatch(
                    setLocationExcluded({
                      locationId: location.locationId,
                      excluded: event.target.checked,
                    })
                  )
                }
              />
            }
            label="Exclude location from report"
          />
          {location.locationId.startsWith("NEW_LOCATION") &&
            !location.anySamples && (
              <Button
                variant="outlined"
                color="primary"
                style={{ width: "350px" }}
                onClick={() => {
                  dispatch(setPageId(pageIds.locationsPage));
                  dispatch(deleteNewLocation(location.locationId));
                }}
              >
                Permanently delete location
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}

export default LocationInformation;
