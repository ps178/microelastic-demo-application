import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";
import Slider from "@mui/material/Slider";
import {
  selectAllFormData,
  selectFormDataById,
  updateFormData,
} from "../reducerSlices/formDataSlice";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import {
  selectAllProtocolForms,
  selectProtocolFormIds,
} from "../reducerSlices/protocolSlice";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { setPageId } from "../reducerSlices/utilitySlice";
import pageIds from "../constants/pageMap";
import { Icon } from "./sharedComponents";

function FormsPage() {
  // Redux State
  const dispatch = useDispatch();
  const allFromIds = useSelector(selectProtocolFormIds);
  const formsById = useSelector(selectAllProtocolForms);
  const formDataById = useSelector(selectAllFormData);
  const completedFormCount = useSelector((state) => {
    let forms = selectAllFormData(state);
    return Object.keys(forms).filter((formId) => forms[formId].completed)
      .length;
  });
  // Local State
  const [selectedFormId, setSelectedFormId] = React.useState(allFromIds[0]);
  const [formDataChanged, setFormDataChanged] = React.useState(false);
  const [localFormData, setLocalFormData] = React.useState(
    formDataById[allFromIds[0]].data
  );

  const handleSelectForm = (formId) => {
    setSelectedFormId(formId);
    setFormDataChanged(false);
    setLocalFormData(formDataById[formId].data);
  };

  const handleSubmit = () => {
    let completed = Object.keys(formsById[selectedFormId].form)
      .filter(
        (formItemId) =>
          formsById[selectedFormId].form[formItemId]["Required Field?"] === "y"
      )
      .every(
        (formItemId) =>
          localFormData[
            formsById[selectedFormId].form[formItemId]["Variable / Field Name"]
          ] !== null &&
          localFormData[
            formsById[selectedFormId].form[formItemId]["Variable / Field Name"]
          ] !== "" &&
          localFormData[
            formsById[selectedFormId].form[formItemId]["Variable / Field Name"]
          ] !== []
      );
    dispatch(
      updateFormData({
        completed,
        formId: selectedFormId,
        formData: localFormData,
      })
    );
    setFormDataChanged(false);
  };
  const formItemSectionHeader = (headerSection) => {
    if (headerSection !== null && headerSection !== "") {
      return (
        <div>
          <Divider key={`divider_${headerSection}`} variant="menu" />
          <p key={`subtitle_${headerSection}`} class="subheader">
            {headerSection}
          </p>
        </div>
      );
    }
  };

  const formItemInterface = (formItem) => {
    switch (formItem["Field Type"]) {
      case "radio":
        return (
          <FormControl>
            <FormLabel>
              {formItem["Field Label"]}
              {formItem["Required Field?"] === "y" && "*"}
            </FormLabel>
            <FormHelperText>{formItem["Field Note"]}</FormHelperText>
            <RadioGroup
              value={localFormData[formItem["Variable / Field Name"]]}
              sx={{ paddingLeft: "3rem" }}
              onChange={(event) => {
                setFormDataChanged(true);
                setLocalFormData({
                  ...localFormData,
                  [formItem["Variable / Field Name"]]: event.target.value,
                });
              }}
            >
              {formItem["Choices, Calculations, OR Slider Labels"]
                .split("|")
                .map((option) => (
                  <FormControlLabel
                    value={option}
                    key={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
            </RadioGroup>
          </FormControl>
        );
      case "dropdown":
        return (
          <FormControl>
            <InputLabel>
              {formItem["Field Label"]}
              {formItem["Required Field?"] === "y" && "*"}
            </InputLabel>
            <Select
              value={localFormData[formItem["Variable / Field Name"]]}
              onChange={(event) => {
                setFormDataChanged(true);
                setLocalFormData({
                  ...localFormData,
                  [formItem["Variable / Field Name"]]: event.target.value,
                });
              }}
              label={formItem["Field Label"]}
            >
              {formItem["Choices, Calculations, OR Slider Labels"]
                .split("|")
                .map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>{formItem["Field Note"]}</FormHelperText>
          </FormControl>
        );

      case "checkboxes":
        return (
          <FormControl>
            <InputLabel>
              {formItem["Field Label"]}
              {formItem["Required Field?"] === "y" && "*"}
            </InputLabel>
            <Select
              multiple
              label={formItem["Field Label"]}
              value={localFormData[formItem["Variable / Field Name"]]}
              onChange={(event) => {
                setFormDataChanged(true);
                setLocalFormData({
                  ...localFormData,
                  [formItem["Variable / Field Name"]]: event.target.value,
                });
              }}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={{ variant: "long" }}
            >
              {formItem["Choices, Calculations, OR Slider Labels"]
                .split("|")
                .map((option) => (
                  <MenuItem variant="withCheckbox" key={option} value={option}>
                    <Checkbox
                      size="large"
                      checked={
                        localFormData[formItem["Variable / Field Name"]] &&
                        localFormData[
                          formItem["Variable / Field Name"]
                        ].includes(option)
                      }
                    />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>{formItem["Field Note"]}</FormHelperText>
          </FormControl>
        );
      case "slider":
        const marks = formItem["Choices, Calculations, OR Slider Labels"]
          .split("|")
          .map((markValue) => ({
            value: parseInt(markValue, 10),
            label: `${parseInt(markValue, 10)} ${formItem["Field Note"]}`,
          }));
        const values = formItem["Choices, Calculations, OR Slider Labels"]
          .split("|")
          .map((markValue) => parseInt(markValue, 10));

        return (
          <div
            key={`container_${formItem["Variable / Field Name"]}`}
            class="formItem-sliderContainer"
          >
            <span>
              <p
                key={`label_${formItem["Variable / Field Name"]}`}
                class="textOverflow"
              >
                {formItem["Field Label"]}
                {formItem["Required Field?"] === "y" && "*"}
              </p>
              <FormHelperText>{formItem["Field Note"]}</FormHelperText>
            </span>
            <Slider
              color="primary"
              labelColor="primary"
              key={`slider_${formItem["Variable / Field Name"]}`}
              value={localFormData[formItem["Variable / Field Name"]]}
              onChange={(event) => {
                setFormDataChanged(true);
                setLocalFormData({
                  ...localFormData,
                  [formItem["Variable / Field Name"]]: event.target.value,
                });
              }}
              min={values[0]}
              max={values.slice(-1)[0]}
              valueLabelDisplay="on"
              marks={marks}
            />
          </div>
        );

      case "yesno":
        return (
          <FormControl>
            <FormLabel>
              {formItem["Field Label"]}
              {formItem["Required Field?"] === "y" && "*"}
            </FormLabel>
            <FormHelperText>{formItem["Field Note"]}</FormHelperText>
            <RadioGroup
              sx={{ paddingLeft: "3rem" }}
              value={localFormData[formItem["Variable / Field Name"]]}
              onChange={(event) => {
                setFormDataChanged(true);
                setLocalFormData({
                  ...localFormData,
                  [formItem["Variable / Field Name"]]: event.target.value,
                });
              }}
            >
              <FormControlLabel value={1} control={<Radio />} label={"Yes"} />
              <FormControlLabel value={0} control={<Radio />} label={"No"} />
            </RadioGroup>
          </FormControl>
        );
      case "truefalse":
        return (
          <FormControl>
            <FormLabel>
              {formItem["Field Label"]}
              {formItem["Required Field?"] === "y" && "*"}
            </FormLabel>
            <FormHelperText>{formItem["Field Note"]}</FormHelperText>
            <RadioGroup
              value={localFormData[formItem["Variable / Field Name"]]}
              sx={{ paddingLeft: "3rem" }}
              onChange={(event) => {
                setFormDataChanged(true);
                setLocalFormData({
                  ...localFormData,
                  [formItem["Variable / Field Name"]]: event.target.value,
                });
              }}
            >
              <FormControlLabel value={1} control={<Radio />} label={"True"} />
              <FormControlLabel value={0} control={<Radio />} label={"False"} />
            </RadioGroup>
          </FormControl>
        );
      case "notes":
      case "descriptive":
        return (
          <TextField
            label={`${formItem["Field Label"]}
              ${formItem["Required Field?"] === "y" ? "*" : ""}`}
            multiline
            rows={3}
            helperText={formItem["Field Note"]}
            value={localFormData[formItem["Variable / Field Name"]]}
            onChange={(event) => {
              setFormDataChanged(true);
              setLocalFormData({
                ...localFormData,
                [formItem["Variable / Field Name"]]: event.target.value,
              });
            }}
          />
        );
      case "text":
      default:
        return (
          <TextField
            value={localFormData[formItem["Variable / Field Name"]]}
            onChange={(event) => {
              setFormDataChanged(true);
              setLocalFormData({
                ...localFormData,
                [formItem["Variable / Field Name"]]: event.target.value,
              });
            }}
            helperText={formItem["Field Note"]}
            label={
              formItem["Field Label"] +
              (formItem["Required Field?"] === "y" && "*")
            }
            variant="standard"
          />
        );
    }
  };
  return (
    <div class="app-body formsPage">
      <div class="card shadow--dark">
        <h2 class="card-title">
          {completedFormCount}/{allFromIds.length} Forms Completed
        </h2>
        <div class="card-content card-content--denseSpacing">
          {Object.keys(formDataById).map((formId) => (
            <div
              key={formId}
              class={`formsPage-formList-item textOverflow ${
                formId === selectedFormId
                  ? "formsPage-formList-item--selected"
                  : ""
              }`}
              onClick={() => handleSelectForm(formId)}
            >
              <Icon
                class={`icon--smallMedium ${
                  formDataById[formId].completed
                    ? "icon--primary"
                    : "icon--white"
                }`}
                id={formDataById[formId].completed ? "complete" : "incomplete"}
              />
              <p>{formsById[formId].name}</p>
            </div>
          ))}
        </div>

        {/* <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => dispatch(setPageId(pageIds.overviewPage))}
        >
          Done
        </Button> */}
      </div>
      <div class="card shadow--dark">
        <h2 class="card-title">{formsById[selectedFormId].name}</h2>
        <div class="card-content card-content--denseSpacing">
          {Object.entries(formsById[selectedFormId].form).map((formItem) => {
            return (
              <React.Fragment>
                {formItemSectionHeader(formItem[1]["Section Header"])}
                {formItemInterface(formItem[1])}
              </React.Fragment>
            );
          })}
        </div>
        <div class="card-action">
          <Button
            variant="outlined"
            color="primary"
            className="button-cancel"
            onClick={() => handleSelectForm(selectedFormId)}
            disabled={!formDataChanged}
          >
            Undo
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleSubmit()}
            disabled={!formDataChanged}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FormsPage;
