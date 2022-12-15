import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { Icon } from "./sharedComponents";
import { useSelector } from "react-redux";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";

function DialogSave(props) {
  const wifiConnection = useSelector(
    (state) => state.utility.wifi.wifiConnection
  );
  const saveFolder = useSelector((state) =>
    state.visitInfo.saveFolder.replace(/\\/g, "/")
  );
  const saveFilename = useSelector((state) => state.visitInfo.saveFilename);

  const [syncCloud, setSyncCloud] = React.useState(false);
  const [exportCsv, setExportCsv] = React.useState(false);
  const [exportPdf, setExportPdf] = React.useState(false);
  const [filename, setFilename] = React.useState(
    saveFilename.split(".visit")[0]
  );

  return (
    <Dialog
      PaperProps={{ className: "shadow--light" }}
      open={props.open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
        }
      }}
    >
      <h2 class="card-title">Save Visit</h2>

      <div class="card-content card-content--noScroll card-content--denseSpacing">
        <FormControlLabel
          disabled={!wifiConnection}
          control={
            <Checkbox
              variant="left"
              checked={syncCloud}
              onChange={() => setSyncCloud(!syncCloud)}
              size="large"
              color="primary"
            />
          }
          label="Sync visit to cloud"
        />

        <FormControlLabel
          control={
            <Checkbox
              variant="left"
              checked={exportCsv}
              onChange={() => setExportCsv(!exportCsv)}
              size="large"
              color="primary"
            />
          }
          label="Export to CSV"
        />

        <FormControlLabel
          control={
            <Checkbox
              variant="left"
              checked={exportPdf}
              onChange={() => setExportPdf(!exportPdf)}
              size="large"
              color="primary"
            />
          }
          label="Export to PDF"
        />

        <TextField
          value={saveFolder}
          InputProps={{
            readOnly: true,
          }}
          label="Folderpath"
          variant="standard"
          multiline
        />

        <FormControl variant="standard">
          <InputLabel>Filename</InputLabel>
          <Input
            readOnly
            value={filename}
            onChange={(event) => setFilename(event.target.value)}
            endAdornment={".visit"}
          />
        </FormControl>
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
          // disabled={saveFolder.length === 0 || filename.length === 0}
          disabled
          fullWidth
          variant="contained"
          color="primary"
        >
          Save Visit
        </Button>
      </div>
    </Dialog>
  );
}

export default DialogSave;
