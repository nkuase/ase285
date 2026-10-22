import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./Dashboard/dashboardSlice";

// `dashboard` has the state fields (messages and related IDs)
// that can be used anywhere in the app.
export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});
