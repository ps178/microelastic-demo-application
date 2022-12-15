import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import { Icon } from "./sharedComponents";

function DataTable(props) {
  const organizationVisitMetadata = useSelector(
    (state) => state.user.organizationVisitMetadata
  );
  const organizationProtocols = useSelector(
    (state) => state.user.organizationProtocols
  );
  const organizationParticipants = useSelector(
    (state) => state.user.organizationParticipants
  );
  const [filteredTableData, setFilteredTableData] = React.useState([]);
  const [clickedRowVisitId, setClickedRowVisitId] = React.useState(null);

  ///////// UTILITY FUNCTIONS //////////////////////////
  function countValue(header, repeatedValue) {
    return Object.keys(organizationVisitMetadata)
      .map((visitId) => organizationVisitMetadata[visitId][header])
      .reduce(
        (accumulator, element) =>
          element === repeatedValue ? (accumulator += 1) : accumulator,
        0
      );
  }
  function countUnique(dataSet, header) {
    return new Set(dataSet.map((visit) => visit[header])).size;
  }
  function arrayEquals(a, b) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    );
  }
  function getUniqueTableData(header) {
    return [
      ...new Set(
        Object.keys(organizationVisitMetadata).map(
          (visitId) => organizationVisitMetadata[visitId][header]
        )
      ),
    ];
  }
  function getVisitDateRange() {
    if (filteredTableData.length !== 0) {
      let dataRange =
        new Date(
          Math.min(
            ...filteredTableData.map((x) => new Date(x.visitDate.split(" ")[0]))
          )
        )
          .toISOString()
          .split("T")[0] +
        " to " +
        new Date(
          Math.max(
            ...filteredTableData.map((x) => new Date(x.visitDate.split(" ")[0]))
          )
        )
          .toISOString()
          .split("T")[0];

      return dataRange;
    }
    return "-";
  }
  ////////////////////////////////////

  // PROTOCOLS
  const [allProtocols, setAllProtocols] = React.useState(true);
  const [selectedProtocolIds, setSelectedProtocolIds] = React.useState(
    Object.keys(organizationProtocols)
  );

  const handleSelectProtocol = (event) => {
    const value =
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value;

    if (allProtocols && value.includes("ALL_PROTOCOLS")) {
      setAllProtocols(false);
      setSelectedProtocolIds([]);
    } else if (
      allProtocols &&
      !arrayEquals(value, Object.keys(organizationProtocols))
    ) {
      setAllProtocols(false);
      setSelectedProtocolIds(value);
    } else if (!allProtocols && value.includes("ALL_PROTOCOLS")) {
      setAllProtocols(true);
      setSelectedProtocolIds([...Object.keys(organizationProtocols)]);
    } else if (!allProtocols && !value.includes("ALL_PROTOCOLS")) {
      if (
        Object.keys(organizationProtocols).every((protocolId) =>
          value.includes(protocolId)
        )
      ) {
        setAllProtocols(true);
      }
      setSelectedProtocolIds(value);
    }
  };

  // PARTICIPANTS
  const [allParticipants, setAllParticipants] = React.useState(true);
  const [selectedParticipantIds, setSelectedParticipantIds] = React.useState(
    Object.keys(organizationParticipants)
  );
  const handleSelectParticipant = (event) => {
    const value =
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value;
    if (allParticipants && value.includes("ALL_PARTICIPANTS")) {
      setAllParticipants(false);
      setSelectedParticipantIds([]);
    } else if (
      allParticipants &&
      !arrayEquals(value, getUniqueTableData("participantId"))
    ) {
      setAllParticipants(false);
      setSelectedParticipantIds(value);
    } else if (!allParticipants && value.includes("ALL_PARTICIPANTS")) {
      setAllParticipants(true);
      setSelectedParticipantIds([...getUniqueTableData("participantId")]);
    } else if (!allParticipants && !value.includes("ALL_PARTICIPANTS")) {
      if (
        Object.keys(organizationParticipants).every((participantId) =>
          value.includes(participantId)
        )
      ) {
        setAllParticipants(true);
      }
      setSelectedParticipantIds(value);
    }
  };

  // STATUS
  const statusOptions = {
    LOCAL: "Local",
    CLOUD: "Cloud",
    SYNCED: "Synced",
    CLOUD_AHEAD: "Cloud ahead",
    LOCAL_AHEAD: "Local ahead",
    DIVERGED: "Diverged",
  };
  const [allStatus, setAllStatus] = React.useState(
    Object.keys(statusOptions).every((statusInd) =>
      getUniqueTableData("status").includes(statusInd)
    )
  );
  const [selectedStatus, setSelectedStatus] = React.useState(
    getUniqueTableData("status")
  );

  const handleStatusChange = (event) => {
    const value =
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value;
    if (allStatus && value.includes("ALL_STATUS")) {
      setAllStatus(false);
      setSelectedStatus([]);
    } else if (allStatus && !arrayEquals(value, Object.keys(statusOptions))) {
      setAllStatus(false);
      setSelectedStatus(value);
    } else if (!allStatus && value.includes("ALL_STATUS")) {
      setAllStatus(true);
      setSelectedStatus([...Object.keys(statusOptions)]);
    } else if (!allStatus && !value.includes("ALL_STATUS")) {
      setSelectedStatus(value);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "LOCAL":
        return (
          <Icon
            style={{ verticalAlign: "bottom" }}
            class="icon--white icon--medium"
            id="local"
          />
        );
      case "CLOUD":
        return (
          <Icon
            style={{ verticalAlign: "bottom" }}
            class="icon--white icon--medium"
            id="cloud"
          />
        );
      case "DIVERGED":
        return (
          <Icon
            style={{ verticalAlign: "bottom" }}
            class="icon--white icon--large"
            id="diverged"
          />
        );
      case "SYNCED":
        return (
          <Icon
            style={{ verticalAlign: "bottom" }}
            class="icon--white icon--large"
            id="synced"
          />
        );
      case "LOCAL_AHEAD":
        return (
          <Icon
            style={{ verticalAlign: "bottom" }}
            class="icon--white icon--large"
            id="localAhead"
          />
        );
      case "CLOUD_AHEAD":
        return (
          <Icon
            style={{ verticalAlign: "bottom" }}
            class="icon--white icon--large"
            id="cloudAhead"
          />
        );
      default:
        return;
    }
  };

  // DATE
  const [selectedOrder, setSelectedOrder] = React.useState("desc");

  // Filter and Sort
  const handleChangeFilter = () => {
    let metaDataArray = Object.keys(organizationVisitMetadata).map(
      (visitId) => organizationVisitMetadata[visitId]
    );

    let protocolFiltered = [...metaDataArray];
    if (!allProtocols) {
      protocolFiltered = protocolFiltered.filter((x) =>
        selectedProtocolIds.includes(x.protocolId)
      );
    }
    let participantFiltered = protocolFiltered;
    if (!allParticipants) {
      participantFiltered = participantFiltered.filter((x) =>
        selectedParticipantIds.includes(x.participantId)
      );
    }

    let statusFiltered = participantFiltered;
    if (!allStatus) {
      statusFiltered = statusFiltered.filter((x) =>
        selectedStatus.includes(x.status)
      );
    }

    if (selectedOrder === "asc") {
      statusFiltered.sort(
        (a, b) =>
          new Date(a.visitDate.split(" ")[0]) -
          new Date(b.visitDate.split(" ")[0])
      );
    } else {
      statusFiltered.sort(
        (a, b) =>
          new Date(b.visitDate.split(" ")[0]) -
          new Date(a.visitDate.split(" ")[0])
      );
    }

    setFilteredTableData(statusFiltered);
  };

  React.useEffect(() => {
    if (allParticipants) {
      setSelectedParticipantIds(Object.keys(organizationParticipants));
    }
    if (allProtocols) {
      setSelectedProtocolIds(Object.keys(organizationProtocols));
    }
  }, [organizationParticipants, organizationProtocols]);

  React.useEffect(() => {
    //Change table headers when dataTablePrompt changes
    handleChangeFilter();
  }, [
    selectedProtocolIds,
    selectedParticipantIds,
    selectedOrder,
    selectedStatus,
    organizationVisitMetadata,
  ]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      props.setSelectedVisitIds([
        ...filteredTableData.map((visit) => visit.visitId),
      ]);
      return;
    }
    props.setSelectedVisitIds([]);
  };
  const handleRowDoubleClick = (row) => {
    if (!props.checkboxColumn) {
      props.loadVisit(row);
    }
  };
  const handleRowClick = (row) => {
    if (props.checkboxColumn) {
      const selectedIndex = props.selectedVisitIds.indexOf(row.visitId);
      let newSelected = [];
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(props.selectedVisitIds, row.visitId);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(props.selectedVisitIds.slice(1));
      } else if (selectedIndex === props.selectedVisitIds.length - 1) {
        newSelected = newSelected.concat(props.selectedVisitIds.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          props.selectedVisitIds.slice(0, selectedIndex),
          props.selectedVisitIds.slice(selectedIndex + 1)
        );
      }
      props.setSelectedVisitIds([...newSelected]);
    } else {
      if (clickedRowVisitId === row.visitId) {
        setClickedRowVisitId(null);
        props.setSelectedVisit(null);
      } else {
        setClickedRowVisitId(row.visitId);
        props.setSelectedVisit(row);
      }
    }
  };

  return (
    <TableContainer
      className="table"
      checkboxColumn={props.checkboxColumn}
      component={Paper}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {props.checkboxColumn && (
              <TableCell
                align="center"
                sx={{ width: "5%", borderTopLeftRadius: "8px" }}
              >
                <React.Fragment>
                  <Checkbox
                    size="large"
                    color="primary"
                    variant="table"
                    indeterminate={
                      props.selectedVisitIds.length > 0 &&
                      props.selectedVisitIds.length < filteredTableData.length
                    }
                    checked={
                      filteredTableData.length > 0 &&
                      props.selectedVisitIds.length === filteredTableData.length
                    }
                    onChange={(event) => handleSelectAllClick(event)}
                  />
                  <p class="font--small font--disabled margin--top">
                    ({props.selectedVisitIds.length})
                  </p>
                </React.Fragment>
              </TableCell>
            )}

            <TableCell
              align="center"
              sx={{
                width: props.checkboxColumn ? "35%" : "40%",
                borderTopLeftRadius: props.checkboxColumn ? "0px" : "8px",
              }}
            >
              <React.Fragment>
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={selectedProtocolIds}
                    onChange={handleSelectProtocol}
                    renderValue={(selected) =>
                      allProtocols
                        ? "All Visit Types"
                        : selected
                            .map(
                              (protocolId) => organizationProtocols[protocolId]
                            )
                            .join(", ")
                    }
                    MenuProps={{ variant: "long" }}
                  >
                    <MenuItem
                      variant="withCheckbox"
                      key={"ALL_PROTOCOLS"}
                      value={"ALL_PROTOCOLS"}
                    >
                      <Checkbox
                        size="large"
                        checked={allProtocols}
                        indeterminate={
                          !allProtocols && selectedProtocolIds.length > 0
                        }
                      />
                      <ListItemText primary={"All Visit Types"} />
                    </MenuItem>
                    {Object.keys(organizationProtocols).map((protocolId) => (
                      <MenuItem
                        variant="withCheckbox"
                        key={protocolId}
                        value={protocolId}
                      >
                        <Checkbox
                          size="large"
                          checked={
                            selectedProtocolIds.includes(protocolId) ||
                            allProtocols
                          }
                        />
                        <ListItemText
                          primary={organizationProtocols[protocolId]}
                        />
                        <p class="font--fontSecondary padding--left">
                          ({countValue("protocolId", protocolId)})
                        </p>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <p class="font--small font--disabled margin--top">
                  {countUnique(filteredTableData, "protocolName") > 1
                    ? `${countUnique(
                        filteredTableData,
                        "protocolName"
                      )} Visit Types`
                    : `${countUnique(
                        filteredTableData,
                        "protocolName"
                      )} Visit Type`}
                </p>
              </React.Fragment>
            </TableCell>
            <TableCell align="center" sx={{ width: "30%" }}>
              <React.Fragment>
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={selectedParticipantIds}
                    onChange={handleSelectParticipant}
                    renderValue={(selected) =>
                      allParticipants
                        ? "All Patients"
                        : selected
                            .map(
                              (participantId) =>
                                organizationParticipants[participantId]
                                  .participantSecondaryId
                            )
                            .join(", ")
                    }
                    MenuProps={{ variant: "long" }}
                  >
                    <MenuItem
                      variant="withCheckbox"
                      key={"ALL_PARTICIPANTS"}
                      value={"ALL_PARTICIPANTS"}
                    >
                      <Checkbox
                        size="large"
                        checked={allParticipants}
                        indeterminate={
                          !allParticipants && selectedParticipantIds.length > 0
                        }
                      />
                      <ListItemText primary={"All Patients"} />
                    </MenuItem>

                    {Object.keys(organizationParticipants).map(
                      (participantId) => (
                        <MenuItem
                          variant="withCheckbox"
                          key={participantId}
                          value={participantId}
                        >
                          <Checkbox
                            size="large"
                            checked={
                              selectedParticipantIds.includes(participantId) ||
                              allParticipants
                            }
                          />
                          <ListItemText
                            primary={
                              organizationParticipants[participantId]
                                .participantSecondaryId
                            }
                            secondary={
                              <p class="font--small font--disabled">
                                {
                                  organizationParticipants[participantId]
                                    ?.firstName
                                }{" "}
                                {
                                  organizationParticipants[participantId]
                                    .lastName
                                }
                              </p>
                            }
                          />

                          <p class="font--fontSecondary padding--left">
                            ({countValue("participantId", participantId)})
                          </p>
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>

                <p class="font--small font--disabled margin--top">
                  {countUnique(filteredTableData, "participantSecondaryId") > 1
                    ? `${countUnique(
                        filteredTableData,
                        "participantSecondaryId"
                      )} Patients`
                    : `${countUnique(
                        filteredTableData,
                        "participantSecondaryId"
                      )} Patient`}
                </p>
              </React.Fragment>
            </TableCell>
            <TableCell align="center" sx={{ width: "30%" }}>
              <React.Fragment>
                <FormControl fullWidth>
                  <Select
                    sx={{ height: "64.6px" }}
                    value={selectedOrder}
                    onChange={(event) => setSelectedOrder(event.target.value)}
                    MenuProps={{ variant: "long" }}
                  >
                    <MenuItem key={"desc"} value={"desc"}>
                      <ListItemText primary={"Newest to oldest"} />
                    </MenuItem>
                    <MenuItem key={"asc"} value={"asc"}>
                      <ListItemText primary={"Oldest to newest"} />
                    </MenuItem>
                  </Select>
                </FormControl>

                <p class="font--small font--disabled margin--top">
                  {getVisitDateRange()}
                </p>
              </React.Fragment>
            </TableCell>
            <TableCell
              align="center"
              sx={{ width: "20%", borderTopRightRadius: "8px" }}
            >
              <React.Fragment>
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    renderValue={(selected) =>
                      allStatus
                        ? "All Status"
                        : selected
                            .map((statusInd) => statusOptions[statusInd])
                            .join(", ")
                    }
                    MenuProps={{ variant: "long" }}
                  >
                    <MenuItem
                      variant="withCheckbox"
                      key={"ALL_STATUS"}
                      value={"ALL_STATUS"}
                    >
                      <Checkbox
                        size="large"
                        checked={allStatus}
                        indeterminate={!allStatus && selectedStatus.length > 0}
                      />
                      <ListItemText primary={"All Status"} />
                    </MenuItem>

                    {Object.keys(statusOptions).map((status) => (
                      <MenuItem
                        variant="withCheckbox"
                        key={status}
                        value={status}
                      >
                        <Checkbox
                          size="large"
                          checked={selectedStatus.includes(status) || allStatus}
                        />
                        <ListItemText
                          primary={statusOptions[status]}
                          style={{ paddingRight: "2rem" }}
                        />
                        {getStatusIcon(status)}

                        <p class="font--fontSecondary padding--left">
                          ({countValue("status", status)})
                        </p>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <p class="font--small font--disabled margin--top">
                  {filteredTableData.length} Visits
                </p>
              </React.Fragment>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredTableData.map((row) => (
            <TableRow
              key={row.visitId}
              hover
              onDoubleClick={() => handleRowDoubleClick(row)}
              onClick={() => handleRowClick(row)}
              selected={
                (props.checkboxColumn &&
                  props.selectedVisitIds.includes(row.visitId)) ||
                clickedRowVisitId === row.visitId
              }
              dense={props.checkboxColumn}
            >
              {props.checkboxColumn && (
                <TableCell align="center">
                  <Checkbox
                    size="large"
                    color="primary"
                    variant="table"
                    checked={props.selectedVisitIds.includes(row.visitId)}
                  />
                </TableCell>
              )}
              <TableCell align="center">{row.protocolName}</TableCell>
              <TableCell align="center">{row.participantSecondaryId}</TableCell>
              <TableCell align="center">
                {row.visitDate.split(" ")[0]}
              </TableCell>
              <TableCell align="center">{getStatusIcon(row.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
