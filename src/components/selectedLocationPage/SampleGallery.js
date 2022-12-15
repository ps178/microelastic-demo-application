import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "../sharedComponents";
import IconButton from "@mui/material/IconButton";
import {
  setLocationSubview,
  toggleShowExcludedSamples,
} from "../../reducerSlices/utilitySlice";
import { setSelectedSampleId } from "../../reducerSlices/samplesSlice";
import { locationSubviews } from "../../constants/pageMap";
import { selectSampleById } from "../../reducerSlices/samplesSlice";
import { selectLocationById } from "../../reducerSlices/locationsSlice";
import devGif from "../../constants/dev.gif";
import { CircularProgress, FormControlLabel, Switch } from "@mui/material";
function SampleGallery() {
  const dispatch = useDispatch();
  const showExcludedSamples = useSelector(
    (state) => state.utility.showExcludedSamples
  );

  const selectedSampleId = useSelector(
    (state) => state.samples.selectedSampleId
  );

  const samplesById = useSelector((state) =>
    Object.fromEntries(
      selectLocationById(
        state,
        state.locations.selectedLocationId
      ).sampleIds.map((sampleId) => [
        sampleId,
        {
          image: selectSampleById(state, sampleId).plot.image,
          excluded: selectSampleById(state, sampleId).excluded,
          alert: selectSampleById(state, sampleId).alert.status,
          sampleType: selectSampleById(state, sampleId).sampleType,
          selectable: selectSampleById(state, sampleId).selectable,
          processing: selectSampleById(state, sampleId).processing,
        },
      ])
    )
  );

  const [width, setWidth] = React.useState(135);
  const handleSampleClick = (sampleId) => {
    if (samplesById[sampleId].selectable) {
      dispatch(setSelectedSampleId(sampleId));
      dispatch(setLocationSubview(locationSubviews.sample));
    }
  };

  React.useEffect(() => {
    const selectedSampleItem = document.getElementById(selectedSampleId);
    const scrollableContainer = document.getElementById("sample_image_row");
    if (selectedSampleItem !== null && scrollableContainer !== null) {
      const selectedWidth = selectedSampleItem.offsetWidth;
      const selectedDistanceFromLeft = selectedSampleItem.offsetLeft;
      const scrollableContainerWidth = scrollableContainer.offsetWidth;
      const scrollableContainerDistanceFromLeft =
        scrollableContainer.offsetLeft;

      // TODO:  Don't think we need to account for scrolling back. We only need to auto forward scroll when a new sample is added at the end of the list
      // if (
      //   scrollableContainerDistanceFromLeft < selectedDistanceFromLeft &&
      //   selectedDistanceFromLeft <
      //     scrollableContainerDistanceFromLeft +
      //       scrollableContainerWidth -
      //       selectedWidth
      // ) {
      //   // Do nothing. Sample image is visible
      // } else if (
      //   selectedDistanceFromLeft < scrollableContainerDistanceFromLeft
      // ) {
      //   // Scroll BACK to image
      //   scrollableContainer.scrollTo({
      //     left: selectedDistanceFromLeft,
      //     behavior: "smooth",
      //   });
      // } else
      if (
        selectedDistanceFromLeft >
        scrollableContainerDistanceFromLeft +
          scrollableContainerWidth -
          selectedWidth
      ) {
        // Scroll FORWARD to sample
        scrollableContainer.scrollTo({
          left:
            selectedDistanceFromLeft + selectedWidth - scrollableContainerWidth,
          behavior: "smooth",
        });
      }
    }
  }, [selectedSampleId]);
  return (
    <div class="selectedLocationPage-gallery">
      {Object.keys(samplesById).length === 0 ? (
        <div style={{ display: "grid", gridTemplate: "1fr/72px 1fr" }}>
          <Icon class="icon--white icon--extralarge" id="handle" />
          <p>
            Ready to acquire samples. Press the acquire button on the device
            handle to take a measurement.{" "}
          </p>
        </div>
      ) : (
        <div
          id={"sample_image_row"}
          class="selectedLocationPage-gallery-row"
          style={{ gridAutoColumns: `minmax(${width}px, ${width}px)` }}
        >
          {Object.keys(samplesById)
            .filter(
              (sampleId) =>
                !(!showExcludedSamples && samplesById[sampleId].excluded)
            )
            .map((sampleId) => (
              <div
                onClick={() => handleSampleClick(sampleId)}
                class={`selectedLocationPage-gallery-image  ${
                  samplesById[sampleId].sampleType === "BMODE"
                    ? sampleId === selectedSampleId
                      ? "selectedLocationPage-gallery-image--secondary--selected"
                      : "selectedLocationPage-gallery-image--secondary"
                    : sampleId === selectedSampleId
                    ? "selectedLocationPage-gallery-image--tertiary--selected"
                    : "selectedLocationPage-gallery-image--tertiary"
                }`}
                key={sampleId}
                id={sampleId}
              >
                {samplesById[sampleId].processing && <CircularProgress />}

                {samplesById[sampleId].image && (
                  <img src={samplesById[sampleId].image} alt="sample image" />
                )}

                {samplesById[sampleId].excluded ? (
                  <Icon
                    id="cross"
                    class="icon--small icon--white icon--bkg sample-badge"
                  />
                ) : (
                  samplesById[sampleId].alert && (
                    <Icon
                      id="warning"
                      class="icon--medium icon--warning icon--bkg sample-badge "
                    />
                  )
                )}
              </div>
            ))}

          {/* <div
          class={`selectedLocationPage-gallery-image selectedLocationPage-gallery-image--primary`}
        >
          <img src={devGif} />
        </div> */}
        </div>
      )}
      {Object.keys(samplesById).length !== 0 && (
        <div class="selectedLocationPage-gallery-settings">
          <FormControlLabel
            control={
              <Switch
                size="large"
                checked={showExcludedSamples}
                onChange={() => dispatch(toggleShowExcludedSamples())}
              />
            }
            sx={{ margin: "0px" }}
            label={<p class="font--small">Show excluded</p>}
          />
          <div class="buttonGroup">
            <IconButton
              disableRipple
              onClick={() => setWidth(width + 10)}
              disabled={width > 175}
            >
              <Icon
                id="zoomIn"
                class={`icon--small icon--white ${
                  width > 175 && "icon--disabled"
                }`}
              />
            </IconButton>
            <hr class="divider-button" />
            <IconButton
              disableRipple
              onClick={() => setWidth(width - 10)}
              disabled={width < 95}
            >
              <Icon
                id="zoomOut"
                class={`icon--small icon--white ${
                  width < 95 && "icon--disabled"
                }`}
              />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default SampleGallery;
