import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, reset } from "./counterSlice";

export default function CounterApp() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "3em" }}>
      <h2>Redux Slice vs Store Demo</h2>
      <p>Count: <strong>{count}</strong></p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>−</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
}
