import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { setPageId, updateSnackbarStatus } from "../reducerSlices/utilitySlice";
import pageIds from "../constants/pageMap";
// import {
//   useFetchGetOrganizationMutation,
//   useFetchSyncUserMutation,
// } from "../reducerSlices/api";
import { CircularProgress, Tooltip } from "@mui/material";
import { CopyrightText, Icon } from "./sharedComponents";
import IconButton from "@mui/material/IconButton";
import { fetchGetOrganization } from "../reducerSlices/userSlice";

function UserPage() {
  const user = useSelector((state) => ({
    username: state.user.username,
    name: state.user.name,
  }));
  const organizations = useSelector((state) => state.user.organizations);
  const dispatch = useDispatch();
  const [selectedOrganizationId, setSelectedOrganizationId] =
    React.useState("");

  const [isLoadingOrganization, setIsLoadingOrganization] = React.useState("");
  // const [fetchGetOrganization, { isLoading: isLoadingOrganization }] =
  //   useFetchGetOrganizationMutation();
  // const [
  //   fetchSyncUser,
  //   { isLoading: isLoadingSyncUser, isSuccess: isSuccessSyncUser },
  // ] = useFetchSyncUserMutation();

  const handleSubmit = () => {
    // fetchGetOrganization(selectedOrganizationId)
    //   .unwrap()
    //   .then(() => {
    //     dispatch(setPageId(pageIds.organizationPage));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     dispatch(
    //       updateSnackbarStatus({ type: "error", status: true, message: error })
    //     );
    //     setSelectedOrganizationId("");
    //   });
    setIsLoadingOrganization(true);
    setTimeout(function () {
      dispatch(fetchGetOrganization(selectedOrganizationId));
      dispatch(setPageId(pageIds.organizationPage));
    }, 500);
  };

  // const handleCloudSync = () => {
  //   fetchSyncUser(user.username)
  //     .unwrap()
  //     .catch((error) => {
  //       console.log(error);
  //       dispatch(
  //         updateSnackbarStatus({
  //           type: "error",
  //           status: true,
  //           message: error?.data?.message,
  //         })
  //       );
  //     });
  // };

  return (
    <div class="app-body">
      <div class="card card--single shadow--dark">
        <h2 class="card-title">Welcome {user.name}</h2>

        <div class="card-content card-content--normalSpacing">
          <p>Select the organization you want to use.</p>
          <FormControl>
            <InputLabel>Available organizations</InputLabel>
            <Select
              value={selectedOrganizationId}
              onChange={(event) =>
                setSelectedOrganizationId(event.target.value)
              }
              label={"Available contexts"}
            >
              {Object.keys(organizations).map((orgId) => (
                <MenuItem key={orgId} value={orgId}>
                  {organizations[orgId]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title="Sync User Settings with Cloud" arrow>
            <IconButton
              color="primary"
              variant="outlined"
              // onClick={() => handleCloudSync()}
              // disabled={isLoadingSyncUser}
              disabled={true}
            >
              <Icon class={"icon--disabled icon--medium"} id={"cloudSync"} />
              {/* {isLoadingSyncUser && (
                <CircularProgress
                  size={45}
                  className={"iconButton-circularProgress"}
                />
              )} */}
            </IconButton>
          </Tooltip>
        </div>
        <div class="card-action">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={
              selectedOrganizationId.length === 0 || isLoadingOrganization
            }
            onClick={() => handleSubmit()}
          >
            {isLoadingOrganization && <CircularProgress size={30} />}
            Continue
          </Button>
        </div>
      </div>

      <CopyrightText />
    </div>
  );
}

export default UserPage;
