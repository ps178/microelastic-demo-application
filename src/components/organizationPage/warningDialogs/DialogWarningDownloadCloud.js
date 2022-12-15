import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { SingleVisitTable } from "../../sharedComponents";

function DialogWarningDownloadCloud(props) {
  return (
    <Dialog
      PaperProps={{ className: "shadow--light" }}
      open={props.open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
        }
      }}
    >
      <h2 class="card-title">Download Visit from Cloud</h2>
      <div class="card-content card-content--noScroll card-content--normalSpacing">
        <p>
          Selected visit only exists on the cloud. The visit folder will be
          downloaded from the cloud and saved locally on the device.
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
          Download Visit
        </Button>
      </div>
    </Dialog>
  );
}

export default DialogWarningDownloadCloud;
