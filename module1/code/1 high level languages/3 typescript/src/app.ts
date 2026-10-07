// Data model: readonly means the id can never change after creation
interface Grade {
  readonly id: number;
  name: string;
  score: number;
  weight: number;
}

// Result of the calculation (no DOM involved)
interface GradeSummary {
  percentage: number;
  totalWeight: number;
}

// Only these five values are allowed
type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F';

const MAX_WEIGHT = 100;
// Decimal sums are not exact in floating point (0.1 + 0.2 !== 0.3),
// so we allow a tiny error when we compare the total weight.
const WEIGHT_EPSILON = 1e-9;

// Record<LetterGrade, string> forces us to define a color for every letter grade
const GRADE_COLORS: Record<LetterGrade, string> = {
  A: '#28a745',
  B: '#20c997',
  C: '#ffc107',
  D: '#fd7e14',
  F: '#dc3545'
};

// ---- Pure functions: they never touch the DOM, so they are easy to test ----

function getLetterGrade(percentage: number): LetterGrade {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

// Returns null when the grade cannot be calculated (total weight is 0)
function calculateFinalGrade(grades: Grade[]): GradeSummary | null {
  const totalWeight = grades.reduce((sum, grade) => sum + grade.weight, 0);
  if (totalWeight === 0) return null;

  const weightedSum = grades.reduce((sum, grade) => sum + grade.score * grade.weight, 0);
  return { percentage: weightedSum / totalWeight, totalWeight };
}

// ---- DOM helper: find an element by id and check its type at runtime ----

function getElement<T extends HTMLElement>(id: string, type: new () => T): T {
  const element = document.getElementById(id);
  if (!(element instanceof type)) {
    throw new Error(`#${id} was not found or is not a ${type.name}`);
  }
  return element;
}

// Grade Calculator - TypeScript version
class GradeCalculator {
  private grades: Grade[] = [];
  private nextId = 1;

  // Find every element once, with its exact type
  private readonly nameInput = getElement('assignment-name', HTMLInputElement);
  private readonly scoreInput = getElement('score', HTMLInputElement);
  private readonly weightInput = getElement('weight', HTMLInputElement);
  private readonly errorDiv = getElement('error-message', HTMLDivElement);
  private readonly gradesList = getElement('grades-list', HTMLDivElement);
  private readonly resultDiv = getElement('result', HTMLDivElement);

  constructor() {
    // Set up event listeners
    getElement('add-grade-btn', HTMLButtonElement)
      .addEventListener('click', () => this.addGrade());

    // Delete buttons are created dynamically, so one listener handles all of them
    this.gradesList.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>('[data-grade-id]');
      if (button) this.deleteGrade(Number(button.dataset.gradeId));
    });

    // Enter key support (TypeScript infers that e is a KeyboardEvent)
    document.querySelectorAll('input').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.addGrade();
      });
    });

    // Initial display
    this.render();
  }

  private addGrade(): void {
    // Get values
    const name = this.nameInput.value.trim();
    const score = parseFloat(this.scoreInput.value);
    const weight = parseFloat(this.weightInput.value);

    // Clear previous error
    this.errorDiv.textContent = '';

    // Validation
    if (!name) {
      this.errorDiv.textContent = 'Please enter an assignment name';
      return;
    }

    if (isNaN(score) || score < 0 || score > 100) {
      this.errorDiv.textContent = 'Score must be between 0 and 100';
      return;
    }

    if (isNaN(weight) || weight < 0 || weight > 100) {
      this.errorDiv.textContent = 'Weight must be between 0 and 100';
      return;
    }

    const currentWeight = this.grades.reduce((sum, grade) => sum + grade.weight, 0);
    if (currentWeight + weight > MAX_WEIGHT + WEIGHT_EPSILON) {
      this.errorDiv.textContent = 'Total weight cannot exceed 100%';
      return;
    }

    // Create grade and add it to the array
    const grade: Grade = { id: this.nextId++, name, score, weight };
    this.grades.push(grade);

    // Clear inputs
    this.nameInput.value = '';
    this.scoreInput.value = '';
    this.weightInput.value = '';
    this.nameInput.focus();

    // Update the whole screen
    this.render();
  }

  private deleteGrade(id: number): void {
    this.grades = this.grades.filter(grade => grade.id !== id);
    this.render();
  }

  // One entry point: every change calls render(), so the screen cannot go stale
  private render(): void {
    this.displayGrades();
    this.displayResult();
  }

  private displayGrades(): void {
    this.gradesList.replaceChildren();
    if (this.grades.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'No grades yet. Add one above!';
      this.gradesList.append(empty);
      return;
    }

    this.grades.forEach((grade) => {
      const item = document.createElement('div');
      item.className = 'grade-item';
      const info = document.createElement('div');
      info.className = 'grade-info';
      info.textContent = `${grade.name}: ${grade.score.toFixed(1)}% (Weight: ${grade.weight.toFixed(1)}%)`;
      const button = document.createElement('button');
      button.className = 'delete';
      button.dataset.gradeId = String(grade.id);
      button.textContent = 'Delete';
      item.append(info, button);
      this.gradesList.append(item);
    });
  }

  private displayResult(): void {
    this.resultDiv.replaceChildren();
    if (this.grades.length === 0) {
      this.resultDiv.textContent = 'Add grades to see your final grade';
      return;
    }

    // The pure function returns null if the summary cannot be calculated,
    // so TypeScript forces us to handle that case.
    const summary = calculateFinalGrade(this.grades);
    if (summary === null) {
      this.resultDiv.textContent = 'Total weight must be greater than 0';
      return;
    }

    const letterGrade = getLetterGrade(summary.percentage);
    const gradeText = document.createElement('div');
    gradeText.style.color = GRADE_COLORS[letterGrade];
    gradeText.textContent = `Final Grade: ${summary.percentage.toFixed(2)}% (${letterGrade})`;
    const weightText = document.createElement('div');
    weightText.textContent = `Total weight: ${summary.totalWeight.toFixed(1)}%`;
    this.resultDiv.append(gradeText, weightText);
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new GradeCalculator();
});
