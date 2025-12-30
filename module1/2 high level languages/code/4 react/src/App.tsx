// Grade Calculator - React Version with TypeScript
// All components in one file for educational simplicity

import React from 'react';
import ReactDOM from 'react-dom/client';

// Type definitions
interface Grade {
  id: number;
  name: string;
  score: number;
  weight: number;
}

type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F';

// Grade Input Component
interface GradeInputProps {
  onAdd: (grade: Omit<Grade, 'id'>) => void;
}

function GradeInput({ onAdd }: GradeInputProps) {
  const [name, setName] = React.useState('');
  const [score, setScore] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Please enter an assignment name');
      return;
    }

    const scoreNum = parseFloat(score);
    const weightNum = parseFloat(weight);

    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      setError('Score must be between 0 and 100');
      return;
    }

    if (isNaN(weightNum) || weightNum < 0 || weightNum > 100) {
      setError('Weight must be between 0 and 100');
      return;
    }

    // Add the grade
    onAdd({
      name: name.trim(),
      score: scoreNum,
      weight: weightNum
    });

    // Clear form
    setName('');
    setScore('');
    setWeight('');
  };

  // Clear error when typing
  React.useEffect(() => {
    setError('');
  }, [name, score, weight]);

  return (
    <div>
      <form onSubmit={handleSubmit} className="grade-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Assignment name"
        />
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="Score (0-100)"
          min="0"
          max="100"
          step="0.1"
        />
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
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

// Grade Item Component
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

// Grade List Component
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

// Grade Result Component
interface GradeResultProps {
  grades: Grade[];
}

function GradeResult({ grades }: GradeResultProps) {
  const calculateResult = () => {
    if (grades.length === 0) return null;

    const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
    if (totalWeight === 0) return null;

    const weightedSum = grades.reduce(
      (sum, g) => sum + (g.score * g.weight),
      0
    );

    const finalGrade = weightedSum / totalWeight;
    const letterGrade = getLetterGrade(finalGrade);

    return { finalGrade, letterGrade, totalWeight };
  };

  const getLetterGrade = (score: number): LetterGrade => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const result = calculateResult();

  if (!result) {
    return <div className="result">Add grades to see your final grade</div>;
  }

  return (
    <div className="result">
      <h2>Final Grade: {result.finalGrade.toFixed(2)}%</h2>
      <div className={`letter-grade grade-${result.letterGrade}`}>
        {result.letterGrade}
      </div>
      <small>
        Total weight: {result.totalWeight.toFixed(1)}%
        {result.totalWeight < 100 && (
          <span>
            <br />Note: Only {result.totalWeight.toFixed(1)}% of grades entered
          </span>
        )}
      </small>
    </div>
  );
}

// Main App Component
function GradeCalculatorApp() {
  // Initialize state from localStorage
  const [grades, setGrades] = React.useState<Grade[]>(() => {
    const saved = localStorage.getItem('grades');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever grades change
  React.useEffect(() => {
    localStorage.setItem('grades', JSON.stringify(grades));
  }, [grades]);

  const addGrade = (gradeData: Omit<Grade, 'id'>) => {
    // Check total weight
    const currentTotalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
    if (currentTotalWeight + gradeData.weight > 100) {
      alert(`Total weight would exceed 100% (current: ${currentTotalWeight}%)`);
      return;
    }

    const newGrade: Grade = {
      ...gradeData,
      id: Date.now()
    };
    setGrades([...grades, newGrade]);
  };

  const deleteGrade = (id: number) => {
    setGrades(grades.filter(g => g.id !== id));
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

// Mount function to render the app
export function mount(elementId: string) {
  const container = document.getElementById(elementId);
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<GradeCalculatorApp />);
  }
}

// Export mount function for IIFE global access
export default { mount };
