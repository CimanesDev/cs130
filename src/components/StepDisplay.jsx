// src/components/StepDisplay.jsx
import React from 'react';

function StepDisplay({ title, content, isLast = false }) {
  return (
    <div className={`step ${isLast ? 'last-step' : ''}`}>
      <h3>{title}</h3>
      <pre>{content}</pre>
    </div>
  );
}

export default StepDisplay;