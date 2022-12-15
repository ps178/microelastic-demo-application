import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { Icon, DatePicker, TimePicker } from "./sharedComponents";
import { useSelector } from "react-redux";

function DialogDate(props) {
  const wifiConnection = useSelector(
    (state) => state.utility.wifi.wifiConnection
  );
  const dateTime = useSelector((state) => state.utility.dateTime);
  const [selectedTime, setSelectedTime] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(null);

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
        {/* {<Icon class="icon--white icon--medium" id="calender" />}  */}
        Date and Time
      </h2>

      <div class="card-content card-content--noScroll card-content--normalSpacing">
        {!wifiConnection && (
          <span class="warning-text">
            <Icon class="icon--large icon--warning" id="warning" />
            <p>
              Device is not connected to the internet. Please manually set the
              correct date and time.
            </p>
          </span>
        )}

        <p>
          Current date: {new Date().getDate()}-{new Date().getMonth()}-
          {new Date().getFullYear()} <br />
          Current time: {new Date().getHours()}:{new Date().getMinutes()}
        </p>

        <TimePicker
          label="Time"
          value={selectedTime}
          onChange={(newValue) => setSelectedTime(newValue)}
        />
        <DatePicker
          value={selectedDate}
          label="Date"
          onChange={(date) => setSelectedDate(date.format("YYYY-MM-DD"))}
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
          // disabled={selectedDate === null}
          disabled
          fullWidth
          variant="contained"
          color="primary"
        >
          Set Date
        </Button>
      </div>
    </Dialog>
  );
}

export default DialogDate;
