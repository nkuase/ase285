import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

// The store combines ALL slices (features) into one global state
export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});
