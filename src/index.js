import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store"; // Redux store configured and created in a different file
import App from "./App"; // Top level js file that connects to all react components

// <div id="root"/> container under public/index.html
const container = document.getElementById("root");

// Create a react root to the container.
const root = ReactDOM.createRoot(container);

// Render the application through root.
root.render(
  // Wrap application in Provider so the entire app can have access to Redux store
  <Provider store={store}>
    <App />
  </Provider>
);
