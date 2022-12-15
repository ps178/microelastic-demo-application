import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Icon } from "./sharedComponents";
import { useDispatch, useSelector } from "react-redux";
import MobileStepper from "@mui/material/MobileStepper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CircularProgress from "@mui/material/CircularProgress";
import capOn from "./../deviceIllustrations/capOn.gif";
import holster from "./../deviceIllustrations/holster.png";
import rotateDown from "./../deviceIllustrations/rotateDown.gif";
import pushBubble from "./../deviceIllustrations/pushBubble.png";
import {
  resetDeviceHealthCheck,
  setDeviceHeath,
  setDeviceInfo,
} from "../reducerSlices/deviceSlice";
import { updateSnackbarStatus } from "../reducerSlices/utilitySlice";

function DialogCalibration(props) {
  const dispatch = useDispatch();
  const device = useSelector((state) => ({
    connected: state.device.connected,
    isHealthy: state.device.isHealthy,
    calibGelThickness: state.device.calibGelThickness,
    calibGelSws: state.device.calibGelSws,
  }));

  const visitInfo = useSelector((state) => ({
    visitId: state.visitInfo.visitId,
    organizationId: state.visitInfo.organizationId,
    organizationName: state.visitInfo.organizationName,
    protocolId: state.visitInfo.protocolId,
    protocolName: state.visitInfo.protocolName,
    participantId: state.visitInfo.participantId,
    participantSecondaryId: state.visitInfo.participantSecondaryId,
    visitDate: state.visitInfo.visitDate,
  }));

  const stepLabel = ["Setup", "Check", "Done"];
  const deviceImages = [
    {
      text: "Check that the transducer face is clean and ensure the dial is rotated all the way clockwise. The platform should descend.",
      image: rotateDown,
    },
    {
      text: "Put a pea-sized drop of ultrasound gel on the face of the transducer, and then place the gel cap over the transducer.",
      image: capOn,
    },
    {
      text: "After placing the gel cap, gently press on the gel cap to push out any air bubbles between the gel cap and the transducer.",
      image: pushBubble,
    },
    {
      text: 'Place the handle in the holster. Make sure there is no object blocking the transducer. There should be 1" of space in front of the transducer.',
      image: holster,
    },
  ];
  const [activeStep, setActiveStep] = React.useState(0);
  const [imageStep, setImageStep] = React.useState(0);
  const [failedHealthMessage, setFailedHealthMessage] = React.useState("");

  // React.useEffect(() => {
  //   props.deviceSocket.on("device_connection", (response) => {
  //     if (response.error) {
  //       dispatch(
  //         updateSnackbarStatus({ type: "error", message: response.message })
  //       );
  //       props.closeDialog();
  //     } else {
  //       dispatch(
  //         setDeviceInfo({
  //           simulate: response.simulate,
  //           serialNumber: response.serialNumber,
  //         })
  //       );

  //       if (response.simulate) {
  //         props.handleCloseDialogSuccessfully();
  //       }
  //     }
  //   });
  //   props.deviceSocket.on("device_health", (response) => {
  //     if (response.error) {
  //       dispatch(
  //         updateSnackbarStatus({ type: "error", message: response.message })
  //       );
  //     } else {
  //       dispatch(
  //         setDeviceHeath({
  //           isHealthy: response.healthy,
  //           calibGelThickness: response.capHeight,
  //           calibGelSws: response.capSws,
  //         })
  //       );
  //       if (!response.healthy) {
  //         setFailedHealthMessage(response.message);
  //       }
  //     }
  //     setActiveStep(2);
  //   });

  //   return function cleanup() {
  //     props.deviceSocket.off("device_connection");
  //     props.deviceSocket.off("device_health");
  //   };
  // }, []);

  const handleConnectDevice = (simulate = false) => {
    // props.deviceSocket.emit("init_device", {
    //   simulate: simulate,
    //   ...visitInfo,
    // });
    if (!simulate) {
      dispatch(
        updateSnackbarStatus({
          type: "error",
          message:
            "Cannot connect to a device in demo application. Turn on 'Acquisition Mode' again and choose 'Simulate Device'",
        })
      );
      props.closeDialog();
      setActiveStep(1);
    } else {
      dispatch(
        setDeviceInfo({
          simulate: true,
          serialNumber: "NA",
        })
      );
      props.handleCloseDialogSuccessfully();
    }
  };

  const handleRerunCheck = () => {
    dispatch(resetDeviceHealthCheck());
    setActiveStep(1);
    setFailedHealthMessage("");
    // props.deviceSocket.emit("check_device_health");
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div class="caibrationDialog-running">
            <CircularProgress />
            <p>
              {device.connected
                ? "Running check..."
                : "Connecting to handle..."}
            </p>
          </div>
        );

      case 2:
        if (device.isHealthy) {
          return (
            <div class="caibrationDialog-result">
              <Icon class={"icon--large icon--primary"} id="check_square" />
              <p>Device is Ready to Acquire</p>
              <p>
                {`Gel cap height: ${device.calibGelThickness || "-"} mm`} <br />
                {`Gel shearwave speed: ${device.calibGelSws || "-"} m/s`}
              </p>
            </div>
          );
        } else {
          return (
            <div class="caibrationDialog-result">
              <Icon class={"icon--large icon--warning"} id="warning" />
              <p>Failed Health Check</p>
              <p>
                The system did not successfully detect the gel cap. Make sure
                the gel cap is attached, no air bubbles are present, and click
                "re-run check". If this problem persists, please contact
                support.
                <br />
                {failedHealthMessage}
              </p>
            </div>
          );
        }

      default:
        return (
          <>
            <img
              src={deviceImages[imageStep].image}
              class="acquisitionMode-illustrations-img"
            />
            <p class="acquisitionMode-illustrations-text font--small">
              {deviceImages[imageStep].text}
            </p>
            <MobileStepper
              className={"acquisitionMode-illustrations-controls"}
              steps={deviceImages.length}
              position="static"
              activeStep={imageStep}
              nextButton={
                <Button
                  size="small"
                  onClick={() =>
                    setImageStep((prevActiveStep) => prevActiveStep + 1)
                  }
                  disabled={imageStep === deviceImages.length - 1}
                >
                  <Icon
                    class={`icon--small icon--white ${
                      imageStep === deviceImages.length - 1 && "icon--disabled"
                    }`}
                    id="arrowRight"
                  />
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={() =>
                    setImageStep((prevActiveStep) => prevActiveStep - 1)
                  }
                  disabled={imageStep === 0}
                >
                  <Icon
                    class={`icon--small icon--white ${
                      imageStep === 0 && "icon--disabled"
                    }`}
                    id="arrowLeft"
                  />
                </Button>
              }
            />
          </>
        );
    }
  };

  return (
    <Dialog
      variant="large"
      PaperProps={{ className: "shadow--light" }}
      open={props.open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
        }
      }}
    >
      {activeStep === 0 && (
        <Button
          variant="outlined"
          color="primary"
          className="button-simulateDevice"
          onClick={() => handleConnectDevice(true)}
        >
          Simulate Device
        </Button>
      )}
      <h2 class="card-title">Device Calibration</h2>

      <DialogContent className="acquisitionMode">
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          className={"acquisitionMode-steps"}
        >
          {stepLabel.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent()}
      </DialogContent>
      <DialogActions className="card-action">
        <Button
          variant="outlined"
          color="primary"
          className="button-cancel"
          onClick={() => props.closeDialog()}
          disabled={activeStep === 1}
        >
          Cancel
        </Button>
        {activeStep !== 2 && (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={activeStep === 1}
            onClick={() => handleConnectDevice()}
          >
            Continue
          </Button>
        )}

        {activeStep === 2 && device.isHealthy && (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => props.handleCloseDialogSuccessfully()}
          >
            Done
          </Button>
        )}
        {activeStep === 2 && !device.isHealthy && (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleRerunCheck()}
          >
            Re-run Check
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default DialogCalibration;
