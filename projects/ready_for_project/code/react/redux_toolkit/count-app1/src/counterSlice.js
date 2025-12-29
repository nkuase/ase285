import { createSlice } from "@reduxjs/toolkit";

// A slice defines ONE feature's logic (state + reducers + actions)
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
    reset: (state) => { state.value = 0; }
  }
});

// Export auto-generated actions
export const { increment, decrement, reset } = counterSlice.actions;

// Export the reducer for store
export default counterSlice.reducer;
