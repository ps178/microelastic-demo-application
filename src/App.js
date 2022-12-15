import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import theme from "./constants/theme";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import pageIds from "./constants/pageMap";
import LoginPage from "./components/LoginPage";
import UserPage from "./components/UserPage";
import OrganizationPage from "./components/organizationPage/OrganizationPage";
import OverviewPage from "./components/OverviewPage";
import LocationsPage from "./components/locationsPage/LocationsPage";
import SelectedLocationPage from "./components/selectedLocationPage/SelectedLocationPage";
import FormsPage from "./components/FormsPage";
import { StyledEngineProvider } from "@mui/material/styles";
// import { io } from "socket.io-client";
import "./App.css";
import Header from "./components/Header";
import CustomSnackbar from "./components/CustomSnackbar";

function switchViews(pageId) {
  // Main routing of the application. Switch between views
  switch (pageId) {
    case pageIds.loginPage:
      return <LoginPage />;
    case pageIds.userPage:
      return <UserPage />;
    case pageIds.organizationPage:
      return <OrganizationPage />;
    case pageIds.overviewPage:
      return <OverviewPage />;
    case pageIds.locationsPage:
      return <LocationsPage />;
    case pageIds.selectedLocationPage:
      return <SelectedLocationPage />;
    case pageIds.formsPage:
      return <FormsPage />;
    default:
      return <Typography> Page Not Found</Typography>;
  }
}

function App() {
  // Top layer of the React rendering app. The App.js switches between the different "pages"/"views"
  // MUI theme is injected here
  const themeMode = useSelector((state) => state.utility.themeMode);
  const customTheme = createTheme(theme(themeMode));
  const currentViewId = useSelector((state) => state.utility.pageId);
  // const [deviceSocket, setDeviceSocket] = React.useState(null);
  // React.useEffect(() => {
  //   // DEVICE SOCKET
  //   let newSocket = io("http://127.0.0.1:8000/", {
  //     timeout: 140000,
  //   });
  //   setDeviceSocket(newSocket);
  //   newSocket.on("connect", () => {
  //     console.log("Connected to device socket", newSocket.id);
  //   });
  //   newSocket.on("connect_error", () => {
  //     console.log("Connection error with device socket");
  //   });

  //   newSocket.on("disconnect", (reason) => {
  //     console.log("Disconnected from to device socket. Reason:", reason);
  //   });
  // }, []);

  return (
    // Change css injection order to give custom css style precenden over MUI
    <StyledEngineProvider injectFirst>
      {/* Create a custom MUI theme to change the default apperance of ALL MUI components */}
      <ThemeProvider theme={customTheme}>
        <div class="app-grid">
          <Header
          // deviceSocket={deviceSocket}
          />
          {switchViews(currentViewId)}
          <CustomSnackbar />
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
