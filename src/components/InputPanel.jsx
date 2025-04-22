import { useState } from 'react';

const InputPanel = ({ onMinimize, onClear }) => {
  const [minterms, setMinterms] = useState('');
  const [variables, setVariables] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!minterms || !variables) return;
    onMinimize(minterms, variables);
  };

  return (
    <div className="card input-panel">
      <h2 className="section-title">Input Parameters</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Minterms (comma separated)</label>
          <input
            type="text"
            value={minterms}
            onChange={(e) => setMinterms(e.target.value)}
            placeholder="e.g. 0,1,2,5,6,7"
          />
        </div>

        <div className="form-group">
          <label>Variables (single letters, max 6)</label>
          <input
            type="text"
            value={variables}
            onChange={(e) => setVariables(e.target.value.toUpperCase())}
            maxLength="6"
            placeholder="e.g. ABCD"
          />
        </div>

        <div className="button-group">
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