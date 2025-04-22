import { useState } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import ResultsDisplay from './components/ResultsDisplay';
import ProgressStepper from './components/ProgressStepper';
import QuineMcCluskeyAlgorithm from './logic/QuineMcCluskeyAlgorithm';
import './styles/global.css';

function App() {
  const [results, setResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleMinimize = (mintermsInput, variablesInput) => {
    setLoading(true);
    setCurrentStep(1);
    
    try {
      // Process minterms
      const minterms = mintermsInput.split(',')
        .map(s => s.trim())
        .filter(s => s !== '')
        .map(num => parseInt(num, 10));

      const variables = variablesInput.toUpperCase();
      
      setTimeout(() => {
        const qm = new QuineMcCluskeyAlgorithm(minterms, variables);
        qm.solve();
        setCurrentStep(4);
        
        setResults({
          variables,
          minterms,
          groupedMinterms: qm.displayGroupedMinterms(),
          combiningTerms: qm.displayCombiningTerms(),
          primeImplicantTable: qm.getPrimeImplicantTableData(),
          essentialPrimeImplicants: qm.displayEssentialPrimeImplicantsTable(),
          posExpression: qm.getPOS()
        });
        
        setLoading(false);
      }, 1000);
      
      // Simulate steps for better UX
      setTimeout(() => setCurrentStep(2), 300);
      setTimeout(() => setCurrentStep(3), 600);
      
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  const handleClear = () => {
    setResults(null);
    setCurrentStep(0);
  };

  return (
    <div className="App">
      <Header />
      
      <div className="container">
        <InputPanel 
          onMinimize={handleMinimize}
          onClear={handleClear}
        />
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '5px solid rgba(67, 97, 238, 0.3)',
              borderRadius: '50%',
              borderTopColor: '#4361ee',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '1rem' }}>Minimizing your function...</p>
          </div>
        )}
        
        {results && !loading && (
          <>
            <ProgressStepper currentStep={currentStep} />
            <ResultsDisplay results={results} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;