import React from 'react';
import Buttons from './Buttons'
import Hours from './Hours';
import Minutes from './Minutes';

function Min2Hour() {
    const [amount, setAmount] = React.useState(0);
    const [flipped, setFlipped] = React.useState(false);
    const onChange = (event) => setAmount(event.target.value);
    const onReset = () => setAmount(0);
    const onFlip = () => {
      onReset();
      setFlipped((flipped) => !flipped);
    } 
    return (
      <div>
        <h3>Minutes to Hours</h3>
        <Hours flipped={flipped} onChange={onChange} amount={amount} />
        <h4>You want to convert from {amount} minutes to:</h4>
        <Minutes flipped={flipped} onChange={onChange} amount={amount} />
        <Buttons onReset={onReset} onFlip={onFlip} />
      </div>
    )
}
export default Min2Hour;