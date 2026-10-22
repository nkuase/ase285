import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./Dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});
