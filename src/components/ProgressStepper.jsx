import { colors } from '../styles/colors';

const steps = [
  'Input Parameters',
  'Group Minterms',
  'Find Prime Implicants',
  'Essential Prime Implicants',
  'Final Result'
];

const ProgressStepper = ({ currentStep }) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        marginBottom: '1rem'
      }}>
        {/* Line */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: colors.muted,
          zIndex: 1
        }} />
        
        {steps.map((_, index) => {
          const isActive = index <= currentStep;
          return (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 2
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isActive ? colors.primary : colors.muted,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                marginBottom: '8px',
                transition: 'all 0.3s ease'
              }}>
                {index + 1}
              </div>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? colors.primary : colors.muted,
                textAlign: 'center',
                maxWidth: '80px'
              }}>
                {steps[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;