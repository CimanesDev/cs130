const PrimeImplicantTable = ({ tableData, minterms }) => {
  if (!tableData || !minterms) return null;

  return (
    <div className="card animate-fade delay-200">
      <h2 className="section-title">Prime Implicant Table</h2>
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
            {tableData.map((row, i) => (
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