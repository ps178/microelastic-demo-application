import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { elasticityStamp, getXAxis, getYAxis } from "../../sharedComponents";
import {
  convertMmToPixel,
  convertMmToPixelPosition,
  convertPixelToMmPosition,
} from "../../utilityFunctions";
import {
  fetchGetSwsImage,
  fetchGetSwsValue,
  getSelectedSample,
} from "../../../reducerSlices/samplesSlice";
import HeatmapColorbar from "../../locationsPage/HeatmapColorbar";
import { Button, Divider, Slider } from "@mui/material";
// import {
//   useFetchGetSwsImageMutation,
//   useFetchGetSwsValueMutation,
// } from "../../../reducerSlices/api";
import { updateSnackbarStatus } from "../../../reducerSlices/utilitySlice";
import { getCurrentVisitFolder } from "../../../reducerSlices/visitInfoSlice";
import { calculateAverageSwsForLocation } from "../../../reducerSlices/locationsSlice";
import SharedSettings from "./SharedSampleSettings";

function CsiSample() {
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

  const [plotSize, setPlotSize] = React.useState({ width: null, height: null });
  const [percentSliceWidth, setPercentSliceWidth] = React.useState(
    sample.percentSliceWidth
  );
  const [colorLimits, setColorLimits] = React.useState({
    absoluteLimitsYAxis: [0, 12],
    stepSizeYAxis: 4,
    dynamicLimitsYAxis: [
      parseFloat(sample.plot.colorBar.yAxis.range[0].toFixed(0)),
      parseFloat(sample.plot.colorBar.yAxis.range[1].toFixed(0)),
    ],

    absoluteLimitsXAxis: [-60, 0],
    stepSizeXAxis: 30,
    dynamicLimitsXAxis: [
      parseFloat(sample.plot.colorBar.xAxis.range[0].toFixed(0)),
      parseFloat(sample.plot.colorBar.xAxis.range[1].toFixed(0)),
    ],
  });
  const linePosition = React.useRef({});
  const plotLineOne = React.useRef(null);
  const plotLineTwo = React.useRef(null);
  const plotRoiRegion = React.useRef(null);
  const plot = React.useRef(null);

  // const [fetchGetSwsImage, { isLoading }] = useFetchGetSwsImageMutation();
  // const [fetchGetSwsValue, { isLoading: isLoadingSwsValue }] =
  //   useFetchGetSwsValueMutation();

  React.useEffect(() => {
    setColorLimits({
      ...colorLimits,
      dynamicLimitsXAxis: [
        parseFloat(sample.plot.colorBar.xAxis.range[0].toFixed(0)),
        parseFloat(sample.plot.colorBar.xAxis.range[1].toFixed(0)),
      ],
      dynamicLimitsYAxis: [
        parseFloat(sample.plot.colorBar.yAxis.range[0].toFixed(0)),
        parseFloat(sample.plot.colorBar.yAxis.range[1].toFixed(0)),
      ],
    });
  }, [sample.id]);

  React.useEffect(() => {
    setPlotSize({
      width: document.getElementById("plot")?.clientWidth,
      height: document.getElementById("plot")?.clientHeight,
    });

    if (
      plotLineOne.current &&
      plotLineTwo.current &&
      plotRoiRegion.current &&
      sample.enabled
    ) {
      // Initial placement of the plot lines/regions
      plotLineOne.current.style.top =
        localConvertMmtoPixelPosition(sample.z - sample.dz / 2) + "px"; // -5px to compensate for the 5px thick border of the line
      plotLineTwo.current.style.top =
        localConvertMmtoPixelPosition(sample.z + sample.dz / 2) + "px";
      plotRoiRegion.current.style.top =
        localConvertMmtoPixelPosition(
          sample.z - (sample.dz * sample.percentSliceWidth) / 100 / 2
        ) + "px";
      plotRoiRegion.current.style.height =
        localConvertMmtoPixel((sample.dz * sample.percentSliceWidth) / 100) +
        "px";

      plotLineOne.current.addEventListener("mousedown", handleDown);
      plotLineTwo.current.addEventListener("mousedown", handleDown);
      plotRoiRegion.current.addEventListener("mousedown", handleDown);
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
      if (plotRoiRegion.current) {
        plotRoiRegion.current.removeEventListener("mousedown", handleDown);
      }
    };
  }, [sample.percentSliceWidth, sample.id, sample.dz, sample.z]);

  function localConvertMmtoPixelPosition(value) {
    return convertMmToPixelPosition(
      value,
      sample.plot.yAxis.range,
      plot.current?.clientHeight
    );
  }
  function localConvertMmtoPixel(value) {
    return convertMmToPixel(
      value,
      sample.plot.yAxis.range,
      plot.current?.clientHeight
    );
  }

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
    console.log(
      "DRAG",
      linePosition.current.elementId,
      newYPixelPosition,
      plot.current.clientHeight
    );

    if (
      newYPixelPosition > 0 &&
      newYPixelPosition < plot.current?.clientHeight
    ) {
      const targetElement = document.getElementById(
        linePosition.current.elementId
      );
      targetElement.style.top = newYPixelPosition + "px";
      if (
        ["plotLineOne", "plotLineTwo"].includes(linePosition.current.elementId)
      ) {
        let [lineOne, lineTwo] = calculateDistance();
        plotRoiRegion.current.style.top =
          localConvertMmtoPixelPosition(
            (lineTwo + lineOne) / 2 -
              (Math.abs(lineTwo - lineOne) * sample.percentSliceWidth) / 100 / 2
          ) + "px";
        plotRoiRegion.current.style.height =
          localConvertMmtoPixel(
            (Math.abs(lineTwo - lineOne) * sample.percentSliceWidth) / 100
          ) + "px";
      } else if (linePosition.current.elementId === "plotRoiRegion") {
        plotLineOne.current.style.top =
          newYPixelPosition -
          localConvertMmtoPixel(
            (sample.dz * (1 - sample.percentSliceWidth / 100)) / 2
          ) +
          "px";
        plotLineTwo.current.style.top =
          newYPixelPosition +
          localConvertMmtoPixel(
            (sample.dz * (1 - sample.percentSliceWidth / 100)) / 2
          ) +
          localConvertMmtoPixel(sample.dz * (sample.percentSliceWidth / 100)) +
          "px";
      }
    }
  };

  const handleRelease = (e) => {
    // console.log("RELEASE", linePosition.current.elementId);
    let [lineOne, lineTwo] = calculateDistance();
    handleRoiChange([lineOne, lineTwo], sample.percentSliceWidth);
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleRelease);
    linePosition.current = {};
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

  const handleChangeColorLimits = () => {
    setTimeout(function () {
      dispatch(
        fetchGetSwsImage({
          id: sample.id,
          swsLimits: colorLimits.dynamicLimitsYAxis,
        })
      );
    }, 500);

    // fetchGetSwsImage({
    //   id: sample.id,
    //   swsLimits: colorLimits.dynamicLimitsYAxis,
    //   bLimits: colorLimits.dynamicLimitsXAxis,
    //   visitFolderpath: visitFolderpath,
    // })
    //   .unwrap()
    //   .catch((error) => {
    //     console.log(error);
    //     setColorLimits({
    //       ...colorLimits,
    //       dynamicLimitsXAxis: [
    //         parseFloat(sample.plot.colorBar.xAxis.range[0].toFixed(0)),
    //         parseFloat(sample.plot.colorBar.xAxis.range[1].toFixed(0)),
    //       ],
    //       dynamicLimitsYAxis: [
    //         parseFloat(sample.plot.colorBar.yAxis.range[0].toFixed(0)),
    //         parseFloat(sample.plot.colorBar.yAxis.range[1].toFixed(0)),
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

  const handleRoiChange = (thicknessRange, percentSliceWidth) => {
    setTimeout(function () {
      dispatch(
        fetchGetSwsValue({
          id: sample.id,
          dz: thicknessRange,
          percentSliceWidth: percentSliceWidth,
        })
      );
    }, 200);
    dispatch(calculateAverageSwsForLocation(sample.locationId));
    // fetchGetSwsValue({
    //   id: sample.id,
    //   dz: thicknessRange,
    //   percentSliceWidth: percentSliceWidth,
    // })
    //   .unwrap()
    //   .then(() => {
    //     dispatch(calculateAverageSwsForLocation(sample.locationId));
    //   })
    //   .catch((error) => {
    //     console.log(error);
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
            class="plotLine plotLine--csi"
          />
          <hr id="plotRoiRegion" ref={plotRoiRegion} class="plotRegion" />
          <hr
            id="plotLineTwo"
            ref={plotLineTwo}
            class="plotLine plotLine--csi"
          />
          <img id="plot" ref={plot} src={sample.plot.image} />
          {getXAxis(
            [sample.plot.xAxis.range[0], sample.plot.xAxis.range[1]],
            sample.plot.xAxis.label,
            sample.plot.xAxis.unit,
            plotSize.width,
            0.5
          )}

          {getYAxis(
            [sample.plot.yAxis.range[0], sample.plot.yAxis.range[1]],
            sample.plot.yAxis.label,
            sample.plot.yAxis.unit,
            plotSize.height,
            0.5
          )}
        </div>
        <div class="sample-csi-colorbar">
          <HeatmapColorbar
            dynamicLimitsYAxis={colorLimits.dynamicLimitsYAxis}
            absoluteLimitsYAxis={colorLimits.absoluteLimitsYAxis}
            stepSizeYAxis={colorLimits.stepSizeYAxis}
            labelYAxis={sample.plot.colorBar.yAxis.label}
            unitsYAxis={sample.plot.colorBar.yAxis.unit}
            colorType={"mix"}
            decimalPlace={0}
            // absoluteLimitsXAxis={colorLimits.absoluteLimitsXAxis}
            // dynamicLimitsXAxis={colorLimits.dynamicLimitsXAxis}
            // stepSizeXAxis={colorLimits.stepSizeXAxis}
            // labelXAxis={sample.plot.colorBar.xAxis.label}
            // unitsXAxis={sample.plot.colorBar.xAxis.unit}
          />
          <Slider
            disableSwap
            disabled={!sample.enabled}
            className={"heatmapColorbar-slider-yAxis"}
            orientation={"vertical"}
            labelColor={"primary"}
            color={"primary"}
            value={colorLimits.dynamicLimitsYAxis}
            onChange={(event) =>
              setColorLimits({
                ...colorLimits,
                dynamicLimitsYAxis:
                  Math.abs(event.target.value[1] - event.target.value[0]) > 0
                    ? event.target.value
                    : colorLimits.dynamicLimitsYAxis,
              })
            }
            onChangeCommitted={() => handleChangeColorLimits()}
            valueLabelDisplay="off"
            min={colorLimits.absoluteLimitsYAxis[0]}
            max={colorLimits.absoluteLimitsYAxis[1]}
            step={colorLimits.stepSizeYAxis}
          />

          {/* <Slider
            disableSwap
            disabled={!sample.enabled}
            className={"heatmapColorbar-slider-xAxis"}
            orientation={"horizontal"}
            labelColor={"primary"}
            color={"primary"}
            value={colorLimits.dynamicLimitsXAxis}
            onChange={(event) =>
              setColorLimits({
                ...colorLimits,
                dynamicLimitsXAxis:
                  Math.abs(event.target.value[1] - event.target.value[0]) > 0
                    ? event.target.value
                    : colorLimits.dynamicLimitsXAxis,
              })
            }
            onChangeCommitted={() => handleChangeColorLimits()}
            valueLabelDisplay="off"
            min={colorLimits.absoluteLimitsXAxis[0]}
            max={colorLimits.absoluteLimitsXAxis[1]}
            step={colorLimits.stepSizeXAxis / 2}
          /> */}
        </div>
      </div>
      {/* SETTINGS */}
      <div
        class="card shadow--dark sample-settings"
        style={{ padding: "1rem 2rem" }}
      >
        <div class="card-content card-content--denseSpacing ">
          {elasticityStamp(sample.shearwaveSpeed)}
          <Divider />
          <div class="sample-settings-sliderContainer">
            <p class="textOverflow font--small">ROI:</p>
            <Slider
              dense
              color="primary"
              labelColor="primary"
              value={percentSliceWidth}
              onChange={(event) => setPercentSliceWidth(event.target.value)}
              onChangeCommitted={() =>
                handleRoiChange(
                  [sample.z - sample.dz / 2, sample.z + sample.dz / 2],
                  percentSliceWidth
                )
              }
              min={10}
              max={100}
              step={10}
              valueLabelDisplay="on"
              marks={[
                {
                  value: 10,
                  label: "10%",
                },
                {
                  value: 20,
                },
                {
                  value: 30,
                },
                {
                  value: 40,
                },
                {
                  value: 50,
                },
                {
                  value: 60,
                },
                {
                  value: 70,
                },
                {
                  value: 80,
                },
                {
                  value: 90,
                },
                {
                  value: 100,
                  label: "100%",
                },
              ]}
            />
          </div>

          {/* <Button
            fullWidth
            variant="outlined"
            className="font--small"
            color="primary"
          >
            Apply Settings to All Site Samples
          </Button> */}
          <SharedSettings />
        </div>
      </div>
    </div>
  );
}

export default CsiSample;
