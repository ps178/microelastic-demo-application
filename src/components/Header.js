import React from "react";
import { useSelector, useDispatch } from "react-redux";
import pageIds, { locationSubviews } from "../constants/pageMap";
import { Icon } from "./sharedComponents";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import ListItemIcon from "@mui/material/ListItemIcon";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import DialogWifi from "./DialogWifi";
import DialogDate from "./DialogDate";
import DialogCloud from "./organizationPage/DialogCloud";
import DialogUsb from "./organizationPage/DialogUsb";
import DialogSave from "./DialogSave";
import DialogQuit from "./DialogQuit";
import {
  setLocationSubview,
  setPageId,
  logOut,
} from "../reducerSlices/utilitySlice";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {
  selectProtocolLocationById,
  setNewLocationName,
} from "../reducerSlices/protocolSlice";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { setSelectedSampleId } from "../reducerSlices/samplesSlice";
import { toggleRememberMe } from "../reducerSlices/userSlice";
import Device from "./Device";
import { setSelectedLocationId } from "../reducerSlices/locationsSlice";

function Header(props) {
  // Redux state
  const dispatch = useDispatch();
  const currentViewId = useSelector((state) => state.utility.pageId);
  const user = useSelector((state) => ({
    username: state.user.username,
    name: state.user.name,
    rememberMe: state.user.rememberMe,
    rememberMeAllowed: state.user.rememberMeAllowed,
  }));
  const organizationName = useSelector((state) => state.user.organizationName);
  const locationSubview = useSelector((state) => state.utility.locationSubview);
  const device = useSelector((state) => ({
    simulate: state.device.simulate,
    connected: state.device.connected,
  }));
  const selectedLocation = useSelector((state) => ({
    locationId: state.locations.selectedLocationId,
    locationName: selectProtocolLocationById(
      state,
      state.locations.selectedLocationId
    )?.name,
  }));

  //Dialog States
  const [dialogOpen, setDialogOpen] = React.useState({
    dialogWifi: false,
    dialogDate: false,
    dialogCloud: false,
    dialogUsb: false,
    dialogSave: false,
    dialogQuit: false,
  });
  const closeDialog = (dialog) => {
    setDialogOpen({ ...dialogOpen, [dialog]: false });
  };
  const openDialog = (dialog) => {
    setDialogOpen({ ...dialogOpen, [dialog]: true });
    setMenuOpen(false);
  };

  const [menuOpen, setMenuOpen] = React.useState(false);

  function headerLeft(pageId) {
    switch (pageId) {
      case pageIds.loginPage:
      case pageIds.userPage:
      case pageIds.organizationPage:
        return <div></div>;
      default:
        if (device.simulate) {
          return (
            <>
              <Device
              // deviceSocket={props.deviceSocket}
              />
            </>
          );
        } else {
          return (
            <Device
            // deviceSocket={props.deviceSocket}
            />
          );
        }
    }
  }

  function headerCenter(pageId) {
    switch (pageId) {
      case pageIds.loginPage:
      case pageIds.userPage:
        return <Icon class="icon--white icon-logo" id="logoName" />;
      case pageIds.organizationPage:
        return (
          <Breadcrumbs
            separator={<Icon id="arrowRight" class="icon--white icon--small" />}
          >
            <p
              class="breadcrumb-clickable font--small"
              onClick={() => dispatch(setPageId(pageIds.userPage))}
            >
              {user.name}
            </p>
            <p class="breadcrumb-current font--small">{organizationName}</p>
          </Breadcrumbs>
        );
      case pageIds.overviewPage:
        return (
          <Breadcrumbs
            separator={<Icon id="arrowRight" class="icon--white icon--small" />}
          >
            <p class="breadcrumb-current font--small">Overview</p>
          </Breadcrumbs>
        );
      case pageIds.formsPage:
        return (
          <Breadcrumbs
            separator={<Icon id="arrowRight" class="icon--white icon--small" />}
          >
            <p
              class="breadcrumb-clickable font--small"
              onClick={() => dispatch(setPageId(pageIds.overviewPage))}
            >
              Overview
            </p>

            <p class="breadcrumb-current font--small">Forms</p>
          </Breadcrumbs>
        );
      case pageIds.locationsPage:
        return (
          <Breadcrumbs
            separator={<Icon id="arrowRight" class="icon--white icon--small" />}
          >
            <p
              class="breadcrumb-clickable font--small"
              onClick={() => dispatch(setPageId(pageIds.overviewPage))}
            >
              Overview
            </p>

            <p class="breadcrumb-current font--small">Measurement Sites</p>
          </Breadcrumbs>
        );
      case pageIds.selectedLocationPage:
        return (
          <Breadcrumbs
            separator={<Icon id="arrowRight" class="icon--white icon--small" />}
          >
            <p
              class="breadcrumb-clickable font--small"
              onClick={() => {
                dispatch(setPageId(pageIds.overviewPage));
                dispatch(setSelectedLocationId(null));
              }}
            >
              Overview
            </p>
            <p
              class="breadcrumb-clickable font--small"
              onClick={() => {
                dispatch(setPageId(pageIds.locationsPage));
                dispatch(
                  setLocationSubview(locationSubviews.locationInformation)
                );
                dispatch(setSelectedLocationId(null));
              }}
            >
              Measurement Sites
            </p>
            {locationSubview === locationSubviews.sample && (
              <p
                class="breadcrumb-clickable font--small"
                onClick={() => {
                  dispatch(
                    setLocationSubview(locationSubviews.locationInformation)
                  );
                  dispatch(setSelectedSampleId(null));
                }}
              >
                {selectedLocation.locationName}
              </p>
            )}
            {locationSubview === locationSubviews.sample && (
              <p class="breadcrumb-current font--small">Sample</p>
            )}
            {locationSubview === locationSubviews.locationInformation &&
              (selectedLocation.locationId.startsWith("NEW_LOCATION") ? (
                <FormControl variant="standard">
                  <Input
                    className={"header-locationNameEdit"}
                    value={selectedLocation.locationName}
                    onChange={(event) =>
                      dispatch(
                        setNewLocationName({
                          locationId: selectedLocation.locationId,
                          locationName: event.target.value,
                        })
                      )
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <Icon id="edit" class="icon--small icon--disabled" />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              ) : (
                <p class="breadcrumb-current font--small">
                  {selectedLocation.locationName}
                </p>
              ))}
          </Breadcrumbs>
        );

      default:
        return;
    }
  }

  function headerRight(pageId) {
    switch (pageId) {
      case pageIds.loginPage:
        return (
          <Button
            variant="buttonWithIcon"
            startIcon={<Icon class="icon--white icon--small" id="shutdown" />}
          >
            Shutdown
          </Button>
        );
      default:
        return (
          <React.Fragment>
            <IconButton onClick={() => setMenuOpen(true)}>
              <Icon class="icon--white icon--medium" id="menu" />
            </IconButton>

            <Drawer
              anchor={"right"}
              open={menuOpen}
              onClose={(event, reason) => {
                if (reason === "backdropClick") {
                  setMenuOpen(false);
                }
              }}
            >
              <List variant="menu">
                <ListItem variant="menu-header">
                  <ListItemIcon>
                    <Icon class="icon--white icon--medium" id="user" />
                  </ListItemIcon>
                  <ListItemText primary={user.name} secondary={user.username} />
                </ListItem>

                <ListItem>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary="Remember Me" />
                  <Switch
                    size="large"
                    checked={user.rememberMe}
                    disabled={!user.rememberMeAllowed}
                    onChange={() => dispatch(toggleRememberMe())}
                  />
                </ListItem>
                {[pageIds.organizationPage, pageIds.userPage].includes(
                  pageId
                ) && (
                  <ListItem
                    variant="menu-item"
                    onClick={() => {
                      setMenuOpen(false);
                      dispatch(logOut());
                      localStorage.removeItem("username");
                      localStorage.removeItem("password");
                    }}
                  >
                    <ListItemIcon>
                      <Icon class="icon--white icon--medium" id="logout" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItem>
                )}

                {pageId === pageIds.organizationPage && (
                  <React.Fragment>
                    <Divider variant="menu" />
                    <p class="subheader font--extrasmall">Export Visits</p>

                    <ListItem
                      variant="menu-item"
                      onClick={() => openDialog("dialogCloud")}
                    >
                      <ListItemIcon>
                        <Icon class="icon--white icon--medium" id="cloud" />
                      </ListItemIcon>
                      <ListItemText primary="Sync Visits to Cloud" />
                    </ListItem>
                    <ListItem
                      variant="menu-item"
                      onClick={() => openDialog("dialogUsb")}
                    >
                      <ListItemIcon>
                        <Icon class="icon--white icon--medium" id="usb" />
                      </ListItemIcon>
                      <ListItemText primary="Export Visits to USB" />
                    </ListItem>
                  </React.Fragment>
                )}

                {[
                  pageIds.overviewPage,
                  pageIds.locationsPage,
                  pageIds.formsPage,
                  pageIds.selectedLocationPage,
                ].includes(pageId) && (
                  <React.Fragment>
                    <Divider variant="menu" />
                    <p class="subheader font--extrasmall">Visit</p>

                    <ListItem
                      variant="menu-item"
                      onClick={() => openDialog("dialogSave")}
                    >
                      <ListItemIcon>
                        <Icon class="icon--white icon--medium" id="save" />
                      </ListItemIcon>
                      <ListItemText primary="Save Visit" />
                    </ListItem>
                    <ListItem
                      variant="menu-item"
                      onClick={() => openDialog("dialogQuit")}
                    >
                      <ListItemIcon>
                        <Icon class="icon--white icon--medium" id="quit" />
                      </ListItemIcon>
                      <ListItemText primary="Quit Visit" />
                    </ListItem>
                    <ListItem
                      variant="menu-item"
                      disabled
                      onClick={() => console.log("PDF")}
                    >
                      <ListItemIcon>
                        <Icon class="icon--white icon--medium" id="pdf" />
                      </ListItemIcon>
                      <ListItemText primary="Export Visit to PDF" />
                    </ListItem>
                    <ListItem
                      variant="menu-item"
                      disabled
                      onClick={() => console.log("CSV")}
                    >
                      <ListItemIcon>
                        <Icon class="icon--white icon--medium" id="csv" />
                      </ListItemIcon>
                      <ListItemText primary="Export Visit to CSV" />
                    </ListItem>
                  </React.Fragment>
                )}

                <Divider variant="menu" />
                <p class="subheader font--extrasmall">Advanced Settings</p>

                <ListItem
                  variant="menu-item"
                  onClick={() => console.log("UPDATES")}
                  disabled
                >
                  <ListItemIcon>
                    <Icon class="icon--white icon--medium" id="update" />
                  </ListItemIcon>
                  <ListItemText primary="Check for Updates" />
                </ListItem>
                <ListItem
                  variant="menu-item"
                  onClick={() => openDialog("dialogWifi")}
                >
                  <ListItemIcon>
                    <Icon class="icon--white icon--medium" id="wifi" />
                  </ListItemIcon>
                  <ListItemText primary="Wi-Fi" />
                </ListItem>
                <ListItem
                  variant="menu-item"
                  onClick={() => openDialog("dialogDate")}
                >
                  <ListItemIcon>
                    <Icon class="icon--white icon--medium" id="dateTime" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Date: ${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Icon class="icon--white icon--medium" id="keyboard" />
                  </ListItemIcon>
                  <ListItemText primary="Virtual Keyboard" />
                  <Switch disabled />
                </ListItem>
              </List>

              <span>
                <p class="subheader font--extrasmall">
                  Application Version: 2.3
                </p>
                <p class="subheader font--extrasmall">Server Version: 2.0</p>
              </span>
            </Drawer>
          </React.Fragment>
        );
    }
  }

  return (
    <div class="app-header">
      <span class="header-left">{headerLeft(currentViewId)}</span>
      <span class="header-center">{headerCenter(currentViewId)}</span>
      <span class="header-right">{headerRight(currentViewId)}</span>

      {dialogOpen.dialogWifi && (
        <DialogWifi
          open={dialogOpen.dialogWifi}
          closeDialog={() => closeDialog("dialogWifi")}
        />
      )}
      {dialogOpen.dialogDate && (
        <DialogDate
          open={dialogOpen.dialogDate}
          closeDialog={() => closeDialog("dialogDate")}
        />
      )}

      {dialogOpen.dialogCloud && (
        <DialogCloud
          open={dialogOpen.dialogCloud}
          closeDialog={() => closeDialog("dialogCloud")}
        />
      )}

      {dialogOpen.dialogUsb && (
        <DialogUsb
          open={dialogOpen.dialogUsb}
          closeDialog={() => closeDialog("dialogUsb")}
        />
      )}

      {dialogOpen.dialogSave && (
        <DialogSave
          open={dialogOpen.dialogSave}
          closeDialog={() => closeDialog("dialogSave")}
        />
      )}
      {dialogOpen.dialogQuit && (
        <DialogQuit
          open={dialogOpen.dialogQuit}
          closeDialog={() => closeDialog("dialogQuit")}
        />
      )}
    </div>
  );
}

export default Header;
