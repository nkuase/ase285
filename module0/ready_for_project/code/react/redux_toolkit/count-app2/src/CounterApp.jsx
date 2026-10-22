import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setValue, incrementBy, decrementBy, reset } from "./counterSlice";

export default function CounterApp() {
  const value = useSelector((s) => s.counter.value);
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [direct, setDirect] = useState("");

  const onInc = () => dispatch(incrementBy(Number(step) || 0));
  const onDec = () => dispatch(decrementBy(Number(step) || 0));
  const onSet = () => dispatch(setValue(direct));

  return (
    <div className="card">
      <h2>Counter with User Input</h2>
      <p className="muted">Update Redux state using arguments (payloads).</p>

      <h3>Current Value: {value}</h3>

      <div className="sp" />

      <div className="row">
        <label>Step:</label>
        <input
          type="number"
          value={step}
          onChange={(e) => setStep(e.target.value)}
        />
        <button onClick={onInc}>+ Step</button>
        <button onClick={onDec}>- Step</button>
      </div>

      <div className="sp" />

      <div className="row">
        <label>Set exact value:</label>
        <input
          type="number"
          value={direct}
          onChange={(e) => setDirect(e.target.value)}
          placeholder="e.g., 42"
        />
        <button onClick={onSet}>Set</button>
        <button onClick={() => dispatch(reset())}>Reset</button>
      </div>
    </div>
  );
}
