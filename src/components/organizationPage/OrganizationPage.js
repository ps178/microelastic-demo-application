import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import DataTable from "../DataTable";
import NewVisit from "./NewVisit";
import NewParticipant from "./NewParticipant";
import Backdrop from "@mui/material/Backdrop";
import DialogWarningDownloadCloud from "./warningDialogs/DialogWarningDownloadCloud";
import DialogWarningDivergent from "./warningDialogs/DialogWarningDivergent";
import DialogWarningLocalOutdated from "./warningDialogs/DialogWarningLocalOutdated";
import DialogWarningCloudOutdated from "./warningDialogs/DialogWarningCloudOutdated";
import DialogWarningSampleData from "./warningDialogs/DialogWarningSampleData";
import DialogWarningMultipleFiles from "./warningDialogs/DialogWarningMultipleFiles";
import { Icon } from "../sharedComponents";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
// import {
//   useFetchLoadCloudVisitMutation,
//   useFetchLoadLocalVisitMutation,
//   useFetchSyncOrganizationMutation,
// } from "../../reducerSlices/api";
import {
  setPageId,
  updateSnackbarStatus,
} from "../../reducerSlices/utilitySlice";
import { Tooltip } from "@mui/material";
import { fetchLoadLocalVisit } from "../../reducerSlices/protocolSlice";
import pageIds from "../../constants/pageMap";

function OrganizationPage() {
  const dispatch = useDispatch();
  const [newVisitDialogOpen, setNewVisitDialogOpen] = React.useState(false);
  const [newParticipantDialogOpen, setNewParticipantDialogOpen] =
    React.useState(false);
  const [selectedVisit, setSelectedVisit] = React.useState(null);
  const [warningDialog, setWarningDialog] = React.useState({
    cloudDownload: false,
    divergent: false,
    localOutdated: false,
    cloudOutdated: false,
    sampleData: false,
    multipleFiles: false,
  });
  const organizationId = useSelector((state) => state.user.organizationId);
  // const [
  //   fetchSyncOrganization,
  //   {
  //     isLoading: isLoadingSyncOrganization,
  //     isSuccess: isSuccessSyncOrganization,
  //   },
  // ] = useFetchSyncOrganizationMutation();
  // const [fetchLoadLocalVisit, { isLoading: isLoadingLocalVisit }] =
  //   useFetchLoadLocalVisitMutation();
  // const [fetchLoadCloudVisit, { isLoading: isLoadingCLoudVisit }] =
  //   useFetchLoadCloudVisitMutation();

  const checkVisit = (visit) => {
    setSelectedVisit(visit);
    if (visit.status === "CLOUD") {
      setWarningDialog({
        ...warningDialog,
        cloudDownload: true,
      });
      // } else if (visit.status === "Local" && !visit.localData) {
      //   setWarningDialog({
      //     ...warningDialog,
      //     sampleData: true,
      //   });    // else if (visit.status === "localOutdated") {
      //   setWarningDialog({
      //     ...warningDialog,
      //     multipleFiles: true,
      //   });
      // }
    } else if (visit.status === "DIVERGED") {
      setWarningDialog({
        ...warningDialog,
        divergent: true,
      });
    } else if (visit.status === "LOCAL_AHEAD") {
      setWarningDialog({
        ...warningDialog,
        cloudOutdated: true,
      });
    } else if (visit.status === "CLOUD_AHEAD") {
      setWarningDialog({
        ...warningDialog,
        localOutdated: true,
      });
    } else {
      // LOCAL or SYNCED
      loadLocalVisit(visit);
    }
  };

  const loadLocalVisit = (visit, filename) => {
    console.log("LOAD LOCAL", visit, filename);
    dispatch(fetchLoadLocalVisit(visit.visitId));
    setTimeout(function () {
      dispatch(setPageId(pageIds.overviewPage));
    }, 200);

    // fetchLoadLocalVisit({ visitId, filename })
    //   .unwrap()
    //   .catch((error) => {
    //     console.log(error);
    //     dispatch(
    //       updateSnackbarStatus({
    //         type: "error",
    //         status: true,
    //         message: error?.data?.message,
    //       })
    //     );
    //   });
  };

  const loadCloudVisit = (visitId) => {
    // fetchLoadCloudVisit(visitId)
    //   .unwrap()
    //   .catch((error) => {
    //     console.log(error);
    //     dispatch(
    //       updateSnackbarStatus({
    //         type: "error",
    //         status: true,
    //         message: error?.data?.message,
    //       })
    //     );
    //   });
  };

  const handleCloudSync = () => {
    // fetchSyncOrganization(organizationId)
    //   .unwrap()
    //   .catch((error) => {
    //     console.log(error);
    //     dispatch(
    //       updateSnackbarStatus({
    //         type: "error",
    //         status: true,
    //         message: error?.data?.message,
    //       })
    //     );
    //   });
  };

  return (
    <div class="app-body organizationPage">
      <div class="organizationPage-buttonRow">
        <span>
          <Button
            onClick={() => setNewVisitDialogOpen(true)}
            variant="contained"
            color="primary"
          >
            New Visit
          </Button>
          <Button
            onClick={() => setNewParticipantDialogOpen(true)}
            variant="contained"
            color="primary"
          >
            New Patient
          </Button>
          <Button
            onClick={() => checkVisit(selectedVisit)}
            variant="contained"
            color="primary"
            disabled={selectedVisit === null}
          >
            Load Visit
          </Button>
        </span>

        <Tooltip title="Sync Organization with Cloud" arrow>
          <IconButton
            color="primary"
            variant="outlined"
            disabled={true}
            // onClick={() => handleCloudSync()}
            // disabled={isLoadingSyncOrganization}
          >
            <Icon class={"icon--disabled icon--medium"} id={"cloudSync"} />
            {/*    {isLoadingSyncOrganization && (
              <CircularProgress
                size={45}
                className={"iconButton-circularProgress"}
              />
            )} */}
          </IconButton>
        </Tooltip>
      </div>
      <DataTable
        checkboxColumn={false}
        setSelectedVisit={(row) => setSelectedVisit(row)}
        loadVisit={(row) => checkVisit(row)}
      />
      {newVisitDialogOpen && (
        <NewVisit
          open={newVisitDialogOpen}
          closeDialog={() => setNewVisitDialogOpen(false)}
        />
      )}
      {newParticipantDialogOpen && (
        <NewParticipant
          open={newParticipantDialogOpen}
          closeDialog={() => setNewParticipantDialogOpen(false)}
        />
      )}
      {warningDialog.cloudDownload && (
        <DialogWarningDownloadCloud
          visit={selectedVisit}
          open={warningDialog.cloudDownload}
          handleLoadCloudVisit={(visitId) => loadCloudVisit(visitId)}
          closeDialog={() =>
            setWarningDialog({
              ...warningDialog,
              cloudDownload: false,
            })
          }
        />
      )}
      {warningDialog.divergent && (
        <DialogWarningDivergent
          visit={selectedVisit}
          open={warningDialog.divergent}
          handleLoadLocalVisit={(visitId, filename) =>
            loadLocalVisit(visitId, filename)
          }
          handleLoadCloudVisit={(visitId) => loadCloudVisit(visitId)}
          closeDialog={() =>
            setWarningDialog({
              ...warningDialog,
              divergent: false,
            })
          }
        />
      )}
      {warningDialog.localOutdated && (
        <DialogWarningLocalOutdated
          visit={selectedVisit}
          open={warningDialog.localOutdated}
          handleLoadLocalVisit={(visitId, filename) =>
            loadLocalVisit(visitId, filename)
          }
          handleLoadCloudVisit={(visitId) => loadCloudVisit(visitId)}
          closeDialog={() =>
            setWarningDialog({
              ...warningDialog,
              localOutdated: false,
            })
          }
        />
      )}
      {warningDialog.cloudOutdated && (
        <DialogWarningCloudOutdated
          visit={selectedVisit}
          open={warningDialog.cloudOutdated}
          handleLoadLocalVisit={(visitId, filename) =>
            loadLocalVisit(visitId, filename)
          }
          closeDialog={() =>
            setWarningDialog({
              ...warningDialog,
              cloudOutdated: false,
            })
          }
        />
      )}
      {warningDialog.sampleData && (
        <DialogWarningSampleData
          visit={selectedVisit}
          // loadVisit={(visit) => loadVisit(visit)}
          open={warningDialog.sampleData}
          closeDialog={() =>
            setWarningDialog({
              ...warningDialog,
              sampleData: false,
            })
          }
        />
      )}
      {warningDialog.multipleFiles && (
        <DialogWarningMultipleFiles
          open={warningDialog.multipleFiles}
          closeDialog={() =>
            setWarningDialog({
              ...warningDialog,
              multipleFiles: false,
            })
          }
          visit={selectedVisit}
        />
      )}
      <Backdrop
        open={
          false
          // isLoadingCLoudVisit ||
          // isLoadingLocalVisit ||
          // isLoadingSyncOrganization
        }
      >
        <CircularProgress />
      </Backdrop>
    </div>
  );
}

export default OrganizationPage;
