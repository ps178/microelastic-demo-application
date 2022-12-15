import React from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { CopyrightText, Icon } from "./sharedComponents";
import { useDispatch } from "react-redux";
import { setPageId, updateSnackbarStatus } from "../reducerSlices/utilitySlice";
import { setUser } from "../reducerSlices/userSlice";
import pageIds from "../constants/pageMap";
// import { useFetchUserLoginMutation } from "../reducerSlices/api";
import { CircularProgress } from "@mui/material";

function LoginPage() {
  const dispatch = useDispatch();
  // const [fetchUserLogin, { isLoading }] = useFetchUserLoginMutation();
  const [loginCredential, setLoginCredential] = React.useState({
    username: "Demo",
    password: "Demo",
    showPassword: false,
    rememberMe: false,
    isLoading: false,
  });

  function submitLogin(username, password, rememberMe) {
    if (username === "Demo" && password === "Demo") {
      setLoginCredential({ ...loginCredential, isLoading: true });
      setTimeout(function () {
        dispatch(
          setUser({
            username,
            password,
            rememberMe,
            rememberMeAllowed: true,
            name: "Demo User",
            organizations: { DEMO_ORG: "Demo Organization" },
          })
        );
        dispatch(setPageId(pageIds.userPage));
      }, 500);
    } else {
      dispatch(
        updateSnackbarStatus({
          type: "error",
          status: true,
          message: "Incorrect username and password",
        })
      );
      setLoginCredential({
        ...loginCredential,
        username: "Demo",
        password: "Demo",
        isLoading: false,
      });
    }
    // fetchUserLogin({
    //   username: username,
    //   password: password,
    // })
    //   .unwrap()
    //   .then((payload) => {
    //     if (payload.rememberMeAllowed && rememberMe) {
    //       localStorage.setItem("username", username);
    //       localStorage.setItem("password", password);
    //     } else {
    //       localStorage.removeItem("username");
    //       localStorage.removeItem("password");
    //     }
    //     dispatch(setUser({ username, password, rememberMe, ...payload }));
    //     dispatch(setPageId(pageIds.userPage));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     dispatch(
    //       updateSnackbarStatus({
    //         type: "error",
    //         status: true,
    //         message: error.data.error,
    //       })
    //     );
    //     setLoginCredential({ ...loginCredential, username: "", password: "" });
    //     localStorage.removeItem("username");
    //     localStorage.removeItem("password");
    //   });
  }

  // React.useEffect(() => {
  //   // Remember Me => Automatically login if the previous user saved their user credentials
  //   let username = localStorage.getItem("username");
  //   let password = localStorage.getItem("password");
  //   if (username && password) {
  //     submitLogin(username, password, true);
  //   }
  // }, []);

  const handleChange = (prop) => (event) => {
    setLoginCredential({ ...loginCredential, [prop]: event.target.value });
  };

  return (
    <div class="app-body">
      <p class="font--small">
        This is a limited demo of MicroElastic's user interface. The demo
        includes device simulation and fixture data.
      </p>
      <div class="card card--single shadow--dark">
        <h2 class="card-title">User Login</h2>

        <div class="card-content card-content--normalSpacing">
          <TextField
            value={loginCredential.username}
            onChange={handleChange("username")}
            label="Username"
            variant="standard"
          />

          <FormControl variant="standard">
            <InputLabel>Password</InputLabel>
            <Input
              type={loginCredential.showPassword ? "text" : "password"}
              value={loginCredential.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setLoginCredential({
                        ...loginCredential,
                        showPassword: !loginCredential.showPassword,
                      })
                    }
                  >
                    {loginCredential.showPassword ? (
                      <Icon class="icon--white icon--small" id="visible" />
                    ) : (
                      <Icon class="icon--white icon--small" id="notVisible" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                variant="left"
                checked={loginCredential.rememberMe}
                onChange={() =>
                  setLoginCredential({
                    ...loginCredential,
                    rememberMe: !loginCredential.rememberMe,
                  })
                }
                size="large"
                color="primary"
              />
            }
            label="Remember Me"
          />
        </div>
        <div class="card-action">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={
              loginCredential.username.length === 0 ||
              loginCredential.password.length === 0 ||
              loginCredential.isLoading
            }
            onClick={() =>
              submitLogin(
                loginCredential.username,
                loginCredential.password,
                loginCredential.rememberMe
              )
            }
          >
            {loginCredential.isLoading && <CircularProgress size={30} />} Login
          </Button>
        </div>
      </div>
      <CopyrightText />
    </div>
  );
}

export default LoginPage;
