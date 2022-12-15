import React from "react";
import { elasticityAvgStamp, thicknessAvgStamp } from "../sharedComponents";
import { calculateMapRegionColor } from "../utilityFunctions";
import Tooltip from "@mui/material/Tooltip";
import { colors } from "../../constants/colors";

function MapRegion(props) {
  const [hover, setHover] = React.useState(false);

  const scaledCoordinates = () => {
    const coords = props.location.mapCoords[props.selectedMapId];
    if (coords.length === 3) {
      // if coords is only three numbers then its a circle and not polygon
      let r = coords[0] * (props.mapSize.height / 100);
      let cx = coords[1] * (props.mapSize.width / 100);
      let cy = coords[2] * (props.mapSize.height / 100);
      return [r.toString(), cx.toString(), cy.toString()];
    } else {
      let scaledCoordinates = [];
      for (var i = 0; i < coords.length; i++) {
        if (i % 2 === 0) {
          scaledCoordinates.push(coords[i] * (props.mapSize.width / 100));
        } else {
          scaledCoordinates.push(coords[i] * (props.mapSize.height / 100));
        }
      }
      return scaledCoordinates.toString();
    }
  };

  const getStrokeWidth = () => {
    const strokeWidth = hover ? 1.5 : 1;
    return strokeWidth;
  };

  const getStrokeDash = () => {
    let dashStyle = props.location.progress === 100 ? "0" : "0.8rem";
    return dashStyle;
  };

  const getFillColor = () => {
    let fillColor = calculateMapRegionColor(
      props.heatmap.selectedHeatmapType === "thickness"
        ? props.location.thickness.value
        : props.location.shearwaveSpeed.value,
      props.heatmap.heatmapTypes[props.heatmap.selectedHeatmapType]
        .dynamicLimits
    );

    if (hover) {
      fillColor = fillColor.slice(0, -1) + ",1)";
    } else {
      fillColor = fillColor.slice(0, -1) + ", 0.6)";
    }
    return fillColor;
  };

  const LocationTooltip = () => {
    return (
      <div class="tooltip">
        <p class="font--medium">{props.location.locationName}</p>
        {thicknessAvgStamp(
          props.location.thickness.value,
          props.location.thickness.standardDev,
          props.location.samplesAcquiredBySampleType["BMODE"],
          props.location.sampleTypes["BMODE"].displayName
        )}
        {elasticityAvgStamp(
          props.location.shearwaveSpeed.value,
          props.location.shearwaveSpeed.standardDev,
          props.location.samplesAcquiredBySampleType["STL"],
          props.location.sampleTypes["STL"].displayName
        )}
      </div>
    );
  };
  return (
    <>
      <Tooltip
        title={<LocationTooltip />}
        enterTouchDelay={200}
        arrow
        // placement="top"
      >
        {props.location.mapCoords[props.selectedMapId].length === 3 ? (
          <circle
            id={props.id}
            // Style region
            fill={getFillColor()}
            stroke={colors.divider}
            strokeWidth={getStrokeWidth()}
            strokeDasharray={getStrokeDash()}
            // Region coordinates
            r={scaledCoordinates()[0]}
            cx={scaledCoordinates()[1]}
            cy={scaledCoordinates()[2]}
            // Select region/location
            onClick={() => props.handleClickLocation(props.id)}
            //Hover
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          ></circle>
        ) : (
          <polygon
            id={props.id}
            // Style region
            fill={getFillColor()}
            stroke={colors.divider}
            strokeWidth={getStrokeWidth()}
            strokeDasharray={getStrokeDash()}
            // Region coordinates
            points={scaledCoordinates()}
            // Select region/location
            onClick={() => props.handleClickLocation(props.id)}
            //Hover
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          ></polygon>
        )}
      </Tooltip>
    </>
  );
}

export default MapRegion;
