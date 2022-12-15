import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Checkbox from "@mui/material/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { nanoid } from "@reduxjs/toolkit";
// import { useFetchGetProtocolMutation } from "../../reducerSlices/api";
import CircularProgress from "@mui/material/CircularProgress";
import { setVisitInformation } from "../../reducerSlices/visitInfoSlice";
import ListItemText from "@mui/material/ListItemText";
import {
  setPageId,
  updateSnackbarStatus,
} from "../../reducerSlices/utilitySlice";
import pageIds from "../../constants/pageMap";
import { fetchGetProtocol } from "../../reducerSlices/protocolSlice";

function NewVisit(props) {
  // Get Redux states
  const dispatch = useDispatch();
  const organizationId = useSelector((state) => state.user.organizationId);
  const organizationName = useSelector((state) => state.user.organizationName);
  const organizationProtocols = useSelector(
    (state) => state.user.organizationProtocols
  );
  const organizationParticipants = useSelector(
    (state) => state.user.organizationParticipants
  );

  // const [fetchGetProtocol, { isLoading }] = useFetchGetProtocolMutation();
  // Create local state
  const [newVisit, setNewVisit] = React.useState({
    protocolId: "",
    participantId: "",
  });
  const [testMode, setTestMode] = React.useState(false);

  const handleTestMode = (event) => {
    if (event.target.checked) {
      setTestMode(true);
      setNewVisit({ ...newVisit, participantId: "No ID" });
    } else {
      setTestMode(false);
      setNewVisit({ ...newVisit, participantId: "" });
    }
  };

  function generateDateTimeStamp() {
    let currentDate = new Date();
    let dd = currentDate.getDate();
    let mm = currentDate.getMonth() + 1;
    let HH = currentDate.getHours();
    let MM = currentDate.getMinutes();
    let SS = currentDate.getSeconds();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    if (HH < 10) {
      HH = "0" + HH;
    }
    if (MM < 10) {
      MM = "0" + MM;
    }
    if (SS < 10) {
      SS = "0" + SS;
    }
    let dateTimeStamp =
      currentDate.getFullYear() +
      "-" +
      mm +
      "-" +
      dd +
      " " +
      HH +
      ":" +
      MM +
      ":" +
      SS;
    return dateTimeStamp;
  }

  const handleSubmit = () => {
    let visitDate = generateDateTimeStamp();
    let visitId = nanoid();
    dispatch(
      fetchGetProtocol({
        protocolId: newVisit.protocolId,
        protocolName: organizationProtocols[newVisit.protocolId],
      })
    );
    dispatch(
      setVisitInformation({
        ...newVisit,
        saveFolder: "MicroElastic/VisitData/" + visitId,
        saveFilename: visitId + ".visit",
        wipFolder: "MicroElastic/Work In Progress",
        protocolName: organizationProtocols[newVisit.protocolId],
        participantSecondaryId:
          organizationParticipants[newVisit.participantId]
            ?.participantSecondaryId || "No ID",
        visitDate,
        visitId,
        organizationName,
        organizationId,
      })
    );
    dispatch(setPageId(pageIds.overviewPage));

    // fetchGetProtocol({
    //   organizationId,
    //   visitId,
    //   protocolId: newVisit.protocolId,
    //   participantId: newVisit.participantId,
    // })
    //   .unwrap()
    //   .then((payload) => {
    //     dispatch(
    //       setVisitInformation({
    //         ...newVisit,
    //         saveFolder: payload.saveFolder,
    //         saveFilename: payload.saveFilename,
    //         wipFolder: payload.wipFolder,
    //         protocolName: organizationProtocols[newVisit.protocolId],
    //         participantSecondaryId:
    //           organizationParticipants[newVisit.participantId]
    //             ?.participantSecondaryId || "No ID",
    //         visitDate,
    //         visitId,
    //         organizationName,
    //         organizationId,
    //       })
    //     );
    //     if (!payload.empty) {
    //       dispatch(
    //         updateSnackbarStatus({
    //           type: "warning",
    //           status: true,
    //           message:
    //             "Unsaved files from previous exam are moved to local trash folder",
    //         })
    //       );
    //     }
    //     dispatch(setPageId(pageIds.overviewPage));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  return (
    <Dialog
      PaperProps={{ className: "shadow--light" }}
      open={props.open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
        }
      }}
    >
      <h2 class="card-title">New Visit</h2>
      <div class="card-content card-content--noScroll card-content--normalSpacing">
        <FormControl>
          <InputLabel>Visit Type</InputLabel>
          <Select
            value={newVisit.protocolId}
            onChange={(event) =>
              setNewVisit({ ...newVisit, protocolId: event.target.value })
            }
            label="Visit Type"
            MenuProps={{ variant: "medium-length" }}
          >
            {Object.keys(organizationProtocols).map((protocolId) => (
              <MenuItem key={protocolId} value={protocolId}>
                {organizationProtocols[protocolId]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Patient</InputLabel>
          <Select
            value={newVisit.participantId}
            onChange={(event) =>
              setNewVisit({ ...newVisit, participantId: event.target.value })
            }
            label="Patient"
            disabled={testMode}
            MenuProps={{ variant: "medium-length" }}
          >
            {Object.keys(organizationParticipants).map((participantId) => (
              <MenuItem key={participantId} value={participantId}>
                <ListItemText
                  primary={
                    organizationParticipants[participantId]
                      .participantSecondaryId
                  }
                  secondary={
                    <p class="font--small font--disabled">
                      {organizationParticipants[participantId]?.firstName}{" "}
                      {organizationParticipants[participantId].lastName}
                    </p>
                  }
                />
              </MenuItem>
            ))}
            <MenuItem sx={{ display: "none" }} value={"No ID"}>
              No ID
            </MenuItem>
          </Select>
        </FormControl>
        <div class="checkboxHelper">
          <Checkbox
            className={"checkboxHelper-checkbox"}
            checked={testMode}
            onChange={(event) => handleTestMode(event)}
            size="large"
            color="primary"
          />
          <p class="checkboxHelper-primaryText">Test Mode</p>
          <p class="checkboxHelper-secondaryText font--small font--disabled">
            Test mode visits can be saved locally but they are not tracked as
            part of the organization or synced to cloud.
          </p>
        </div>
      </div>

      <div class="card-action">
        <Button
          variant="outlined"
          color="primary"
          className="button-cancel"
          onClick={() => props.closeDialog()}
        >
          Cancel
        </Button>
        <Button
          disabled={
            newVisit.protocolId.length === 0 ||
            (newVisit.participantId.length === 0 && !testMode)
          }
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => handleSubmit()}
        >
          {/* {isLoading && <CircularProgress size={30} />}  */}
          Start Visit
        </Button>
      </div>
    </Dialog>
  );
}

export default NewVisit;
