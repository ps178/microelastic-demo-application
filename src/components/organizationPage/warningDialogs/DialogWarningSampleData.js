import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { SingleVisitTable } from "../../sharedComponents";

function DialogWarningSampleData(props) {
  return (
    <Dialog
      PaperProps={{ className: "shadow--light" }}
      open={props.open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
        }
      }}
    >
      <h2 class="card-title">Sample Data Unavailable</h2>

      <div class="card-content  card-content--noScroll  card-content--normalSpacing">
        <p>
          The sample data for the selected visit is not available. The visit can
          be viewed but the samples cannot be edited.
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
            props.loadVisit(props.visit);
          }}
        >
          Continue
        </Button>
      </div>
    </Dialog>
  );
}

export default DialogWarningSampleData;
