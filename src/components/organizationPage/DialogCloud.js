import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DataTable from "../DataTable";
import { Icon } from "../sharedComponents";
import { useSelector } from "react-redux";

function DialogCloud(props) {
  const [selectedVisitIds, setSelectedVisitIds] = React.useState([]);
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
      <h2 class="card-title">
        {/* {<Icon class="icon--white icon--medium" id="cloud" />} */}Sync
        Visits to Cloud
      </h2>
      <div class="card-content card-content--denseSpacing">
        <p>
          Visit data will remain on the device after syncing. Syncing may take a
          while.
        </p>
        <DataTable
          checkboxColumn={true}
          selectedVisitIds={selectedVisitIds}
          setSelectedVisitIds={setSelectedVisitIds}
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
          disabled
          // disabled={selectedVisitIds.length === 0}
          fullWidth
          variant="contained"
          color="primary"
        >
          Sync to Cloud
        </Button>
      </div>
    </Dialog>
  );
}

export default DialogCloud;
