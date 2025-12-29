import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    setValue: (state, action) => {
      const n = Number(action.payload);
      if (!Number.isNaN(n)) state.value = n;
    },
    incrementBy: (state, action) => {
      const n = Number(action.payload) || 0;
      state.value += n;
    },
    decrementBy: (state, action) => {
      const n = Number(action.payload) || 0;
      state.value -= n;
    },
    reset: (state) => { state.value = 0; }
  }
});

export const { setValue, incrementBy, decrementBy, reset } = counterSlice.actions;
export default counterSlice.reducer;
