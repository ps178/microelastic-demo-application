import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { Icon } from "../../sharedComponents";

function DialogWarningMultipleFiles(props) {
  const [selectedFile, setSelectedFile] = React.useState("");

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
        {<Icon class="icon--warning icon--medium" id="warning" />} Multiple
        Visit Files
      </h2>
      <div class="card-content  card-content--noScroll  card-content--normalSpacing">
        <p>
          Visit folder contained multiple files. Please select the file you
          would like to load.
        </p>
        <p>
          Warning: if a manually saved file (ending in .visit) is selected, then
          the autosaved file (ending in .autosave.visit) may be overwritten.
        </p>

        {/* {Object.keys(props.visitInformation.multiple_files).map((filename) => {
          <ListItemButton onClick={() => setSelectedFile(filename)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={selectedFile === filename}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText
              primary={props.visitInformation.multiple_files[filename].filepath}
              secondary={props.visitInformation.multiple_files[filename].date}
            />
          </ListItemButton>;
        })} */}
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

        <Button fullWidth variant="contained" color="primary">
          Load Selected File
        </Button>
      </div>
    </Dialog>
  );
}

export default DialogWarningMultipleFiles;
