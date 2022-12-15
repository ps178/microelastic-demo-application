import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { SingleVisitTable } from "../../sharedComponents";

function DialogWarningCloudOutdated(props) {
  return (
    <Dialog
      PaperProps={{ className: "shadow--light" }}
      open={props.open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
        }
      }}
    >
      <h2 class="card-title">Cloud Visit Outdated</h2>

      <div class="card-content  card-content--noScroll  card-content--normalSpacing">
        <p>
          A newer version of the visit exits on the device. The outdated cloud
          version will NOT be downloaded. Use the "Sync Visits to Cloud" option
          in the application menu to update the visit on the cloud.
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
            props.handleLoadLocalVisit(props.visit.visitId, null);
          }}
        >
          Load Local Copy
        </Button>
      </div>
    </Dialog>
  );
}

export default DialogWarningCloudOutdated;
