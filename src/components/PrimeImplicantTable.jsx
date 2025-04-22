import { colors } from '../styles/colors';

const PrimeImplicantTable = ({ tableData, minterms }) => {
  if (!tableData || !minterms) return null;

  return (
    <div className="card animate-fade delay-200">
      <h2 className="section-title">Prime Implicant Table</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '1rem'
        }}>
          <thead>
            <tr style={{
              backgroundColor: colors.primary,
              color: 'white'
            }}>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                position: 'sticky',
                left: 0,
                backgroundColor: colors.primary
              }}>Prime Implicant</th>
              {minterms.map(m => (
                <th key={m} style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  minWidth: '50px'
                }}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i} style={{
                borderBottom: `1px solid ${colors.muted}`,
                transition: 'background-color 0.2s',
                ':hover': {
                  backgroundColor: '#f8f9fa'
                }
              }}>
                <td style={{
                  padding: '12px 16px',
                  fontWeight: '500',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: 'white'
                }}>{row.expression}</td>
                {minterms.map(m => (
                  <td key={m} style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    color: row.minterms.includes(m) ? colors.primary : colors.muted
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