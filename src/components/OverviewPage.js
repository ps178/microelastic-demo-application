import React from "react";
import { useSelector, useDispatch } from "react-redux";
import pageIds from "../constants/pageMap";
import { Icon } from "./sharedComponents";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { setPageId } from "../reducerSlices/utilitySlice";

function OverviewPage() {
  // Redux State
  const dispatch = useDispatch();
  const visitInfo = useSelector((state) => ({
    organizationName: state.visitInfo.organizationName,
    protocolName: state.visitInfo.protocolName,
    visitDate: state.visitInfo.visitDate,
    visitNotes: state.visitInfo.visitNotes,
    // visitProgress: state.visitInfo.visitProgress,
  }));
  const participantInfo = useSelector((state) => ({
    participantId: state.visitInfo.participantId,
    participantSecondaryId: state.visitInfo.participantSecondaryId,
    firstName:
      state.user.organizationParticipants[state.visitInfo.participantId]
        ?.firstName,
    lastName:
      state.user.organizationParticipants[state.visitInfo.participantId]
        ?.lastName,
    dateOfBirth:
      state.user.organizationParticipants[state.visitInfo.participantId]
        ?.dateOfBirth,
  }));

  const locationNames = useSelector((state) =>
    state.protocol.examDef.locations.ids.map(
      (locationId) => state.protocol.examDef.locations.entities[locationId].name
    )
  );
  const formsById = useSelector((state) =>
    Object.fromEntries(
      state.formData.ids.map((formId) => [
        formId,
        {
          completed: state.formData.entities[formId].completed,
          name: state.protocol.formDef.entities[formId].name,
        },
      ])
    )
  );

  // Local State
  const [newVisitNotes, setNewVisitNotes] = React.useState(
    visitInfo.visitNotes
  );

  return (
    <div class="app-body overview">
      <div class="card overview-visitInformation shadow--dark">
        <h2 class="card-title">Visit Information</h2>
        <div class="card-content card-content--veryDenseSpacing">
          <div class="overview-visitInformation-item">
            <Icon class="icon--white icon--medium" id="organization" />
            <span>
              <p>{visitInfo.organizationName}</p>
              <p class="font--disabled font--small">Organization</p>
            </span>
          </div>

          <div class="overview-visitInformation-item">
            <Icon class="icon--white icon--medium" id="protocol" />
            <span>
              <p>{visitInfo.protocolName}</p>
              <p class="font--disabled font--small">Visit Type</p>
            </span>
          </div>

          <div class="overview-visitInformation-item">
            <Icon class="icon--white icon--medium" id="participant" />
            <span>
              <p>{participantInfo.participantSecondaryId}</p>
              <p>
                {participantInfo.firstName}{" "}
                {participantInfo.lastName
                  ? participantInfo.lastName + ", "
                  : ""}
                {participantInfo.dateOfBirth}{" "}
              </p>
              <p class="font--disabled font--small">Patient</p>
            </span>
          </div>

          <div class="overview-visitInformation-item">
            <Icon class="icon--white icon--medium" id="dateTime" />
            <span>
              <p>{visitInfo.visitDate}</p>
              <p class="font--disabled font--small">Visit Date</p>
            </span>
          </div>

          <TextField
            label="Visit Notes"
            multiline
            rows={4}
            value={newVisitNotes}
            onChange={(event) => setNewVisitNotes(event.target.value)}
          />
        </div>
      </div>
      <div class="card overview-locations shadow--dark">
        <h2 class="card-title">Measurement Sites</h2>
        <div class="card-content card-content--veryDenseSpacing">
          <ul class={locationNames.length > 6 && "list-two-column"}>
            {locationNames.map((locationName) => (
              <li key={locationName} class="textOverflow">
                {locationName}
              </li>
            ))}
          </ul>
        </div>
        <Button
          color="primary"
          variant="contained"
          onClick={() => dispatch(setPageId(pageIds.locationsPage))}
        >
          View Site Details and Acquire Samples
        </Button>
      </div>
      <div class="card overview-forms shadow--dark">
        <h2 class="card-title">Forms</h2>
        <div class="card-content card-content--veryDenseSpacing">
          <p class="textOverflow">
            Completed:{" "}
            {Object.keys(formsById)
              .filter((formId) => formsById[formId].completed)
              .map((formId) => formsById[formId].name)
              .join(" ,")}
          </p>
          <p class="textOverflow">
            Incomplete:{" "}
            {Object.keys(formsById)
              .filter((formId) => !formsById[formId].completed)
              .map((formId) => formsById[formId].name)
              .join(", ")}{" "}
          </p>
        </div>
        <Button
          color="primary"
          variant="contained"
          onClick={() => dispatch(setPageId(pageIds.formsPage))}
        >
          Edit Forms
        </Button>
      </div>
    </div>
  );
}

export default OverviewPage;
