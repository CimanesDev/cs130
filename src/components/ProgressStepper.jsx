import { colors } from '../styles/colors';

const ProgressStepper = ({ currentStep, onStepClick, compact = true }) => {
  const steps = [
    { title: "Input", subtitle: "" },
    { title: "Group", subtitle: "" },
    { title: "Prime", subtitle: "" },
    { title: "Essential", subtitle: "" },
    { title: "Result", subtitle: "" }
  ];

  return (
    <div className={`progress-stepper ${compact ? 'compact' : ''}`}>
      <div className="progress-track">
        <div 
          className="progress-bar" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${index <= currentStep ? 'active' : ''}`}
            onClick={() => onStepClick(index)}
          >
            <div className="step-marker">{index + 1}</div>
            <div className="step-label">
              <span>{step.title}</span>
              {step.subtitle && <span>{step.subtitle}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressStepper;