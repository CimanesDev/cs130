import { useState } from 'react';
import { colors } from '../styles/colors';

const InputPanel = ({ onMinimize, onClear }) => {
  const [minterms, setMinterms] = useState('');
  const [variables, setVariables] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onMinimize(minterms, variables);
  };

  return (
    <div className="card animate-fade">
      <h2 className="section-title">Input Parameters</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="minterms" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: colors.dark
          }}>
            Minterms (comma separated)
          </label>
          <input
            id="minterms"
            type="text"
            value={minterms}
            onChange={(e) => setMinterms(e.target.value)}
            placeholder="e.g. 0,1,2,5,6,7"
            style={{
              width: '100%',
              padding: '10px',
              border: `1px solid ${colors.muted}`,
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="variables" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: colors.dark
          }}>
            Variables (single letters, max 6)
          </label>
          <input
            id="variables"
            type="text"
            value={variables}
            onChange={(e) => setVariables(e.target.value.toUpperCase())}
            placeholder="e.g. ABCD"
            maxLength="6"
            style={{
              width: '100%',
              padding: '10px',
              border: `1px solid ${colors.muted}`,
              borderRadius: '4px',
              fontSize: '1rem',
              textTransform: 'uppercase'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary">
            Minimize Function
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => {
              setMinterms('');
              setVariables('');
              onClear();
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputPanel;