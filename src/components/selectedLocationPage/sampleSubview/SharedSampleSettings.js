import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  selectAllProtocolLocations,
  selectProtocolLocationById,
} from "../../../reducerSlices/protocolSlice";
import {
  setSampleNotes,
  setSampleExcluded,
  getSelectedSample,
  changeSampleLocation,
} from "../../../reducerSlices/samplesSlice";
import {
  calculateAverageThicknessForLocation,
  calculateAverageSwsForLocation,
} from "../../../reducerSlices/locationsSlice";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import { setLocationSubview } from "../../../reducerSlices/utilitySlice";
import { locationSubviews } from "../../../constants/pageMap";

function SharedSettings() {
  const dispatch = useDispatch();
  const sample = useSelector((state) => getSelectedSample(state));
  // const color = sample.sampleType === "BMODE" ? "secondary" : "tertiary";
  const locationsById = useSelector((state) => {
    let selectedSample = getSelectedSample(state);
    let sampleLocationParam = selectProtocolLocationById(
      state,
      selectedSample.locationId
    ).sampleTypes[selectedSample.sampleType].paramId;
    let locations = selectAllProtocolLocations(state);
    return Object.fromEntries(
      Object.keys(locations)
        .filter(
          (locationId) =>
            !locations[locationId].excluded &&
            locations[locationId].sampleTypes[selectedSample.sampleType]
              .paramId === sampleLocationParam
        )
        .map((locationId) => [locationId, locations[locationId].name])
    );
  });

  const handleChangeLocation = (event) => {
    dispatch(setLocationSubview(locationSubviews.locationInformation));
    dispatch(
      changeSampleLocation({
        id: sample.id,
        sampleType: sample.sampleType,
        newLocationId: event.target.value,
        oldLocationId: sample.locationId,
      })
    );
  };

  const handleToggleExcluded = (event) => {
    dispatch(
      setSampleExcluded({
        id: sample.id,
        locationId: sample.locationId,
        sampleType: sample.sampleType,
        excluded: event.target.checked,
      })
    );
    if (sample.sampleType === "BMODE") {
      dispatch(calculateAverageThicknessForLocation(sample.locationId));
    } else {
      dispatch(calculateAverageSwsForLocation(sample.locationId));
    }
  };

  return (
    <div class="card-content card-content--denseSpacing ">
      <TextField
        label={<p class="font--small">Sample Notes</p>}
        multiline
        rows={2}
        color={"primary"}
        inputProps={{ className: "font--small" }}
        value={sample.notes}
        onChange={(event) =>
          dispatch(
            setSampleNotes({
              id: sample.id,
              notes: event.target.value,
            })
          )
        }
      />

      <FormControl>
        <InputLabel color={"primary"}>Location</InputLabel>
        <Select
          color={"primary"}
          value={sample.locationId}
          onChange={(event) => handleChangeLocation(event)}
          label="Location"
          size="small"
          inputProps={{ className: "font--small" }}
        >
          {Object.keys(locationsById).map((locationId) => (
            <MenuItem
              className="font--small"
              color={"primary"}
              key={locationId}
              value={locationId}
            >
              {locationsById[locationId]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            size="large"
            color={"primary"}
            checked={sample.excluded}
            onChange={(event) => handleToggleExcluded(event)}
          />
        }
        label={<p class="font--small">Exclude sample</p>}
      />
    </div>
  );
}

export default SharedSettings;
