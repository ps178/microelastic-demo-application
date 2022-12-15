import React from "react";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Icon } from "../sharedComponents";
import MenuItem from "@mui/material/MenuItem";
import { useSelector, useDispatch } from "react-redux";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import ButtonGroup from "@mui/material/ButtonGroup";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import {
  setPageId,
  toggleShowCompletedLocations,
} from "../../reducerSlices/utilitySlice";
import {
  selectLocationById,
  setSelectedLocationId,
} from "../../reducerSlices/locationsSlice";
import {
  addNewLocation,
  selectProtocolLocationById,
} from "../../reducerSlices/protocolSlice";
import { locationProgressPercentage } from "../utilityFunctions";
import HeatmapColorbar from "./HeatmapColorbar";
import MapRegion from "./mapRegion";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Slider from "@mui/material/Slider";
import pageIds from "../../constants/pageMap";

function LocationsPage() {
  const dispatch = useDispatch();

  const locationsById = useSelector((state) =>
    Object.fromEntries(
      state.locations.ids.map((locationId) => {
        let protocolLocation = selectProtocolLocationById(state, locationId);
        let location = selectLocationById(state, locationId);
        return [
          locationId,
          {
            locationName: protocolLocation.name,
            excluded: protocolLocation.excluded,
            progress: locationProgressPercentage(
              location.samplesAcquiredBySampleType,
              protocolLocation.sampleTypes
            ),
            shearwaveSpeed: location.shearwaveSpeed,
            thickness: location.thickness,
            mapCoords: protocolLocation.mapCoords,
            samplesAcquiredBySampleType: location.samplesAcquiredBySampleType,
            sampleTypes: protocolLocation.sampleTypes,
          },
        ];
      })
    )
  );

  const mapsArray = useSelector((state) =>
    Object.keys(state.protocol.examDef.maps).map((mapId) => ({
      mapId: mapId,
      name: state.protocol.examDef.maps[mapId].name,
      image: state.protocol.examDef.maps[mapId].image,
    }))
  );
  const showCompletedLocations = useSelector(
    (state) => state.utility.showCompletedLocations
  );
  const [heatmap, setHeatmap] = React.useState({
    heatmapTypes: {
      shearwaveSpeed: {
        heatmapName: "Shearwave Speed",
        dynamicLimits: [1, 12],
        absoluteLimits: [0, 12],
        units: "m/s",
        stepSize: 2,
      },
      thickness: {
        heatmapName: "Thickness",
        absoluteLimits: [0, 4],
        dynamicLimits: [0, 2],
        units: "mm",
        stepSize: 0.5,
      },
    },
    selectedHeatmapType: "shearwaveSpeed",
  });
  const [newLocationOptions, setNewLocationOptions] = React.useState({
    options: { BLANK: { locationName: "Blank Location" } },
    selectedOptionId: "BLANK",
    openOptions: false,
  });
  const newLocationButtonAnchorRef = React.useRef(null);
  const svgContainer = React.useRef(null);
  const [activeMapStep, setActiveMapStep] = React.useState(0);

  const handleClickAddNewLocation = () => {
    const maxNum = Object.keys(locationsById)
      .filter((locationId) => locationId.startsWith("NEW_LOCATION"))
      .map((locationId) => parseInt(locationId.split("_").pop()))
      .reduce((a, b) => Math.max(a, b), 0);
    dispatch(
      addNewLocation({
        locationId: "NEW_LOCATION_" + (maxNum + 1),
        locationName: "New Location " + (maxNum + 1),
      })
    );
  };

  const handleClickLocation = (locationId) => {
    dispatch(setSelectedLocationId(locationId));
    dispatch(setPageId(pageIds.selectedLocationPage));
  };

  const [mapSize, setImageSize] = React.useState({
    width: null,
    height: null,
  });

  React.useEffect(() => {
    let resizeObserver = new ResizeObserver((entries) => {
      if (entries[0].target && svgContainer.current) {
        const imgHeight = entries[0].target.clientHeight;
        const imgWidth = entries[0].target.clientWidth;
        svgContainer.current.style.height = `${imgHeight}px`;
        svgContainer.current.style.width = `${imgWidth}px`;
        if (imgHeight !== mapSize.height || imgWidth !== mapSize.width) {
          setImageSize({ width: imgWidth, height: imgHeight });
        }
      }
    });
    resizeObserver.observe(document.getElementById("imageMap"));
    return function cleanup() {
      if (document.getElementById("imageMap")) {
        resizeObserver.unobserve(document.getElementById("imageMap"));
      }
    };
  });

  return (
    <div class="app-body locationsPage">
      <div class="locationsPage-map">
        <FormControl className="map-settings" size="small">
          <InputLabel>Heatmap Type</InputLabel>
          <Select
            value={heatmap.selectedHeatmapType}
            onChange={(event) =>
              setHeatmap({
                ...heatmap,
                selectedHeatmapType: event.target.value,
              })
            }
            label={"Heatmap Type"}
          >
            {Object.keys(heatmap.heatmapTypes).map((type) => (
              <MenuItem key={type} value={type}>
                {heatmap.heatmapTypes[type].heatmapName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div class="map-container">
          <img id={"imageMap"} src={mapsArray[activeMapStep].image} />

          <div
            ref={svgContainer}
            style={{
              zIndex: "2",
              position: "absolute",
            }}
          >
            <svg style={{ width: "100%", height: "100%" }}>
              {Object.keys(locationsById)
                .filter(
                  (locationId) =>
                    Object.keys(locationsById[locationId].mapCoords).includes(
                      mapsArray[activeMapStep].mapId
                    ) && !locationsById[locationId].excluded
                )
                .map((locationId) => {
                  return (
                    <MapRegion
                      mapSize={mapSize}
                      heatmap={heatmap}
                      selectedMapId={mapsArray[activeMapStep].mapId}
                      location={locationsById[locationId]}
                      key={locationId}
                      id={locationId}
                      handleClickLocation={(locationId) =>
                        handleClickLocation(locationId)
                      }
                    />
                  );
                })}
            </svg>
          </div>
        </div>

        <div class="locationsPage-map-colorbar">
          <HeatmapColorbar
            unitsYAxis={heatmap.heatmapTypes[heatmap.selectedHeatmapType].units}
            dynamicLimitsYAxis={
              heatmap.heatmapTypes[heatmap.selectedHeatmapType].dynamicLimits
            }
            absoluteLimitsYAxis={
              heatmap.heatmapTypes[heatmap.selectedHeatmapType].absoluteLimits
            }
            stepSizeYAxis={
              heatmap.heatmapTypes[heatmap.selectedHeatmapType].stepSize
            }
          />
          <Slider
            disableSwap
            className={"heatmapColorbar-slider-yAxis"}
            orientation={"vertical"}
            labelColor={"primary"}
            color={"primary"}
            value={
              heatmap.heatmapTypes[heatmap.selectedHeatmapType].dynamicLimits
            }
            onChange={(event) =>
              setHeatmap({
                ...heatmap,
                heatmapTypes: {
                  ...heatmap.heatmapTypes,
                  [heatmap.selectedHeatmapType]: {
                    ...heatmap.heatmapTypes[heatmap.selectedHeatmapType],
                    dynamicLimits:
                      Math.abs(event.target.value[1] - event.target.value[0]) >
                      0
                        ? event.target.value
                        : heatmap.heatmapTypes[heatmap.selectedHeatmapType]
                            .dynamicLimits,
                  },
                },
              })
            }
            valueLabelDisplay="off"
            min={
              heatmap.heatmapTypes[heatmap.selectedHeatmapType]
                .absoluteLimits[0]
            }
            max={
              heatmap.heatmapTypes[heatmap.selectedHeatmapType]
                .absoluteLimits[1]
            }
            step={0.25}
          />
        </div>

        {/* </div> */}
        {mapsArray.length > 1 && (
          <MobileStepper
            className="map-stepper"
            steps={mapsArray.length}
            position="static"
            activeStep={activeMapStep}
            nextButton={
              <Button
                size="small"
                onClick={() =>
                  setActiveMapStep((prevActiveStep) => prevActiveStep + 1)
                }
                disabled={activeMapStep === mapsArray.length - 1}
              >
                <Icon
                  class={`icon--small icon--white ${
                    activeMapStep === mapsArray.length - 1 && "icon--disabled"
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

      <div class="locationsPage-list card shadow--dark">
        <h2 class="card-title">
          {
            Object.keys(locationsById).filter(
              (locationId) =>
                !locationsById[locationId].excluded &&
                locationsById[locationId].progress === 100
            ).length
          }
          /
          {
            Object.keys(locationsById).filter(
              (locationId) => !locationsById[locationId].excluded
            ).length
          }{" "}
          Sites Completed
        </h2>
        <FormControlLabel
          control={
            <Switch
              size="large"
              checked={showCompletedLocations}
              onChange={() => dispatch(toggleShowCompletedLocations())}
            />
          }
          label="Show completed sites"
          style={{ paddingTop: "10px" }}
        />
        <div class="card-content card-content--denseSpacing">
          {Object.keys(locationsById).map(
            (locationId) =>
              !(
                locationsById[locationId].progress === 100 &&
                !showCompletedLocations
              ) && (
                <div
                  key={locationId}
                  class={`locationsPage-locationItem ${
                    locationsById[locationId].excluded &&
                    "locationsPage-locationItem--excluded"
                  }`}
                  onClick={() => handleClickLocation(locationId)}
                >
                  <p
                    class={`${
                      locationsById[locationId].excluded && "font--disabled"
                    }`}
                  >
                    {locationsById[locationId].locationName}{" "}
                  </p>
                  <span
                    style={{
                      width: `${locationsById[locationId].progress}%`,
                    }}
                  />
                </div>
              )
          )}
        </div>

        <div class="card-action">
          {/* <Button
            // style={{
            //   display: "flex",
            //   flexDirection: "column",
            //   justifyContent: "center",
            // }}
            // fullWidth
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => dispatch(setPageId(pageIds.overviewPage))}
          >
            Done
          </Button> */}

          <Button
            color="primary"
            variant="contained"
            // style={{
            //   display: "flex",
            //   flexDirection: "column",
            //   justifyContent: "center",
            // }}
            fullWidth
            onClick={() => handleClickAddNewLocation()}
          >
            Add New Blank Site
          </Button>

          {/* <ButtonGroup
            // style={{
            //   width: "100%",
            // }}
            color="primary"
            variant="contained"
            // className="button-cancel"
            ref={newLocationButtonAnchorRef}
          >
            <Button
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
              // fullWidth
              onClick={() => handleClickAddNewLocation()}
            >
              + */}
          {/* <p class="font--extrasmall">
                {
                  newLocationOptions.options[
                    newLocationOptions.selectedOptionId
                  ].locationName
                }
              </p> */}
          {/* </Button>
            <Button
              size="small"
              onClick={() =>
                setNewLocationOptions({
                  ...newLocationOptions,
                  openOptions: true,
                })
              }
            >
              <Icon class="icon--small icon--white" id="arrow_up" />
            </Button>
          </ButtonGroup> */}

          {/* <Popper
            sx={{
              zIndex: 1,
            }}
            open={newLocationOptions.openOptions}
            anchorEl={newLocationButtonAnchorRef.current}
            transition
          >
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
                // style={{
                //   transformOrigin: "left top",
                // }}
              >
                <Paper>
                  <ClickAwayListener
                    onClickAway={() =>
                      setNewLocationOptions({
                        ...newLocationOptions,
                        openOptions: false,
                      })
                    }
                  >
                    <MenuList>
                      {Object.keys(newLocationOptions.options).map(
                        (optionId) => (
                          <MenuItem
                            key={optionId}
                            selected={
                              optionId === newLocationOptions.selectedOptionId
                            }
                            onClick={() =>
                              setNewLocationOptions({
                                ...newLocationOptions,
                                selectedOptionId: optionId,
                                openOptions: false,
                              })
                            }
                          >
                            {newLocationOptions.options[optionId].locationName}
                          </MenuItem>
                        )
                      )}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper> */}
        </div>
      </div>
    </div>
  );
}

export default LocationsPage;
