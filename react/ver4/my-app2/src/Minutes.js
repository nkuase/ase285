function Minutes({flipped, onChange, amount}) {
    return (
      <div>
        <label htmlFor="minutes">Minutes</label>
        <input 
          value={flipped ? amount*60 : amount}
          id="minutes" 
          placeholder="Minutes"
          type="number" 
          onChange={onChange}
          disabled={flipped === true}
        />
      </div>
    )
}
export default Minutes;