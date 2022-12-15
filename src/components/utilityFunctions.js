import { colors } from "../constants/colors";

import { scaleLinear } from "d3-scale";
//Calculate location progress percentage
export const locationProgressPercentage = (
  samplesAcquiredBySampleType,
  sampleTypes
) => {
  const totalSamplesNeeded = Object.keys(sampleTypes).reduce(
    (sampleTotal, sampleType) =>
      sampleTotal + sampleTypes[sampleType].requiredNumber,
    0
  );

  const totalSamplesAcquired = Object.keys(sampleTypes).reduce(
    (sampleTotal, sampleType) =>
      sampleTotal +
      (samplesAcquiredBySampleType[sampleType] >
      sampleTypes[sampleType].requiredNumber
        ? sampleTypes[sampleType].requiredNumber
        : samplesAcquiredBySampleType[sampleType]),
    0
  );

  // // let totalSamplesAcquired = 0;
  // let totalSamplesProcessed = 0;
  // let totalSamplesNeeded = 0;
  // //Calculate total samples processed
  // for (let sampleType of Object.keys(sampleTypes)) {
  //   totalSamplesNeeded += sampleTypes[sampleType].requiredNumber;
  //   // if (samplesAcquiredBySampleType[sampleType] < sampleTypes[sampleType].requiredNumber) {
  //   //   totalSamplesAcquired += samplesAcquiredBySampleType[sampleType];
  //   // } else {
  //   //   totalSamplesAcquired += sampleTypes[sampleType].requiredNumber;
  //   // }
  //   if (
  //     samplesAcquiredBySampleType[sampleType] <
  //     sampleTypes[sampleType].requiredNumber
  //   ) {
  //     totalSamplesProcessed += samplesAcquiredBySampleType[sampleType];
  //   } else {
  //     totalSamplesProcessed += sampleTypes[sampleType].requiredNumber;
  //   }
  // }

  return percentage(totalSamplesAcquired, totalSamplesNeeded);
};

// Calculate percentage
export const percentage = (number, required) => {
  if (number < required) {
    return (number / required) * 100;
  } else {
    return 100;
  }
};

export function bmodeColor(value, limits) {
  let domainRange = [];
  const size = 2;
  let step = (limits[1] - limits[0]) / (size - 1);
  for (var i = 0; i < size; i++) {
    domainRange.push(limits[0] + step * i);
  }

  let color = "rgb(35, 35, 35)";
  if (value !== null) {
    const calculateLinear = scaleLinear()
      .domain(domainRange)
      .range(["#000000", "#ffffff"]);
    color = calculateLinear(value);
  }

  return color;
}

export function calculateMapRegionColor(value, limits) {
  let domainRange = [];
  const size = 11;
  let step = (limits[1] - limits[0]) / (size - 1);
  for (var i = 0; i < size; i++) {
    domainRange.push(limits[0] + step * i);
  }

  let color = "rgb(72, 72, 72)";
  if (value !== null) {
    const calculateLinear = scaleLinear()
      .domain(domainRange)
      .range([
        colors.rainbowStep10,
        colors.rainbowStep9,
        colors.rainbowStep8,
        colors.rainbowStep7,
        colors.rainbowStep6,
        colors.rainbowStep5,
        colors.rainbowStep4,
        colors.rainbowStep3,
        colors.rainbowStep2,
        colors.rainbowStep1,
        colors.rainbowStep0,
      ]);
    color = calculateLinear(value);
  }

  return color;
}

export const convertMmToPixelPosition = (valueMm, range, plotHeight) => {
  return ((valueMm - range[0]) * plotHeight) / Math.abs(range[1] - range[0]);
};

export const convertMmToPixel = (valueMm, range, plotHeight) => {
  return (valueMm * plotHeight) / Math.abs(range[1] - range[0]);
};
export const convertPixelToMmPosition = (valuePixel, range, plotHeight) => {
  return parseFloat(
    (
      (valuePixel * Math.abs(range[1] - range[0])) / plotHeight +
      range[0]
    ).toFixed(2)
  );
};
export const convertPixelToMm = (valuePixel, range, plotHeight) => {
  return parseFloat(
    ((valuePixel * Math.abs(range[1] - range[0])) / plotHeight).toFixed(2)
  );
};

export const calculateVisitProgress = (protocolLocations, locations) => {
  const includedLocationIds = protocolLocations.ids.filter(
    (locationId) => !protocolLocations.entities[locationId].removed
  );

  const totalSamplesNeeded = includedLocationIds.reduce((total, locId) => {
    let locAddtion = Object.keys(
      protocolLocations.entities[locId].sampleTypes
    ).reduce(
      (sampleTotal, sampleId) =>
        sampleTotal +
        protocolLocations.entities[locId].sampleTypes[sampleId].requiredNumber,
      0
    );

    return total + locAddtion;
  }, 0);

  const totalSamplesAcquired = includedLocationIds.reduce((total, locId) => {
    let locAddtion = Object.keys(
      protocolLocations.entities[locId].sampleTypes
    ).reduce((sampleTotal, sampleId) => {
      let samplesAcquired =
        locations.entities[locId].sampleTypes[sampleId].requiredNumber;
      let samplesRequired =
        protocolLocations.entities[locId].samplesAcquiredBySampleType[sampleId];
      return (
        sampleTotal +
        (samplesAcquired > samplesRequired ? samplesRequired : samplesAcquired)
      );
    }, 0);

    return total + locAddtion;
  }, 0);

  return percentage(totalSamplesAcquired, totalSamplesNeeded);
};

export const standardDeviation = (numbersArray, totalSum) => {
  return Math.sqrt(
    numbersArray.map((x) => Math.pow(x - totalSum, 2)).reduce((a, b) => a + b) /
      numbersArray.length
  );
};
