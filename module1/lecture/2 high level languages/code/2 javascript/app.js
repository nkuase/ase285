// Grade Calculator Application
let grades = [];

// Add a new grade
function addGrade() {
  // Get input values
  const nameInput = document.getElementById('assignment-name');
  const scoreInput = document.getElementById('score');
  const weightInput = document.getElementById('weight');

  const name = nameInput.value.trim();
  const score = parseFloat(scoreInput.value);
  const weight = parseFloat(weightInput.value);

  // Validation
  if (!name || isNaN(score) || isNaN(weight)) {
    alert('Please fill in all fields correctly');
    return;
  }

  // Create grade object
  const grade = {
    id: Date.now(),
    name: name,
    score: score,
    weight: weight
  };

  // Add to array
  grades.push(grade);

  // Clear inputs
  nameInput.value = '';
  scoreInput.value = '';
  weightInput.value = '';

  // Update display
  displayGrades();
  calculateFinalGrade();
}

// Display all grades
function displayGrades() {
  const gradesList = document.getElementById('grades-list');

  gradesList.innerHTML = grades.map(grade => `
        <div class="grade-item">
            <strong>${grade.name}</strong>: 
            ${grade.score}% (Weight: ${grade.weight}%)
            <button onclick="deleteGrade(${grade.id})">Delete</button>
        </div>
    `).join('');
}

// Delete a grade
function deleteGrade(id) {
  grades = grades.filter(grade => grade.id !== id);
  displayGrades();
  calculateFinalGrade();
}

// Calculate final grade
function calculateFinalGrade() {
  const resultDiv = document.getElementById('result');

  if (grades.length === 0) {
    resultDiv.innerHTML = 'No grades yet';
    return;
  }

  // Calculate weighted average
  const totalWeight = grades.reduce((sum, grade) => sum + grade.weight, 0);

  if (totalWeight === 0) {
    resultDiv.innerHTML = 'Total weight must be greater than 0';
    return;
  }

  const weightedSum = grades.reduce((sum, grade) => {
    return sum + (grade.score * grade.weight);
  }, 0);

  const finalGrade = weightedSum / totalWeight;
  const letterGrade = getLetterGrade(finalGrade);

  resultDiv.innerHTML = `
        Final Grade: ${finalGrade.toFixed(2)}% (${letterGrade})
        <br>
        <small>Total weight: ${totalWeight}%</small>
    `;
}

// Convert percentage to letter grade
function getLetterGrade(percentage) {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

// Keyboard support
document.addEventListener('DOMContentLoaded', () => {
  // Add grade when Enter is pressed
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addGrade();
      }
    });
  });
});