import React from 'react';

const PrimeImplicantTable = ({ tableData }) => {
  if (!tableData) return null;
  
  const { primeImplicants, minterms } = tableData;
  
  if (!primeImplicants || !minterms || primeImplicants.length === 0) {
    return (
      <div className="card animate-fade delay-200">
        <h2 className="section-title">Prime Implicant Table</h2>
        <p>No prime implicants found</p>
      </div>
    );
  }

  return (
    <div className="card animate-fade delay-200">
      <h2 className="section-title">Prime Implicant Table</h2>
      <div className="mt-2 mb-2">
        <strong>Note:</strong> Displaying complemented minterms (maxterms)
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{
                position: 'sticky',
                left: 0,
                minWidth: '200px'
              }}>Prime Implicant</th>
              {minterms.map(m => (
                <th key={m} style={{
                  textAlign: 'center',
                  minWidth: '60px'
                }}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {primeImplicants.map((row, i) => (
              <tr key={i}>
                <td style={{
                  position: 'sticky',
                  left: 0,
                  background: 'var(--card-bg)',
                  fontWeight: '500'
                }}>{row.expression}</td>
                {minterms.map(m => (
                  <td key={m} style={{
                    textAlign: 'center',
                    color: row.minterms.includes(m) ? 'var(--primary)' : 'var(--text-muted)'
                  }}>
                    {row.minterms.includes(m) ? '✓' : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrimeImplicantTable;