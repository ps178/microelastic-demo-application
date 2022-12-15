import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { SingleVisitTable } from "../../sharedComponents";

function DialogWarningLocalOutdated(props) {
  return (
    <Dialog
      PaperProps={{ className: "shadow--light" }}
      open={props.open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
        }
      }}
    >
      <h2 class="card-title">Local Visit Outdated</h2>

      <div class="card-content  card-content--noScroll  card-content--normalSpacing">
        <p>
          A newer version of the visit exists on the cloud. The local copy of
          the visit can be updated by downloading the newer version from the
          cloud.
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

export default DialogWarningLocalOutdated;
