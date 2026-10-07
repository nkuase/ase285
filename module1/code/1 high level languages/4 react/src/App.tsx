// Grade Calculator - React Version with TypeScript
// All components in one file for educational simplicity

// `type FormEvent` is imported only as a type: it disappears after compilation
import { useState, useEffect, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';

// ---- Types and constants ----

interface Grade {
  readonly id: number;
  name: string;
  score: number;
  weight: number;
}

interface GradeSummary {
  percentage: number;
  totalWeight: number;
}

type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F';

const MAX_WEIGHT = 100;
// Decimal sums are not exact (0.1 + 0.2 !== 0.3), so we allow a tiny error
const WEIGHT_EPSILON = 1e-9;
const STORAGE_KEY = 'grades';

// ---- Pure functions: no React, no DOM, so they can be tested alone ----

export function getLetterGrade(percentage: number): LetterGrade {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

// Returns null when there is nothing to calculate (no grades, or total weight is 0)
export function calculateFinalGrade(grades: Grade[]): GradeSummary | null {
  const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
  if (totalWeight === 0) return null;

  const weightedSum = grades.reduce((sum, g) => sum + g.score * g.weight, 0);
  return { percentage: weightedSum / totalWeight, totalWeight };
}

// ---- localStorage helpers ----

// Types disappear at runtime, so data from outside must be checked
function isGrade(value: unknown): value is Grade {
  if (typeof value !== 'object' || value === null) return false;
  const g = value as Record<string, unknown>;
  return (
    typeof g.id === 'number' &&
    typeof g.name === 'string' &&
    typeof g.score === 'number' &&
    typeof g.weight === 'number'
  );
}

function loadGrades(): Grade[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isGrade) : [];
  } catch {
    return []; // broken JSON, or storage is not available
  }
}

function saveGrades(grades: Grade[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grades));
  } catch {
    // storage is full or blocked: the app still works, it just cannot save
  }
}

// ---- Grade Input Component ----

interface GradeInputProps {
  onAdd: (grade: Omit<Grade, 'id'>) => string | null;
}

function GradeInput({ onAdd }: GradeInputProps) {
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // prevent the page reload
    setError('');

    const scoreNum = parseFloat(score);
    const weightNum = parseFloat(weight);

    // Validation
    if (!name.trim()) {
      setError('Please enter an assignment name');
      return;
    }

    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      setError('Score must be between 0 and 100');
      return;
    }

    if (isNaN(weightNum) || weightNum < 0 || weightNum > 100) {
      setError('Weight must be between 0 and 100');
      return;
    }

    // onAdd is given by the parent: it returns an error message, or null on success
    const addError = onAdd({
      name: name.trim(),
      score: scoreNum,
      weight: weightNum
    });
    if (addError) {
      setError(addError);
      return;
    }

    // Clear form
    setName('');
    setScore('');
    setWeight('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="grade-form">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setError('');
            setName(e.target.value);
          }}
          placeholder="Assignment name"
        />
        <input
          type="number"
          value={score}
          onChange={(e) => {
            setError('');
            setScore(e.target.value);
          }}
          placeholder="Score (0-100)"
          min="0"
          max="100"
          step="0.1"
        />
        <input
          type="number"
          value={weight}
          onChange={(e) => {
            setError('');
            setWeight(e.target.value);
          }}
          placeholder="Weight %"
          min="0"
          max="100"
          step="0.1"
        />
        <button type="submit">Add Grade</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

// ---- Grade Item Component ----

interface GradeItemProps {
  grade: Grade;
  onDelete: (id: number) => void;
}

function GradeItem({ grade, onDelete }: GradeItemProps) {
  return (
    <div className="grade-item">
      <div className="grade-info">
        <strong>{grade.name}</strong>
        <span>{grade.score.toFixed(1)}% (Weight: {grade.weight.toFixed(1)}%)</span>
      </div>
      <button
        className="delete-btn"
        onClick={() => onDelete(grade.id)}
      >
        Delete
      </button>
    </div>
  );
}

// ---- Grade List Component ----

interface GradeListProps {
  grades: Grade[];
  onDelete: (id: number) => void;
}

function GradeList({ grades, onDelete }: GradeListProps) {
  if (grades.length === 0) {
    return <p className="empty">No grades yet. Add one above!</p>;
  }

  return (
    <div className="grade-list">
      {grades.map(grade => (
        <GradeItem
          key={grade.id}
          grade={grade}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

// ---- Grade Result Component ----

interface GradeResultProps {
  grades: Grade[];
}

function GradeResult({ grades }: GradeResultProps) {
  const summary = calculateFinalGrade(grades); // pure function

  if (!summary) {
    return <div className="result">Add grades to see your final grade</div>;
  }

  const letterGrade = getLetterGrade(summary.percentage);

  return (
    <div className="result">
      <h2>Final Grade: {summary.percentage.toFixed(2)}%</h2>
      <div className={`letter-grade grade-${letterGrade}`}>
        {letterGrade}
      </div>
      <small>
        Total weight: {summary.totalWeight.toFixed(1)}%
        {summary.totalWeight < MAX_WEIGHT - WEIGHT_EPSILON && (
          <span>
            <br />Note: Only {summary.totalWeight.toFixed(1)}% of grades entered
          </span>
        )}
      </small>
    </div>
  );
}

// ---- Main App Component ----

function GradeCalculatorApp() {
  // The function runs only once, when the state is first created
  const [grades, setGrades] = useState<Grade[]>(loadGrades);

  // Save to localStorage whenever grades change
  useEffect(() => {
    saveGrades(grades);
  }, [grades]);

  const addGrade = (gradeData: Omit<Grade, 'id'>): string | null => {
    // Check total weight
    const currentTotalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
    if (currentTotalWeight + gradeData.weight > MAX_WEIGHT + WEIGHT_EPSILON) {
      return `Total weight would exceed 100% (current: ${currentTotalWeight}%).`;
    }

    // Next id = largest id + 1, so ids stay unique even after a reload
    setGrades((previous) => {
      const nextId = Math.max(0, ...previous.map((g) => g.id)) + 1;
      return [...previous, { ...gradeData, id: nextId }];
    });
    return null;
  };

  const deleteGrade = (id: number) => {
    setGrades((previous) => previous.filter((grade) => grade.id !== id));
  };

  return (
    <div className="app">
      <h1>Grade Calculator (React Edition)</h1>
      <GradeInput onAdd={addGrade} />
      <GradeList grades={grades} onDelete={deleteGrade} />
      <GradeResult grades={grades} />
    </div>
  );
}

// Mount function to render the app (exported as AppModule.mount in the bundle)
export function mount(elementId: string): void {
  const container = document.getElementById(elementId);
  if (!container) {
    throw new Error(`#${elementId} was not found`);
  }
  createRoot(container).render(<GradeCalculatorApp />);
}
