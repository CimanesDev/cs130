import { colors } from '../styles/colors';
import StepDisplay from './StepDisplay';
import PrimeImplicantTable from './PrimeImplicantTable';
import FinalResult from './FinalResult';

const ResultsDisplay = ({ results }) => {
  return (
    <>
      <div className="card animate-fade">
        <h2 className="section-title">Step 1: Grouping Minterms</h2>
        <pre style={{
          backgroundColor: '#f8f9fa',
          padding: '16px',
          borderRadius: '8px',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace'
        }}>
          {results.groupedMinterms}
        </pre>
      </div>

      <div className="card animate-fade delay-100">
        <h2 className="section-title">Step 2: Finding Prime Implicants</h2>
        <pre style={{
          backgroundColor: '#f8f9fa',
          padding: '16px',
          borderRadius: '8px',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace'
        }}>
          {results.combiningTerms}
        </pre>
      </div>

      <PrimeImplicantTable 
        tableData={results.primeImplicantTable} 
        minterms={results.minterms} 
      />

      <div className="card animate-fade delay-200">
        <h2 className="section-title">Step 4: Essential Prime Implicants</h2>
        <pre style={{
          backgroundColor: '#f8f9fa',
          padding: '16px',
          borderRadius: '8px',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace'
        }}>
          {results.essentialPrimeImplicants}
        </pre>
      </div>

      <FinalResult posExpression={results.posExpression} />
    </>
  );
};

export default ResultsDisplay;