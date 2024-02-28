function Hours({flipped, onChange, amount}) {
  return (
    <div>
    <label htmlFor="hours">Hours</label>
    <input 
      value={flipped ? amount: Math.round(amount / 60)}
      id="hours" 
      placeholder="Hours"
      type="number"
      onChange={onChange}
      disabled={flipped === false}
    />          
  </div>
  )
}
export default Hours;