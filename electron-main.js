// This file is electron configuration.
const { app, BrowserWindow } = require("electron");
// app - Module to control application life.
// BrowserWindow - Module to create native browser window.
// const axios = require("axios"); // Axios to make calls to the server in case of shutdown
const path = require("path");
const url = require("url");

const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} = require("electron-devtools-installer");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let splashScreen;

function createMainWindow() {
  // Create the main browser window for the application.
  mainWindow = new BrowserWindow({
    show: false,
    frame: true,
    fullscreen: false,
    width: 1280,
    height: 800,
    autoHideMenuBar: false, // hides menu bar
    fullscreenWindowTitle: false,
    webPreferences: {
      nodeIntegration: true,
    },
    title: "MicroElastic App",
    // titleBarStyle: "hidden", // hidden, hiddenInset, default
    icon: "public/favicon.ico",
  });

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.setZoomFactor(1.3);
    if (splashScreen) {
      splashScreen.close();
    }
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // and load the index.html of the app.
  const startUrl =
    "http://localhost:3000" ||
    url.format({
      pathname: path.join(__dirname, "/build/index.html"),
      protocol: "file:",
      slashes: true,
    });
  mainWindow.loadURL(startUrl);

  mainWindow.webContents.once("dom-ready", () => {
    //Open DevTools pane automatically
    mainWindow.webContents.openDevTools();
  });

  // Open the DevTools.
  mainWindow.webContents.on("did-frame-finish-load", () => {
    // We close the DevTools so that it can be reopened and redux reconnected.
    // This is a workaround for a bug in redux devtools.
    mainWindow.webContents.closeDevTools();

    mainWindow.webContents.once("devtools-opened", () => {
      mainWindow.focus();
    });

    mainWindow.webContents.openDevTools();
  });

  // mainWindow.webContents.on("crashed", (e) => {
  //   // Reload the app if renderer has crashed
  //   app.reload();
  // });

  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

function createSplashScreen() {
  splashScreen = new BrowserWindow({
    show: false,
    frame: false,
    fullscreen: true,
    title: "MicroElastic Splash Screen",
    icon: "public/favicon.ico",
  });

  splashScreen.loadURL("file://" + __dirname + "/public/splash-screen.html");
  splashScreen.on("closed", () => (splashScreen = null));
  splashScreen.webContents.on("did-finish-load", () => {
    splashScreen.show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createSplashScreen();
  createMainWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // In case user closes the window unexpectedly, send requests to the server to close the device
  //   axios.get("http://localhost:5000/terminate").then(
  //     (response) => {},
  //     (error) => {}
  //   );

  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Install Redux_Dev_Tools and React_Dev_Tools using electron-devtools-installer.
app.on("ready", () => {
  [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach((extension) => {
    installExtension(extension)
      .then((name) => console.log(`Added Extension: ${name}`))
      .catch((err) => console.log("An error occurred: ", err));
  });
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows expandAcquisitions.
  if (mainWindow === null) {
    createMainWindow();
  }
});
