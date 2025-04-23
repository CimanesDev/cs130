import { useState } from 'react';

const InputPanel = ({ onMinimize, onClear }) => {
  const [minterms, setMinterms] = useState('');
  const [variables, setVariables] = useState('');
  const [errors, setErrors] = useState({
    minterms: '',
    variables: ''
  });

  const validateInputs = () => {
    const newErrors = { minterms: '', variables: '' };
    let isValid = true;

    if (!/^[0-9,\s]*$/.test(minterms)) {
      newErrors.minterms = 'Error: Only numbers and commas are allowed in minterms';
      isValid = false;
    }

    if (!/^[a-zA-Z]*$/.test(variables)) {
      newErrors.variables = 'Error: Only letters are allowed for variables';
      isValid = false;
    }

    const uniqueChars = new Set(variables.toUpperCase());
    if (uniqueChars.size !== variables.length) {
      newErrors.variables = 'Error: Duplicate variables are not allowed';
      isValid = false;
    }

    if (variables && minterms) {
      const mintermArray = minterms.split(',').map(m => m.trim()).filter(m => m !== '');
      const maxValue = Math.pow(2, variables.length) - 1;
      
      const tooLargeMinterm = mintermArray.find(m => parseInt(m) > maxValue);
      if (tooLargeMinterm) {
        newErrors.minterms = `Error: Minterm ${tooLargeMinterm} exceeds maximum value (${maxValue}) for ${variables.length} variables`;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!minterms || !variables) {
      setErrors({
        minterms: minterms ? '' : 'Error: Minterms are required',
        variables: variables ? '' : 'Error: Variables are required'
      });
      return;
    }
    
    if (validateInputs()) {
      onMinimize(minterms, variables.toUpperCase());
    }
  };

  return (
    <div className="card">
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
          {errors.minterms && <div className="error-message">{errors.minterms}</div>}
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
          {errors.variables && <div className="error-message">{errors.variables}</div>}
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
              setErrors({ minterms: '', variables: '' });
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