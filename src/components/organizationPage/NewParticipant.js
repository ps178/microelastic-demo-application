import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { addNewParticipant } from "../../reducerSlices/userSlice";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { Icon } from "../sharedComponents";
import { DatePicker } from "../sharedComponents";
import FormHelperText from "@mui/material/FormHelperText";
// import { useFetchAddNewParticipantMutation } from "../../reducerSlices/api";
import { updateSnackbarStatus } from "../../reducerSlices/utilitySlice";
import { Tooltip } from "@mui/material";
function NewParticipant(props) {
  const dispatch = useDispatch();
  const organizationParticipantSecondaryIds = useSelector((state) =>
    Object.keys(state.user.organizationParticipants).map(
      (participantId) =>
        state.user.organizationParticipants[participantId]
          .participantSecondaryId
    )
  );
  const organization = useSelector((state) => ({
    name: state.user.organizationName,
    id: state.user.organizationId,
  }));
  const [participantInfo, setParticipantInfo] = React.useState({
    participantSecondaryId: "",
    firstName: "",
    lastName: "",
    dateOfBirth: null,
  });
  const [participantSecondaryIdError, setParticipantSecondaryIdError] =
    React.useState(false);
  // const [fetchAddNewParticipant, { isLoading: isLoadingAddNewParticipant }] =
  //   useFetchAddNewParticipantMutation();

  const generateRandomSecondaryId = () => {
    let idLength = 4;
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let charactersLength = characters.length;
    for (var i = 0; i < idLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setParticipantInfo({ ...participantInfo, participantSecondaryId: result });
  };

  const checkParticipantId = () => {
    if (
      organizationParticipantSecondaryIds.includes(
        participantInfo.participantSecondaryId
      )
    ) {
      setParticipantSecondaryIdError(true);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let participantId = nanoid();

    // fetchAddNewParticipant({
    //   organizationId: organization.id,
    //   participantId,
    //   ...participantInfo,
    // })
    //   .unwrap()
    //   .then(() => {
    dispatch(
      addNewParticipant({
        participantId,
        ...participantInfo,
      })
    );
    // })
    // .catch((error) => {
    //   console.log(error);
    //   dispatch(
    //     updateSnackbarStatus({
    //       type: "error",
    //       status: true,
    //       message: error?.data?.message,
    //     })
    //   );
    // });
    props.closeDialog();
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
      <h2 class="card-title">Register New Patient</h2>
      <div class="card-content card-content--noScroll card-content--denseSpacing">
        <p> Add a new patient to {organization.name}.</p>

        <FormControl variant="standard">
          <InputLabel>Patient ID</InputLabel>
          <Input
            error={participantSecondaryIdError}
            value={participantInfo.participantSecondaryId}
            onChange={(event) =>
              setParticipantInfo({
                ...participantInfo,
                participantSecondaryId: event.target.value,
              })
            }
            label="Patient ID"
            variant="standard"
            endAdornment={
              <InputAdornment position="end">
                <Tooltip title="Generate Random Patient ID" arrow>
                  <IconButton onClick={() => generateRandomSecondaryId()}>
                    <Icon class="icon--white icon--small" id="dice" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            }
          />
          {participantSecondaryIdError && (
            <FormHelperText className="font--error">
              Patient ID is already in use
            </FormHelperText>
          )}
        </FormControl>

        <TextField
          value={participantInfo.firstName}
          onChange={(event) =>
            setParticipantInfo({
              ...participantInfo,
              firstName: event.target.value,
            })
          }
          label="First Name"
          variant="standard"
        />

        <TextField
          value={participantInfo.lastName}
          onChange={(event) =>
            setParticipantInfo({
              ...participantInfo,
              lastName: event.target.value,
            })
          }
          label="Last Name"
          variant="standard"
          style={{ marginBottom: "25px" }}
        />
        <DatePicker
          value={participantInfo.dateOfBirth}
          onChange={(date) => {
            setParticipantInfo({
              ...participantInfo,
              dateOfBirth: date.format("YYYY-MM-DD"),
            });
          }}
          label={"Date of Birth"}
        />
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
          disabled={Object.keys(participantInfo).some(
            (elementId) =>
              participantInfo[elementId] === null ||
              participantInfo[elementId]?.length === 0
          )}
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => checkParticipantId()}
        >
          Add New Patient
        </Button>
      </div>
    </Dialog>
  );
}

export default NewParticipant;
