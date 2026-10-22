import { useState, useEffect } from 'react';

function App() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operation, setOperation] = useState('+');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [version, setVersion] = useState('');

  // Load history and version on component mount
  useEffect(() => {
    // Check if running in Electron
    if (window.electronAPI) {
      // Get app version
      window.electronAPI.getVersion().then(v => setVersion(v));
      
      // Load calculation history
      window.electronAPI.loadHistory().then(h => {
        if (h && Array.isArray(h)) {
          setHistory(h);
        }
      });
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    if (window.electronAPI && history.length > 0) {
      window.electronAPI.saveHistory(history);
    }
  }, [history]);

  const calculate = () => {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);
    
    if (isNaN(n1) || isNaN(n2)) {
      setResult('Invalid input');
      return;
    }

    let res;
    switch (operation) {
      case '+':
        res = n1 + n2;
        break;
      case '-':
        res = n1 - n2;
        break;
      case '*':
        res = n1 * n2;
        break;
      case '/':
        res = n2 !== 0 ? n1 / n2 : 'Cannot divide by zero';
        break;
      default:
        res = 'Unknown operation';
    }
    
    setResult(res);
    
    // Add to history
    if (typeof res === 'number') {
      const calculation = {
        num1: n1,
        num2: n2,
        operation,
        result: res,
        timestamp: new Date().toLocaleString()
      };
      setHistory([calculation, ...history.slice(0, 9)]); // Keep last 10
    }
  };

  const clearHistory = () => {
    setHistory([]);
    if (window.electronAPI) {
      window.electronAPI.clearHistory();
    }
  };

  return (
    <div className="calculator">
      <h1>Simple Calculator</h1>
      {version && window.electronAPI && (
        <p style={{ fontSize: '12px', color: '#666' }}>
          Desktop Version {version}
        </p>
      )}
      
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

      {/* History section - only show in Electron */}
      {window.electronAPI && history.length > 0 && (
        <div className="history" style={{ marginTop: '20px' }}>
          <h3>History</h3>
          <button onClick={clearHistory} style={{ marginBottom: '10px' }}>
            Clear History
          </button>
          <ul style={{ textAlign: 'left', fontSize: '14px' }}>
            {history.map((item, index) => (
              <li key={index}>
                {item.num1} {item.operation} {item.num2} = {item.result}
                <span style={{ fontSize: '12px', color: '#666' }}>
                  {' '}({item.timestamp})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
