import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DataTable from "../DataTable";
import { Icon } from "../sharedComponents";
import { useSelector } from "react-redux";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";

function DialogUsb(props) {
  const [selectedUsb, setSelectedUsb] = React.useState("");
  const [includeLogFiles, setIncludeLogFiles] = React.useState(false);
  const [includeUltrasoundFiles, setIncludeUltrasoundFiles] =
    React.useState(false);

  const [selectedVisitIds, setSelectedVisitIds] = React.useState([]);

  const handleRefreshUsb = () => {
    console.log("Refersh usb list");
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
      <h2 class="card-title">
        {/* {<Icon class="icon--white icon--medium" id="cloud" />}  */}
        Export Visits to USB
      </h2>

      <div class="card-content card-content--denseSpacing">
        <p>
          Select the USB and visits to be exported. The visit data will remain
          in the device after exporting. Exporting visits may take a while.
        </p>
        <div class="dialog-custom-row">
          <FormControl fullWidth>
            <InputLabel>Select USB</InputLabel>
            <Select
              value={selectedUsb}
              onChange={(event) => setSelectedUsb(event.target.value)}
              label="Select USB"
              MenuProps={{ variant: "medium-length" }}
            >
              <MenuItem value={""}>No USB detected</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh USB list" arrow>
            <IconButton
              color="primary"
              variant="outlined"
              onClick={() => handleRefreshUsb()}
            >
              <Icon class="icon--white icon--small" id="update" />
            </IconButton>
          </Tooltip>

          <span>
            <FormControlLabel
              control={
                <Checkbox
                  variant="left"
                  checked={includeLogFiles}
                  onChange={() => setIncludeLogFiles(!includeLogFiles)}
                  size="large"
                  color="primary"
                />
              }
              label="Include log files"
            />

            <FormControlLabel
              control={
                <Checkbox
                  variant="left"
                  checked={includeUltrasoundFiles}
                  onChange={() =>
                    setIncludeUltrasoundFiles(!includeUltrasoundFiles)
                  }
                  size="large"
                  color="primary"
                />
              }
              label="Include ultrasound data files"
            />
          </span>
        </div>
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
          disabled={selectedUsb.length === 0 || selectedVisitIds.length === 0}
          fullWidth
          variant="contained"
          color="primary"
        >
          Export to USB
        </Button>
      </div>
    </Dialog>
  );
}

export default DialogUsb;
