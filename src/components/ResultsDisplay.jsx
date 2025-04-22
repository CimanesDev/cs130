import { useState, useEffect } from 'react';
import ProgressStepper from './ProgressStepper';
import PrimeImplicantTable from './PrimeImplicantTable';
import FinalResult from './FinalResult';

const ResultsDisplay = ({ results, error, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    'group-minterms',
    'prime-implicants',
    'implicant-table',
    'essential-implicants',
    'final-result'
  ];

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setCurrentStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 500);
      return () => clearInterval(timer);
    } else if (results) {
      setCurrentStep(4);
    }
  }, [isLoading, results]);

  const scrollToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
    document.getElementById(steps[stepIndex])?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const renderStepContent = (content, defaultMessage) => {
    if (isLoading) return <div className="loading-placeholder">Processing step...</div>;
    if (!content) return <div className="no-data-message">{defaultMessage}</div>;
    return <div className="code-block">{content}</div>;
  };

  if (error) {
    return <div className="card error-card">Error: {error.message}</div>;
  }

  if (!results && !isLoading) return null;

  return (
    <div className="results-container">
      <ProgressStepper 
        currentStep={currentStep} 
        onStepClick={scrollToStep} 
        compact 
      />

      <div id="group-minterms" className="card animate-fade">
        <h2 className="section-title">Step 1: Grouping Minterms</h2>
        {renderStepContent(results?.groupedMinterms, "No minterms to group")}
      </div>

      <div id="prime-implicants" className="card animate-fade">
        <h2 className="section-title">Step 2: Finding Prime Implicants</h2>
        {renderStepContent(results?.combiningTerms, "No prime implicants found")}
      </div>

      <div id="implicant-table" className="card animate-fade">
        <h2 className="section-title">Prime Implicant Table</h2>
        {results?.primeImplicantTable?.length > 0 ? (
          <PrimeImplicantTable tableData={results.primeImplicantTable} minterms={results.minterms} />
        ) : (
          <div className="no-data-message">No prime implicant table generated</div>
        )}
      </div>

      <div id="essential-implicants" className="card animate-fade">
        <h2 className="section-title">Step 4: Essential Prime Implicants</h2>
        {renderStepContent(results?.essentialPrimeImplicants, "No essential prime implicants identified")}
      </div>

      <div id="final-result" className="card animate-fade">
        <h2 className="section-title">Final Result</h2>
        {results?.posExpression ? (
          <FinalResult posExpression={results.posExpression} />
        ) : (
          <div className="no-data-message">No minimized expression generated</div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;