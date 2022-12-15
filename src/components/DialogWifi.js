import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Icon } from "./sharedComponents";
import { useSelector } from "react-redux";

function DialogWifi(props) {
  const wifi = useSelector((state) => state.utility.wifi);

  const [wifiCredentials, setWifiCredentials] = React.useState({
    selectedNetwork: "",
    password: "",
    showPassword: false,
  });
  const handleChange = (prop) => (event) => {
    setWifiCredentials({ ...wifiCredentials, [prop]: event.target.value });
  };
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
        {/* {<Icon class="icon--white icon--medium" id="wifi" />} */}
        Wi-Fi
      </h2>

      <div class="card-content card-content--noScroll card-content--normalSpacing">
        <p>
          {wifi.wifiConnection
            ? "Device is connected to "
            : "Device is not connected to Wi-Fi"}
        </p>

        <FormControl>
          <InputLabel>Available Networks</InputLabel>
          <Select
            value={wifiCredentials.selectedNetwork}
            onChange={(event) =>
              setWifiCredentials({
                ...wifiCredentials,
                selectedNetwork: event.target.value,
              })
            }
            label="Available Networks"
          >
            <MenuItem value={""}>No networks found</MenuItem>
          </Select>
        </FormControl>

        {wifiCredentials.selectedNetwork.length !== 0 && (
          <FormControl variant="standard">
            <InputLabel>Wi-Fi Password</InputLabel>
            <Input
              type={wifiCredentials.showPassword ? "text" : "password"}
              value={wifiCredentials.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setWifiCredentials({
                        ...wifiCredentials,
                        showPassword: !wifiCredentials.showPassword,
                      })
                    }
                  >
                    {wifiCredentials.showPassword ? (
                      <Icon class="icon--white icon--small" id={"visible"} />
                    ) : (
                      <Icon
                        class="icon--white icon--small"
                        id={"not_visible"}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        )}
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
        <Button fullWidth variant="contained" color="primary" disabled>
          Turn-Off Wi-Fi
        </Button>
        <Button
          disabled
          // disabled={wifiCredentials.selectedNetwork.length === 0}
          fullWidth
          variant="contained"
          color="primary"
        >
          Connect
        </Button>
      </div>
    </Dialog>
  );
}

export default DialogWifi;
