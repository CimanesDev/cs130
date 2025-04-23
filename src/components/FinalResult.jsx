const FinalResult = ({ posExpression }) => {
  if (!posExpression) return null;

  return (
    <div className="card animate-fade delay-300" style={{
      background: 'linear-gradient(135deg, rgba(58,134,255,0.2) 0%, rgba(38,103,217,0.2) 100%)',
      border: '1px solid rgba(58,134,255,0.3)',
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
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(58,134,255,0.2)',
        wordBreak: 'break-word',
        backdropFilter: 'blur(5px)'
      }}>
        {posExpression}
      </div>
      <p style={{ 
        textAlign: 'center', 
        opacity: 0.8,
        fontSize: '0.9rem'
      }}>
        This is the minimized Product of Sums (POS) expression
      </p>
    </div>
  );
};

export default FinalResult;