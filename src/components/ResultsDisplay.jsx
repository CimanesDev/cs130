import { useState, useEffect } from 'react';
import ProgressStepper from './ProgressStepper';
import PrimeImplicantTable from './PrimeImplicantTable';
import FinalResult from './FinalResult';
import StepDisplay from './StepDisplay';
import '../styles/global.css';

const ResultsDisplay = ({ results, error, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { id: 'group-minterms', label: 'Group Minterms' },
    { id: 'prime-implicants', label: 'Prime Implicants' },
    { id: 'implicant-table', label: 'Prime Implicant Table' },
    { id: 'essential-implicants', label: 'Essential Implicants' },
    { id: 'final-result', label: 'Final Result' }
  ];

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setCurrentStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 800);
      return () => clearInterval(timer);
    } else if (results) {
      setCurrentStep(4);
    }
  }, [isLoading, results]);

  const scrollToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
    document.getElementById(steps[stepIndex].id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  if (error) {
    return (
      <div className="card error-message">
        <h3>Error Occurred</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!results && !isLoading) return null;

  return (
    <div className="results-container">
      <ProgressStepper
        steps={steps.map(s => s.label)}
        currentStep={currentStep}
        onStepClick={scrollToStep}
        compact
      />

      <div id={steps[0].id} className="card animate-fade">
        <h2 className="section-title">Step 1: Grouping Minterms</h2>
        {isLoading && currentStep < 1 ? (
          <div className="loading-placeholder">
            <div className="loading-spinner"></div>
            <span>Processing minterms...</span>
          </div>
        ) : (
          <StepDisplay step="group-minterms" data={results?.groupedMinterms} />
        )}
      </div>

      <div id={steps[1].id} className="card animate-fade">
        <h2 className="section-title">Step 2: Finding Prime Implicants</h2>
        {isLoading && currentStep < 2 ? (
          <div className="loading-placeholder">
            <div className="loading-spinner"></div>
            <span>Determining prime implicants...</span>
          </div>
        ) : (
          <StepDisplay step="prime-implicants" data={results?.combiningTerms} />
        )}
      </div>

      <div id={steps[2].id} className="card animate-fade">
        <h2 className="section-title">Step 3: Prime Implicant Table</h2>
        {isLoading && currentStep < 3 ? (
          <div className="loading-placeholder">
            <div className="loading-spinner"></div>
            <span>Building implicant table...</span>
          </div>
        ) : results?.primeImplicantTable ? (
          <PrimeImplicantTable tableData={results.primeImplicantTable} />
        ) : (
          <div className="no-data-message">No prime implicant table generated</div>
        )}
      </div>

      <div id={steps[3].id} className="card animate-fade">
        <h2 className="section-title">Step 4: Essential Prime Implicants</h2>
        {isLoading && currentStep < 4 ? (
          <div className="loading-placeholder">
            <div className="loading-spinner"></div>
            <span>Finding essential prime implicants...</span>
          </div>
        ) : (
          <StepDisplay step="essential-implicants" data={results?.essentialPrimeImplicants} />
        )}
      </div>

      <div id={steps[4].id} className="card animate-fade">
        <h2 className="section-title">Step 5: Final Expression</h2>
        {isLoading ? (
          <div className="loading-placeholder">
            <div className="loading-spinner"></div>
            <span>Generating minimized expression...</span>
          </div>
        ) : results?.posExpression ? (
          <FinalResult posExpression={results.posExpression} />
        ) : (
          <div className="no-data-message">No minimized expression generated</div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;