document.getElementById('calculateBtn').addEventListener('click', calculate)

function calculate() {
  const num1 = parseFloat(document.getElementById('num1').value)
  const num2 = parseFloat(document.getElementById('num2').value)
  const operation = document.getElementById('operation').value
  
  const resultDiv = document.getElementById('resultDiv')
  const resultText = document.getElementById('resultText')
  
  if (isNaN(num1) || isNaN(num2)) {
    resultText.textContent = 'Result: Invalid input'
    resultDiv.style.display = 'block'
    return
  }

  let result
  switch (operation) {
    case '+':
      result = num1 + num2
      break
    case '-':
      result = num1 - num2
      break
    case '*':
      result = num1 * num2
      break
    case '/':
      result = num2 !== 0 ? num1 / num2 : 'Cannot divide by zero'
      break
    default:
      result = 'Unknown operation'
  }
  
  resultText.textContent = `Result: ${result}`
  resultDiv.style.display = 'block'
}
