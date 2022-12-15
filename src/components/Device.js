import React from "react";
import { useSelector, useDispatch } from "react-redux";
import pageIds, { locationSubviews } from "../constants/pageMap";
import { Icon } from "./sharedComponents";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Popover from "@mui/material/Popover";
import DialogCalibration from "./DialogCalibration";
import { nanoid } from "@reduxjs/toolkit";
import {
  setLocationSubview,
  toggleAutoAdvance,
  updateSnackbarStatus,
} from "../reducerSlices/utilitySlice";
import IconButton from "@mui/material/IconButton";
import { LineChart, Line, XAxis, YAxis, ReferenceLine } from "recharts";
import {
  closeDevice,
  setAcquiring,
  setAlineData,
} from "../reducerSlices/deviceSlice";
import { getSelectedProtocolLocation } from "../reducerSlices/protocolSlice";
import {
  calculateAverageThicknessForLocation,
  calculateAverageSwsForLocation,
  getSelectedLocation,
} from "../reducerSlices/locationsSlice";
import {
  addNewSample,
  deleteAcqErrorSample,
  setSelectedSampleId,
  updateSample,
} from "../reducerSlices/samplesSlice";
import { Divider, Tooltip } from "@mui/material";
import { locationProgressPercentage } from "./utilityFunctions";
import aline from "../constants/fixtureFiles/aline.json";

function Device(props) {
  // Redux state
  const dispatch = useDispatch();
  const currentViewId = useSelector((state) => state.utility.pageId);
  const device = useSelector((state) => state.device);
  const selectedLocation = useSelector((state) => {
    let selectedLocationProtocol = getSelectedProtocolLocation(state);
    let selectedLocation = getSelectedLocation(state);
    return {
      id: selectedLocationProtocol?.id,
      sampleTypes: selectedLocationProtocol?.sampleTypes,
      paramTable: selectedLocationProtocol
        ? Object.fromEntries(
            Object.keys(selectedLocationProtocol.sampleTypes).map(
              (sampleType) => [
                sampleType,
                selectedLocationProtocol.sampleTypes[sampleType].paramId,
              ]
            )
          )
        : {},
      samplesAcquiredBySampleType:
        selectedLocation?.samplesAcquiredBySampleType,
      samplesExcludedBySampleType:
        selectedLocation?.samplesExcludedBySampleType,
    };
  });
  //Local State
  const [acqMode, setAcqMode] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [calibrationDialogOpen, setCalibrationDialogOpen] =
    React.useState(null);

  const handleClickSimulateAcquire = () => {
    // props.deviceSocket.emit("get_fixture_sample");
    let uuid = nanoid();
    let response = {
      uuid: uuid,
      locationId: selectedLocation.id,
      sampleType: acqMode,
    };

    dispatch(setAcquiring(true));
    dispatch(addNewSample({ ...response }));

    setTimeout(function () {
      dispatch(setAcquiring(false));
    }, 500);

    //1) Add sample data to redux
    dispatch(updateSample({ ...response }));
    //2) Auto-navigate to the sample to view the sample image
    if (
      currentViewId === pageIds.selectedLocationPage &&
      selectedLocation.id === response.locationId
    ) {
      dispatch(setLocationSubview(locationSubviews.sample));
      dispatch(setSelectedSampleId(response.uuid));
      //3) Auto-advance sample type
      let locationProgress = locationProgressPercentage(
        {
          ...selectedLocation.samplesAcquiredBySampleType,
          [response.sampleType]:
            selectedLocation.samplesAcquiredBySampleType[response.sampleType] +
            1,
        },
        selectedLocation.sampleTypes
      );
      if (
        device.autoAdvace &&
        locationProgress < 100 &&
        selectedLocation.samplesAcquiredBySampleType[response.sampleType] +
          1 -
          selectedLocation.samplesExcludedBySampleType[response.sampleType] >=
          selectedLocation.sampleTypes[response.sampleType].requiredNumber
      ) {
        handleClickSimulateModeChange(true);
      }
    }
    //4) Recalculate averages for location
    if (response.sampleType === "BMODE") {
      dispatch(calculateAverageThicknessForLocation(response.locationId));
    } else {
      dispatch(calculateAverageSwsForLocation(response.locationId));
    }
  };

  const handleClickSimulateModeChange = (inform = false) => {
    let acqModeOptions = Object.keys(selectedLocation.paramTable);
    let newAcqMode =
      acqModeOptions.indexOf(acqMode) === acqModeOptions.length - 1
        ? acqModeOptions[0]
        : acqModeOptions[acqModeOptions.indexOf(acqMode) + 1];

    // props.deviceSocket.emit("set_mode", {
    //   acqMode: newAcqMode,
    //   paramTable: selectedLocation.paramTable,
    //   locationId: selectedLocation.id,
    // });
    setAcqMode(newAcqMode);
    if (inform) {
      dispatch(
        updateSnackbarStatus({
          type: "success",
          message: `Completed ${selectedLocation.sampleTypes[acqMode].displayName} samples. Changing device mode to ${selectedLocation.sampleTypes[newAcqMode].displayName}`,
        })
      );
    }
  };

  const handleClickPing = () => {
    // props.deviceSocket.emit("get_aline");
    dispatch(setAlineData({ ...aline }));
  };

  const setLocationParam = () => {
    if (
      currentViewId === pageIds.selectedLocationPage &&
      selectedLocation.id &&
      device.connected
    ) {
      // props.deviceSocket.emit("set_mode", {
      //   acqMode: Object.keys(selectedLocation.paramTable)[0],
      //   paramTable: selectedLocation.paramTable,
      //   locationId: selectedLocation.id,
      // });
      // props.deviceSocket.emit("set_pause", { pause: false });
      setAcqMode(Object.keys(selectedLocation.paramTable)[0]);
    }
  };
  React.useEffect(() => {
    // Pause and Unpause device
    if (device.connected) {
      if (currentViewId !== pageIds.selectedLocationPage) {
        // props.deviceSocket.emit("set_pause", { pause: true });
      } else {
        setLocationParam();
      }
    }
  }, [device.connected, selectedLocation.id, currentViewId]);

  const handleSampleCompleted = React.useCallback(
    (response) => {
      //1) Add sample data to redux
      dispatch(updateSample({ ...response }));
      //2) Auto-navigate to the sample to view the sample image
      if (
        currentViewId === pageIds.selectedLocationPage &&
        selectedLocation.id === response.locationId
      ) {
        dispatch(setLocationSubview(locationSubviews.sample));
        dispatch(setSelectedSampleId(response.uuid));
        //3) Auto-advance sample type
        let locationProgress = locationProgressPercentage(
          {
            ...selectedLocation.samplesAcquiredBySampleType,
            [response.sampleType]:
              selectedLocation.samplesAcquiredBySampleType[
                response.sampleType
              ] + 1,
          },
          selectedLocation.sampleTypes
        );
        if (
          device.autoAdvace &&
          locationProgress < 100 &&
          selectedLocation.samplesAcquiredBySampleType[response.sampleType] +
            1 -
            selectedLocation.samplesExcludedBySampleType[response.sampleType] >=
            selectedLocation.sampleTypes[response.sampleType].requiredNumber
        ) {
          handleClickSimulateModeChange(true);
        }
      }
      //4) Recalculate averages for location
      if (response.sampleType === "BMODE") {
        dispatch(calculateAverageThicknessForLocation(response.locationId));
      } else {
        dispatch(calculateAverageSwsForLocation(response.locationId));
      }
    },
    [
      selectedLocation.id,
      device.autoAdvace,
      selectedLocation.samplesAcquiredBySampleType,
      selectedLocation.samplesExcludedBySampleType,
      handleClickSimulateModeChange,
    ]
  );

  // React.useEffect(() => {
  //   props.deviceSocket.on("button_press_mode", (response) => {
  //     console.log("button_press_mode", response);
  //     setAcqMode(response.mode);
  //   });
  //   props.deviceSocket.on("button_press_acq", (response) => {
  //     console.log("button_press_acq", response);
  //     dispatch(setAcquiring(true));
  //     dispatch(addNewSample({ ...response }));
  //   });
  //   props.deviceSocket.on("acq_complete", (response) => {
  //     dispatch(setAcquiring(false));
  //     console.log("acq_complete", response);
  //   });
  //   props.deviceSocket.on("processing_complete", handleSampleCompleted);

  //   props.deviceSocket.on("sample_error", (response) => {
  //     console.log("sample_error", response);
  //     dispatch(deleteAcqErrorSample({ ...response }));
  //     dispatch(
  //       updateSnackbarStatus({ type: "error", message: response.message })
  //     );
  //   });
  //   props.deviceSocket.on("aline", (response) => {
  //     console.log("aline", response);
  //     dispatch(setAlineData({ ...response }));
  //   });
  //   return function cleanup() {
  //     props.deviceSocket.off("button_press_acq");
  //     props.deviceSocket.off("button_press_mode");
  //     props.deviceSocket.off("acq_complete");
  //     props.deviceSocket.off("processing_complete", handleSampleCompleted);
  //     props.deviceSocket.off("sample_error");
  //     props.deviceSocket.off("aline");
  //   };
  // }, [handleSampleCompleted]);

  const handleToggleAcquisitionMode = () => {
    if (device.connected) {
      // props.deviceSocket.emit("close_device");
      dispatch(closeDevice());
    } else {
      setAnchorEl(null);
      setCalibrationDialogOpen(true);
    }
  };

  const handleCloseDialogSuccessfully = () => {
    setLocationParam();

    setCalibrationDialogOpen(false);
  };

  const DeviceLed = () => {
    if (!device.connected) {
      return <div class="device-led led--red"></div>;
    } else if (
      [pageIds.overviewPage, pageIds.formsPage, pageIds.locationsPage].includes(
        currentViewId
      )
    ) {
      return <div class="device-led led--yellow"></div>;
    } else if (
      currentViewId === pageIds.selectedLocationPage &&
      acqMode === "BMODE"
    ) {
      return <div class="device-led led--secondary"></div>;
    } else if (
      currentViewId === pageIds.selectedLocationPage &&
      ["SINGLE", "STL", "SWIPE"].includes(acqMode)
    ) {
      return <div class="device-led led--tertiary"></div>;
    }
  };
  return (
    <>
      <Tooltip title="Device Menu" arrow>
        <Button
          color="primary"
          variant="outlined"
          className="device-button"
          onClick={(event) => setAnchorEl(event.target)}
          id="device_button"
        >
          <Icon class="icon--white icon--medium" id="device" />
          <DeviceLed />
        </Button>
      </Tooltip>
      {device.simulate && (
        <>
          <Tooltip title="Acquisition Button" arrow>
            <IconButton
              disableRipple
              style={{ padding: "0 10px" }}
              onClick={() => handleClickSimulateAcquire()}
              disabled={[
                pageIds.overviewPage,
                pageIds.formsPage,
                pageIds.locationsPage,
              ].includes(currentViewId)}
            >
              <Icon
                id="bullseye"
                class={`icon--medium icon--white ${
                  currentViewId !== pageIds.selectedLocationPage &&
                  "icon--disabled"
                }`}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="Device Mode Button" arrow>
            <IconButton
              disableRipple
              style={{ padding: "0 10px" }}
              onClick={() => handleClickSimulateModeChange()}
              disabled={[
                pageIds.overviewPage,
                pageIds.formsPage,
                pageIds.locationsPage,
              ].includes(currentViewId)}
            >
              <Icon
                id="mode"
                class={`icon--medium icon--white ${
                  currentViewId !== pageIds.selectedLocationPage &&
                  "icon--disabled"
                }`}
              />
            </IconButton>
          </Tooltip>
        </>
      )}
      <Popover
        anchorEl={document.getElementById("device_button")}
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          className: "device-menu",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <FormControlLabel
          className="device-menu-acqMode"
          control={
            <Switch
              size="large"
              color="primary"
              checked={device.connected}
              onChange={() => handleToggleAcquisitionMode()}
            />
          }
          label={"Acquisition Mode"}
        />
        <FormControlLabel
          className="device-menu-autoAdvance"
          control={
            <Switch
              size="large"
              color="primary"
              disabled={!device.connected}
              checked={device.autoAdvace}
              onChange={() => dispatch(toggleAutoAdvance())}
            />
          }
          label={"Auto-Advance"}
        />
        <div class="device-menu-health">
          <Divider variant="device" />
          <p class="subheader font--extrasmall ">Device Calibration</p>
          <p class="padding--top">
            Device health check:{" "}
            {device.connected
              ? device.simulate
                ? "SIMULATION"
                : device.isHealthy
                ? "Passed"
                : "Failed"
              : "-"}
          </p>
          <p>Calibration thickness: {device.calibGelThickness || "- "}mm</p>
          <p>Calibration speed: {device.calibGelSws || "- "}m/s</p>
        </div>
        <div>
          <Divider variant="device" />
          <p class="subheader font--extrasmall ">Device A-Line</p>
          <LineChart
            width={360}
            height={160}
            data={
              device.aLineData.data
                ? device.aLineData.data.map((point) => ({
                    name: point[0],
                    value: point[1],
                  }))
                : []
            }
            margin={{
              top: 20,
              right: 20,
              left: -35,
              bottom: 25,
            }}
          >
            <XAxis
              dataKey="name"
              label={{
                value: "Distance (mm)",
                offset: -20,
                position: "insideBottom",
              }}
              interval={"preserveStartEnd"}
              tickCount={12}
              type="number"
              domain={[0, 20]}
            />
            <YAxis
              dataKey="value"
              interval={"preserveStartEnd"}
              type="number"
              domain={[-1, 1]}
            />
            <Line type="monotone" dataKey="value" dot={false} />
            <ReferenceLine
              x={device.aLineData?.depthLine || null}
              label={{
                position: "top",
                value: "Detected Gel Surface",
                fontSize: 14,
              }}
            />
          </LineChart>
        </div>
        <Button
          className="device-menu-ping"
          variant="outlined"
          color="primary"
          fullWidth
          disabled={!device.connected || device.acquiring}
          onClick={() => handleClickPing()}
        >
          Grab A-Line
        </Button>
      </Popover>

      {calibrationDialogOpen && (
        <DialogCalibration
          // deviceSocket={props.deviceSocket}
          open={calibrationDialogOpen}
          closeDialog={() => setCalibrationDialogOpen(false)}
          handleCloseDialogSuccessfully={() => handleCloseDialogSuccessfully()}
        />
      )}
    </>
  );
}

export default Device;
