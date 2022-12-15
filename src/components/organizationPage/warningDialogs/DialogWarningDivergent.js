import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { Icon, SingleVisitTable } from "../../sharedComponents";

function DialogWarningDivergent(props) {
  return (
    <Dialog
      PaperProps={{ className: "shadow--light" }}
      open={props.open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
        }
      }}
    >
      <h2 class="card-title">
        {" "}
        {<Icon class="icon--warning icon--medium" id="warning" />} Divergent
        Local and Cloud Versions
      </h2>

      <div class="card-content  card-content--noScroll  card-content--normalSpacing">
        <p>
          The visit has a local copy and a cloud copy however, the two copies
          have been independently modified and cannot be merged.
        </p>
        <p>
          Downloading the visit from the cloud will OVERWRITE the local copy.
          This action cannot be undone.
        </p>
        <SingleVisitTable visit={props.visit} />
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
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            props.closeDialog();
            props.handleLoadCloudVisit(props.visit.visitId);
          }}
        >
          Download Cloud Copy
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            props.closeDialog();
            props.handleLoadLocalVisit(props.visit.visitId, null);
          }}
        >
          Load Local Copy
        </Button>
      </div>
    </Dialog>
  );
}

export default DialogWarningDivergent;
