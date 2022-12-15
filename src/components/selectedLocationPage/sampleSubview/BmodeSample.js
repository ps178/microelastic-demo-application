import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getXAxis, getYAxis, thicknessStamp } from "../../sharedComponents";
import {
  convertMmToPixelPosition,
  convertPixelToMmPosition,
} from "../../utilityFunctions";
import {
  setBmodeAutoDetectedThickness,
  setBmodeSampleThickness,
  getSelectedSample,
  fetchGetBmodeImage,
} from "../../../reducerSlices/samplesSlice";
import { getCurrentVisitFolder } from "../../../reducerSlices/visitInfoSlice";
import HeatmapColorbar from "../../locationsPage/HeatmapColorbar";
import {
  Button,
  Divider,
  FormControlLabel,
  Slider,
  Switch,
} from "@mui/material";
// import { useFetchGetBmodeImageMutation } from "../../../reducerSlices/api";
import { updateSnackbarStatus } from "../../../reducerSlices/utilitySlice";
import SharedSettings from "./SharedSampleSettings";

import { calculateAverageThicknessForLocation } from "../../../reducerSlices/locationsSlice";
function BmodeSample() {
  const dispatch = useDispatch();
  const visitFolderpath = useSelector((state) => getCurrentVisitFolder(state));
  const sample = useSelector((state) => {
    let selectedSample = getSelectedSample(state);
    return {
      enabled:
        !selectedSample.processing &&
        selectedSample.dataSaved &&
        !selectedSample.excluded &&
        !selectedSample.alert.status &&
        state.visitInfo.allDataLocal,
      ...selectedSample,
    };
  });
  const [colorLimits, setColorLimits] = React.useState({
    stepSize: 20,
    absoluteLimits: [-60, 0],
    dynamicLimits: [
      parseFloat(sample.plot.colorBar.range[0].toFixed(0)),
      parseFloat(sample.plot.colorBar.range[1].toFixed(0)),
    ],
  });
  const [plotSize, setPlotSize] = React.useState({ width: null, height: null });
  const linePosition = React.useRef({});
  const plotLineOne = React.useRef(null);
  const plotLineTwo = React.useRef(null);
  const plot = React.useRef(null);

  // const [fetchGetBmodeImage, { isLoading }] = useFetchGetBmodeImageMutation();

  React.useEffect(() => {
    setColorLimits({
      ...colorLimits,
      dynamicLimits: [
        parseFloat(sample.plot.colorBar.range[0].toFixed(0)),
        parseFloat(sample.plot.colorBar.range[1].toFixed(0)),
      ],
    });
  }, [sample.id]);

  React.useEffect(() => {
    setPlotSize({
      width: plot.current?.clientWidth,
      height: plot.current?.clientHeight,
    });
    if (plotLineOne.current && plotLineTwo.current && sample.enabled) {
      // Initial placement of the plot lines/regions
      plotLineOne.current.style.top =
        convertMmToPixelPosition(
          sample.topSurface,
          sample.plot.yAxis.range,
          plot.current?.clientHeight
        ) + "px";
      plotLineTwo.current.style.top =
        convertMmToPixelPosition(
          sample.bottomSurface,
          sample.plot.yAxis.range,
          plot.current?.clientHeight
        ) + "px";

      plotLineOne.current.addEventListener("mousedown", handleDown);
      plotLineTwo.current.addEventListener("mousedown", handleDown);
      // Touch Events
      // plotLineOne.addEventListener("touchstart", handleTopDownTouch);
      // plotLineBottom.addEventListener("touchstart", handleBottomDownTouch);
    }
    return function cleanup() {
      if (plotLineOne.current) {
        plotLineOne.current.removeEventListener("mousedown", handleDown);
      }
      if (plotLineTwo.current) {
        plotLineTwo.current.removeEventListener("mousedown", handleDown);
      }
    };
  }, [sample.thickness, sample.id]);

  const handleDown = (e) => {
    if (sample.enabled) {
      linePosition.current = {
        startDragY: e.clientY,
        offset: e.target.offsetTop,
        elementId: e.target.id,
      };
      // console.log("DOWN", linePosition.current.elementId);
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", handleRelease);
    }
  };

  const handleDrag = (e) => {
    let newYPixelPosition =
      linePosition.current.offset -
      (linePosition.current.startDragY - e.clientY);
    // console.log("DRAG", linePosition.current.elementId);
    if (
      newYPixelPosition > 0 &&
      newYPixelPosition < plot.current?.clientHeight
    ) {
      const targetElement = document.getElementById(
        linePosition.current.elementId
      );
      targetElement.style.top = newYPixelPosition + "px";
    }
  };

  const handleRelease = (e) => {
    // console.log("RELEASE", e, linePosition.current.elementId, linePosition, 90);
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleRelease);

    const [top, bottom] = calculateDistance();
    dispatch(
      setBmodeSampleThickness({
        id: sample.id,
        thickness: parseFloat(Math.abs(bottom - top).toFixed(2)),
        topSurface: top,
        bottomSurface: bottom,
      })
    );
    linePosition.current = {};
    changeThickness(false);
  };

  const changeThickness = (autoDetect) => {
    dispatch(
      setBmodeAutoDetectedThickness({
        id: sample.id,
        autoDetect,
      })
    );

    dispatch(calculateAverageThicknessForLocation(sample.locationId));
  };
  const calculateDistance = () => {
    const plotLineOneMM = convertPixelToMmPosition(
      plotLineOne.current.getBoundingClientRect().y -
        plot.current.getBoundingClientRect().top,
      sample.plot.yAxis.range,
      plot.current?.clientHeight
    );

    const plotLineTwoMM = convertPixelToMmPosition(
      plotLineTwo.current.getBoundingClientRect().y -
        plot.current.getBoundingClientRect().top,
      sample.plot.yAxis.range,
      plot.current?.clientHeight
    );

    return [
      plotLineOneMM < plotLineTwoMM ? plotLineOneMM : plotLineTwoMM,
      plotLineOneMM < plotLineTwoMM ? plotLineTwoMM : plotLineOneMM,
    ];
  };

  const handleChangeBmodeLimits = () => {
    setTimeout(function () {
      dispatch(
        fetchGetBmodeImage({
          id: sample.id,
          amplitudeLimits: colorLimits.dynamicLimits,
        })
      );
    }, 500);

    // fetchGetBmodeImage({
    //   id: sample.id,
    //   amplitudeLimits: colorLimits.dynamicLimits,
    //   visitFolderpath: visitFolderpath,
    // })
    //   .unwrap()
    //   .catch((error) => {
    //     setColorLimits({
    //       ...colorLimits,
    //       dynamicLimits: [
    //         parseFloat(sample.plot.colorBar.range[0].toFixed(0)),
    //         parseFloat(sample.plot.colorBar.range[1].toFixed(0)),
    //       ],
    //     });
    //     dispatch(
    //       updateSnackbarStatus({
    //         type: "error",
    //         status: true,
    //         message: error.data?.message,
    //       })
    //     );
    //   });
  };

  return (
    <div class="sample">
      <div class="card shadow--dark sample-plotContainer">
        <div class="sample-plot">
          <hr
            id="plotLineOne"
            ref={plotLineOne}
            class="plotLine plotLine--bmode"
          />
          <hr
            id="plotLineTwo"
            ref={plotLineTwo}
            class="plotLine plotLine--bmode"
          />
          <img id="plot" ref={plot} src={sample.plot.image} />
          {getXAxis(
            [sample.plot.xAxis.range[0], sample.plot.xAxis.range[1]],
            sample.plot.xAxis.label,
            sample.plot.xAxis.unit,
            plot.current?.clientWidth,
            0.5
          )}

          {getYAxis(
            [sample.plot.yAxis.range[0], sample.plot.yAxis.range[1]],
            sample.plot.yAxis.label,
            sample.plot.yAxis.unit,
            plot.current?.clientHeight,
            0.5
          )}
        </div>

        <div class="sample-bmode-colorbar">
          <HeatmapColorbar
            dynamicLimitsYAxis={colorLimits.dynamicLimits}
            absoluteLimitsYAxis={colorLimits.absoluteLimits}
            stepSizeYAxis={colorLimits.stepSize}
            labelYAxis={sample.plot.colorBar.label}
            unitsYAxis={sample.plot.colorBar.unit}
            colorType={"gray"}
            decimalPlace={0}
          />
          <Slider
            disableSwap
            disabled={!sample.enabled}
            className={"heatmapColorbar-slider-yAxis"}
            orientation={"vertical"}
            labelColor={"primary"}
            color={"primary"}
            value={colorLimits.dynamicLimits}
            onChange={(event) =>
              setColorLimits({
                ...colorLimits,
                dynamicLimits:
                  Math.abs(event.target.value[1] - event.target.value[0]) > 0
                    ? event.target.value
                    : colorLimits.dynamicLimits,
              })
            }
            onChangeCommitted={() => handleChangeBmodeLimits()}
            valueLabelDisplay="off"
            min={colorLimits.absoluteLimits[0]}
            max={colorLimits.absoluteLimits[1]}
            step={colorLimits.stepSize}
          />
        </div>
      </div>

      <div
        class="card shadow--dark sample-settings"
        style={{ padding: "1rem 2rem" }}
      >
        <div class="card-content card-content--denseSpacing ">
          {thicknessStamp(sample.thickness)}
          <Divider />
          <FormControlLabel
            control={
              <Switch
                size="large"
                color="primary"
                checked={sample.setToAutoDetectedThickness}
                onChange={(event) => changeThickness(event.target.checked)}
              />
            }
            label={<p class="font--small">Auto-detected thickness</p>}
          />

          {/* <Button
            fullWidth
            variant="outlined"
            className="font--small"
            color="primary"
          >
            Apply Thickness to other Samples
          </Button> */}

          <SharedSettings />
        </div>
      </div>
    </div>
  );
}

export default BmodeSample;
