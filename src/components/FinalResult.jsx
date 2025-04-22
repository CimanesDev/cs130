import { colors, gradients } from '../styles/colors';

const FinalResult = ({ posExpression }) => {
  if (!posExpression) return null;

  return (
    <div className="card animate-fade delay-300" style={{
      background: gradients.success,
      color: 'white',
      padding: '2rem',
      marginTop: '2rem'
    }}>
      <h2 className="section-title" style={{ color: 'white' }}>
        Final Minimized Expression (POS)
      </h2>
      <div style={{
        fontSize: '1.8rem',
        fontWeight: '600',
        textAlign: 'center',
        margin: '2rem 0',
        padding: '1.5rem',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '8px',
        wordBreak: 'break-word'
      }}>
        {posExpression}
      </div>
      <p style={{ textAlign: 'center', opacity: 0.9 }}>
        This is the minimized Product of Sums (POS) expression
      </p>
    </div>
  );
};

export default FinalResult;