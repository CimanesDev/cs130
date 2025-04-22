import { useState } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import ResultsDisplay from './components/ResultsDisplay';
import QuineMcCluskeyAlgorithm from './logic/QuineMcCluskeyAlgorithm';
import './styles/global.css';

function App() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMinimize = (mintermsInput, variablesInput) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const minterms = mintermsInput.split(',')
        .map(s => s.trim())
        .filter(s => s !== '')
        .map(num => parseInt(num, 10));

      const variables = variablesInput.toUpperCase();

      const qm = new QuineMcCluskeyAlgorithm(minterms, variables);
      qm.solve();
      
      setResults({
        minterms,
        groupedMinterms: qm.displayGroupedMinterms(),
        combiningTerms: qm.displayCombiningTerms(),
        primeImplicantTable: qm.getPrimeImplicantTableData(),
        essentialPrimeImplicants: qm.displayEssentialPrimeImplicantsTable(),
        posExpression: qm.getPOS()
      });
      
    } catch (err) {
      setError({
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="container">
        <InputPanel 
          onMinimize={handleMinimize}
          onClear={() => {
            setResults(null);
            setError(null);
          }}
        />
        <ResultsDisplay 
          results={results} 
          error={error}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default App;