// Grade Calculator Application
const grades = [];
const MAX_WEIGHT = 100;
const WEIGHT_EPSILON = 1e-9;

const nameInput = document.getElementById('assignment-name');
const scoreInput = document.getElementById('score');
const weightInput = document.getElementById('weight');
const addButton = document.getElementById('add-grade-btn');
const errorMessage = document.getElementById('error-message');
const gradesList = document.getElementById('grades-list');
const result = document.getElementById('result');

function getLetterGrade(percentage) {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

// Pure calculation: it can be tested without a browser or DOM.
function calculateFinalGrade(items) {
  const totalWeight = items.reduce((sum, grade) => sum + grade.weight, 0);
  if (totalWeight === 0) return null;

  const weightedSum = items.reduce(
    (sum, grade) => sum + grade.score * grade.weight,
    0
  );
  return { percentage: weightedSum / totalWeight, totalWeight };
}

function showError(message = '') {
  errorMessage.textContent = message;
}

function addGrade() {
  const name = nameInput.value.trim();
  const score = parseFloat(scoreInput.value);
  const weight = parseFloat(weightInput.value);
  const totalWeight = grades.reduce((sum, grade) => sum + grade.weight, 0);

  if (!name || !Number.isFinite(score) || !Number.isFinite(weight)) {
    showError('Enter an assignment name, score, and weight.');
    return;
  }
  if (score < 0 || score > 100 || weight < 0 || weight > 100) {
    showError('Score and weight must be between 0 and 100.');
    return;
  }
  if (totalWeight + weight > MAX_WEIGHT + WEIGHT_EPSILON) {
    showError('Total weight cannot exceed 100%.');
    return;
  }

  grades.push({ id: Date.now(), name, score, weight });
  nameInput.value = '';
  scoreInput.value = '';
  weightInput.value = '';
  showError();
  render();
  nameInput.focus();
}

function deleteGrade(id) {
  const index = grades.findIndex((grade) => grade.id === id);
  if (index !== -1) grades.splice(index, 1);
  render();
}

function render() {
  gradesList.replaceChildren();
  grades.forEach((grade) => {
    const item = document.createElement('div');
    item.className = 'grade-item';
    const label = document.createElement('span');
    label.textContent = `${grade.name}: ${grade.score}% (Weight: ${grade.weight}%)`;
    const button = document.createElement('button');
    button.textContent = 'Delete';
    button.addEventListener('click', () => deleteGrade(grade.id));
    item.append(label, button);
    gradesList.append(item);
  });

  const summary = calculateFinalGrade(grades);
  result.textContent = summary
    ? `Final Grade: ${summary.percentage.toFixed(2)}% (${getLetterGrade(summary.percentage)}) — Total weight: ${summary.totalWeight.toFixed(1)}%`
    : 'Add grades to see your final grade.';
}

addButton.addEventListener('click', addGrade);
[nameInput, scoreInput, weightInput].forEach((input) => {
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addGrade();
  });
});
render();
