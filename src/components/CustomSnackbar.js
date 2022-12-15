import { Snackbar } from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetSnackbar } from "../reducerSlices/utilitySlice";
import { Icon } from "./sharedComponents";
import Slide from "@mui/material/Slide";
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}
function CustomSnackbar() {
  const dispatch = useDispatch();
  const snackbar = useSelector((state) => state.utility.snackbar);
  const [snackbarSettings, setSnackbarSettings] = React.useState({
    type: null,
    status: false,
    message: null,
  });

  React.useEffect(() => {
    if (snackbar.status) {
      setSnackbarSettings({
        ...snackbar,
      });
    }
  }, [snackbar.status]);

  const handleResetSnackbar = () => {
    setSnackbarSettings({ ...snackbarSettings, status: false });
    dispatch(resetSnackbar());
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    handleResetSnackbar();
  };

  function getSnackbarContent() {
    switch (snackbarSettings.type) {
      case "error":
        return (
          <div class="snackbar snackbar--error">
            <Icon class="snackbar-icon icon--error icon--medium" id="warning" />
            <p class="snackbar-title"> Error</p>
            <p class="snackbar-message">{snackbarSettings.message}</p>
            <Icon
              onClick={() => handleResetSnackbar()}
              class="snackbar-action  icon--small"
              id="cross"
            />{" "}
          </div>
        );

      case "warning":
        return (
          <div class="snackbar snackbar--warning">
            <Icon
              class="snackbar-icon icon--warning icon--medium"
              id="warning"
            />
            <p class="snackbar-title"> Warning</p>
            <p class="snackbar-message">{snackbarSettings.message}</p>
            <Icon
              onClick={() => handleResetSnackbar()}
              class="snackbar-action  icon--small"
              id="cross"
            />{" "}
          </div>
        );
      default: // "success":
        return (
          <div class="snackbar snackbar--success">
            <Icon
              class="snackbar-icon icon--primaryDark icon--medium"
              id="complete"
            />
            <p class="snackbar-title"> Success</p>
            <p class="snackbar-message">{snackbarSettings.message}</p>
            <Icon
              onClick={() => handleResetSnackbar()}
              class="snackbar-action  icon--small"
              id="cross"
            />
          </div>
        );
    }
  }

  return (
    <Snackbar
      open={snackbarSettings.status}
      autoHideDuration={4000}
      transitionDuration={300}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
    >
      {getSnackbarContent()}
    </Snackbar>
  );
}

export default CustomSnackbar;
