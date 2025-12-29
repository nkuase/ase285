import { useState } from 'react'

function App() {
  const [num1, setNum1] = useState('')
  const [num2, setNum2] = useState('')
  const [operation, setOperation] = useState('+')
  const [result, setResult] = useState(null)

  const calculate = () => {
    const n1 = parseFloat(num1)
    const n2 = parseFloat(num2)
    
    if (isNaN(n1) || isNaN(n2)) {
      setResult('Invalid input')
      return
    }

    let res
    switch (operation) {
      case '+':
        res = n1 + n2
        break
      case '-':
        res = n1 - n2
        break
      case '*':
        res = n1 * n2
        break
      case '/':
        res = n2 !== 0 ? n1 / n2 : 'Cannot divide by zero'
        break
      default:
        res = 'Unknown operation'
    }
    setResult(res)
  }

  return (
    <div className="calculator">
      <h1>Simple Calculator</h1>
      
      <div className="input-group">
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="First number"
        />
      </div>

      <div className="input-group">
        <select value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value="+">+ (Add)</option>
          <option value="-">- (Subtract)</option>
          <option value="*">* (Multiply)</option>
          <option value="/">/ (Divide)</option>
        </select>
      </div>

      <div className="input-group">
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          placeholder="Second number"
        />
      </div>

      <button onClick={calculate}>Calculate</button>

      {result !== null && (
        <div className="result">
          <h2>Result: {result}</h2>
        </div>
      )}
    </div>
  )
}

export default App
