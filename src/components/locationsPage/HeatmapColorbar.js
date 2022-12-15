const HeatmapColorbar = (props) => {
  const {
    value = null,
    colorType = "rainbow",
    decimalPlace = 1,
    //YAXIS
    absoluteLimitsYAxis,
    dynamicLimitsYAxis,
    stepSizeYAxis = 1,
    labelYAxis = "",
    unitsYAxis = "",
    //XAXIS
    absoluteLimitsXAxis = [],
    dynamicLimitsXAxis = [],
    stepSizeXAxis = 1,
    labelXAxis = "",
    unitsXAxis = "",
  } = props;

  ///////////// TICK MARKS/////////////////
  const mapHeightPx = 300; // 300px is the height of the colorbar
  const tickMarksYAxis = Array.from(
    {
      length:
        (absoluteLimitsYAxis[1] - absoluteLimitsYAxis[0]) / stepSizeYAxis + 1,
    },
    (e, i) => absoluteLimitsYAxis[0] + i * stepSizeYAxis
  );
  if (tickMarksYAxis[tickMarksYAxis.length - 1] !== absoluteLimitsYAxis[1]) {
    tickMarksYAxis.push(absoluteLimitsYAxis[1]);
  }
  function getTickMarkPositionYAxisPx(tickValue) {
    return `${
      ((absoluteLimitsYAxis[1] - tickValue) /
        (absoluteLimitsYAxis[1] - absoluteLimitsYAxis[0])) *
      mapHeightPx
    }px`;
  }

  const maxWidthPx = 35; // 45 is the height of the colorbar
  const tickMarksXAxis = Array.from(
    {
      length:
        (absoluteLimitsXAxis[1] - absoluteLimitsXAxis[0]) / stepSizeXAxis + 1,
    },
    (e, i) => absoluteLimitsXAxis[0] + i * stepSizeXAxis
  );
  if (tickMarksXAxis[tickMarksXAxis.length - 1] !== absoluteLimitsXAxis[1]) {
    tickMarksXAxis.push(absoluteLimitsXAxis[1]);
  }
  function getTickMarkPositionXAxisPx(tickValue) {
    return `${
      ((absoluteLimitsXAxis[1] - tickValue) /
        (absoluteLimitsXAxis[1] - absoluteLimitsXAxis[0])) *
      maxWidthPx
    }px`;
  }

  /////////////// HEIGHT //////////////////////
  let dynamicLimitMaxHeightPxPosition = `${
    ((absoluteLimitsYAxis[1] - dynamicLimitsYAxis[1]) /
      (absoluteLimitsYAxis[1] - absoluteLimitsYAxis[0])) *
    mapHeightPx
  }px`;

  let dynamicLimitPxHeight = `${
    (Math.abs(dynamicLimitsYAxis[1] - dynamicLimitsYAxis[0]) * mapHeightPx) /
    Math.abs(absoluteLimitsYAxis[1] - absoluteLimitsYAxis[0])
  }px`;

  /////////////// WIDTH //////////////////////
  let dynamicLimitMaxWidthPxPosition = `${
    ((absoluteLimitsXAxis[1] - dynamicLimitsXAxis[1]) /
      (absoluteLimitsXAxis[1] - absoluteLimitsXAxis[0])) *
    maxWidthPx
  }px`;

  let dynamicLimitWidthPx = `${
    (Math.abs(dynamicLimitsXAxis[1] - dynamicLimitsXAxis[0]) * maxWidthPx) /
    Math.abs(absoluteLimitsXAxis[1] - absoluteLimitsXAxis[0])
  }px`;

  /////////////////// POINTER //////////////////////
  let position = 0;
  if (value) {
    let percentage =
      100 *
      ((absoluteLimitsYAxis[1] - value) /
        (absoluteLimitsYAxis[1] - absoluteLimitsYAxis[0]));
    if (percentage > 100) {
      percentage = 100;
    } else if (percentage < 0) {
      percentage = 0;
    }
    position = `${(percentage.toFixed(2) * mapHeightPx) / 100}px`;
  }

  return (
    <div
      class="heatmapColorbar"
      style={{ width: absoluteLimitsXAxis.length !== 0 ? maxWidthPx : "15px" }}
    >
      <div
        class={`heatmapColorbar-color heatmapColorbar--${colorType}`}
        style={{
          top: dynamicLimitMaxHeightPxPosition,
          height: dynamicLimitPxHeight,
          width:
            absoluteLimitsXAxis.length !== 0 ? dynamicLimitWidthPx : "15px",
          right: dynamicLimitMaxWidthPxPosition,
        }}
      />
      {/* LABELS */}
      <span
        class="heatmapColorbar-yAxis-label font--extrasmall"
        style={{ top: labelYAxis ? "-60px" : "-30px" }}
      >
        {labelYAxis ? `${labelYAxis} (${unitsYAxis})` : unitsYAxis}
      </span>
      <span class="heatmapColorbar-xAxis-label font--extrasmall">
        {labelXAxis ? `${labelXAxis} (${unitsXAxis})` : unitsXAxis}
      </span>

      {/* TICK MARKS */}
      {tickMarksYAxis.map((e, i) => (
        <div
          key={"step_" + i}
          class="heatmapColorbar-yAxis-tick"
          style={{
            top: getTickMarkPositionYAxisPx(
              absoluteLimitsYAxis[0] + stepSizeYAxis * i
            ),
            backgroundColor:
              (i === 0 || i === tickMarksYAxis.length - 1) && "transparent",
          }}
        >
          <div class="heatmapColorbar-yAxis-number font--extrasmall">
            {(absoluteLimitsYAxis[0] + stepSizeYAxis * i).toFixed(decimalPlace)}
          </div>
        </div>
      ))}

      {absoluteLimitsXAxis.length !== 0 &&
        tickMarksXAxis.map((e, i) => (
          <div
            key={"step_" + i}
            class="heatmapColorbar-xAxis-tick"
            style={{
              right: getTickMarkPositionXAxisPx(
                absoluteLimitsXAxis[0] + stepSizeXAxis * i
              ),
              backgroundColor:
                (i === 0 || i === tickMarksXAxis.length - 1) && "transparent",
            }}
          >
            <div class="heatmapColorbar-xAxis-number font--extrasmall">
              {(absoluteLimitsXAxis[0] + stepSizeXAxis * i).toFixed(
                decimalPlace
              )}
            </div>
          </div>
        ))}

      {/* VALUE POINTER */}

      {value && (
        <div style={{ top: position }} class="heatmapColorbar-triangle" />
      )}
    </div>
  );
};

export default HeatmapColorbar;
