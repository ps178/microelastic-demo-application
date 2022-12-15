import Icons from "../constants/sprite.svg";
import theme from "../constants/theme";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";

export const Icon = ({ id, ...props }) => {
  return (
    // <svg class={`icon icon--${color} icon--${size}`}>
    <svg {...props}>
      <use href={Icons + `#${id}`} />
    </svg>
  );
};

export const thicknessAvgStamp = (value, sd, count, typeName) => {
  return (
    <div class="valueAvgStamp-container">
      <Icon
        id="thickness3"
        class="valueAvgStamp-icon icon--large icon--secondary"
      />
      <p class="valueAvgStamp-value font--secondary">
        {value ? value.toFixed(1) : "-"}
      </p>

      <p class="valueAvgStamp-unitsSd font--small font--secondary">
        ± {sd ? sd.toFixed(1) : "-"}
        <br />
        mm
      </p>
      <p class="valueAvgStamp-count font--extrasmall font--secondary">
        {typeName}, {count} {count === 1 ? "sample" : "samples"}
      </p>
    </div>
  );
};

export const thicknessStamp = (value) => {
  return (
    <div class="valueStamp-container">
      <Icon
        id="thickness3"
        class="valueStamp-icon icon--large icon--secondary"
      />
      <p class="valueStamp-value font--secondary">
        {value ? value.toFixed(1) : "-"}
      </p>

      <p class="valueStamp-units font--small font--secondary">mm</p>
    </div>
  );
};

export const elasticityAvgStamp = (value, sd, count, typeName) => {
  return (
    <div class="valueAvgStamp-container">
      <Icon
        id="elasticity2"
        class="valueAvgStamp-icon icon--large icon--tertiary"
      />
      <p class="valueAvgStamp-value font--tertiary">
        {value ? value.toFixed(1) : "-"}
      </p>

      <p class="valueAvgStamp-unitsSd font--small font--tertiary">
        ± {sd ? sd.toFixed(1) : "-"}
        <br />
        m/s
      </p>
      <p class="valueAvgStamp-count font--extrasmall font--tertiary">
        {typeName}, {count} {count === 1 ? "sample" : "samples"}
      </p>
    </div>
  );
};
export const elasticityStamp = (value) => {
  return (
    <div class="valueStamp-container">
      <Icon
        id="elasticity2"
        class="valueStamp-icon icon--large icon--tertiary"
      />
      <p class="valueStamp-value font--tertiary">
        {value ? value.toFixed(1) : "-"}
      </p>

      <p class="valueStamp-units font--small font--tertiary">m/s</p>
    </div>
  );
};

export const getXAxis = (range, label, unit, plotWidth, stepSize = 1) => {
  const min = parseFloat(range[0].toFixed(1)); //Math.round(range[0]);
  const max = parseFloat(range[1].toFixed(1)); //Math.round(range[1]);
  const tickMarks = Array.from(
    { length: (max - min) / stepSize + 1 },
    (e, i) => min + i * stepSize
  );
  if (tickMarks[tickMarks.length - 1] !== max) {
    tickMarks.push(max);
  }
  return (
    <>
      <p class="xAxis-label">{`${label} (${unit})`}</p>
      {tickMarks.map((e, i) => (
        <div
          key={"step_" + i}
          class="xAxis-tick"
          style={{
            left: `${((e - min) / (max - min)) * plotWidth}px`,
          }}
        >
          <div class="xAxis-tick-label font--extrasmall">{e}</div>
        </div>
      ))}
    </>
  );
};

export const getYAxis = (range, label, unit, plotHeight, stepSize = 0.5) => {
  const min = parseFloat(range[0].toFixed(1)); //Math.round(range[0]);
  const max = parseFloat(range[1].toFixed(1)); //Math.round(range[1]);
  const tickMarks = Array.from(
    { length: (max - min) / stepSize + 1 },
    (e, i) => min + i * stepSize
  );
  if (tickMarks[tickMarks.length - 1] !== max) {
    tickMarks.push(max);
  }
  return (
    <>
      <p class="yAxis-label">{`${label} (${unit})`}</p>
      {tickMarks.map((e, i) => (
        <div
          key={"step_" + i}
          class="yAxis-tick"
          style={{
            top: `${((e - min) / (max - min)) * plotHeight}px`,
          }}
        >
          <div class="yAxis-tick-label font--extrasmall">{e}</div>
        </div>
      ))}
    </>
  );
};

export const CopyrightText = () => (
  <p id="copyright" class="font--extrasmall font--disabled">
    This software is for investigational research use only. It is provided as-is
    with no warranty. &copy; {new Date().getFullYear()} MicroElastic Ultrasound
    Systems
  </p>
);
export const DatePicker = (props) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DesktopDatePicker
      label={props.label}
      value={props.value}
      disableFuture
      onChange={(date) => {
        props.onChange(date);
      }}
      PopperProps={{
        sx: {
          "& .MuiPaper-root": {
            width: "420px",
          },
          "& .css-epd502": {
            margin: 0,
            width: "420px",
          },
          "& .MuiCalendarPicker-root": {
            width: "385px",
          },
          "& .MuiDayPicker-weekDayLabel": {
            fontSize: "2.2rem",
          },
          "& .PrivatePickersYear-yearButton": {
            fontSize: "2.2rem",
            "&:hover": {
              backgroundColor: theme().palette.primary.dark,
            },
          },
          "& .MuiPickersDay-root": {
            fontSize: "2.2rem",
            "&:hover": {
              backgroundColor: theme().palette.primary.dark,
            },
          },
          "& .MuiSvgIcon-root": { width: "30px", height: "30px" },
        },
      }}
      InputProps={{
        sx: { "& .MuiSvgIcon-root": { width: "30px", height: "30px" } },
      }}
      renderInput={(params) => <TextField {...params} />}
    />
  </LocalizationProvider>
);

export const TimePicker = (props) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DesktopTimePicker
      label={props.label}
      value={props.value}
      disableFuture
      onChange={(date) => {
        props.onChange(date);
      }}
      ampm={false}
      PopperProps={{
        sx: {
          "& .MuiPaper-root": {
            width: "400px",
          },
          "& .MuiClock-clock": {
            width: "210px",
          },
          "& .MuiIconButton-root": {
            "& .MuiTypography-root": {
              fontSize: "2rem",
            },
            width: "40px",
            height: "40px",
          },
          "& .MuiPickersArrowSwitcher-spacer": {
            width: "5px",
          },
          "& .MuiSvgIcon-root": { width: "30px", height: "30px" },
        },
      }}
      InputProps={{
        sx: { "& .MuiSvgIcon-root": { width: "30px", height: "30px" } },
      }}
      renderInput={(params) => <TextField {...params} />}
    />
  </LocalizationProvider>
);

export const SingleVisitTable = (props) => (
  <TableContainer component={Paper}>
    <Table stickyHeader>
      <TableHead>
        <TableRow sx={{ height: "60px" }}>
          <TableCell
            align="center"
            sx={{
              borderTopLeftRadius: "8px",
            }}
          >
            Visit Type
          </TableCell>
          <TableCell align="center">Patient</TableCell>
          <TableCell align="center" sx={{ borderTopRightRadius: "8px" }}>
            Visit Date
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell align="center">{props.visit.protocolName}</TableCell>
          <TableCell align="center">
            {props.visit.participantSecondaryId}
          </TableCell>
          <TableCell align="center">
            {props.visit.visitDate.split(" ")[0]}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);
