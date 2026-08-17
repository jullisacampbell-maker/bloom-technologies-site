import { Link } from 'react-router-dom';
import { INTAKE_STEPS } from '../../data/intakeOptions';
import './IntakeLayout.css';

export default function IntakeLayout({
  currentStep,
  steps = INTAKE_STEPS,
  children,
  onBack,
  onContinue,
  onSaveExit,
  continueLabel = 'Continue',
  continueDisabled = false,
  showBack = true,
}) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="intake-layout">
      <div className="intake-layout__header">
        <div className="container">
          <Link to="/family-tech" className="intake-layout__brand">
            <span aria-hidden="true">🌿</span> Bloom Family Tech
          </Link>
          <div className="intake-layout__progress-wrap">
            <div className="intake-layout__progress-meta">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{steps[currentStep]?.label}</span>
            </div>
            <div
              className="intake-layout__progress-bar"
              role="progressbar"
              aria-valuenow={currentStep + 1}
              aria-valuemin={1}
              aria-valuemax={steps.length}
              aria-label={`Intake progress: step ${currentStep + 1} of ${steps.length}`}
            >
              <div className="intake-layout__progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="intake-layout__content container container--narrow">
        {children}
      </div>

      <div className="intake-layout__footer">
        <div className="container intake-layout__footer-inner">
          <div className="intake-layout__footer-left">
            {showBack && currentStep > 0 && (
              <button type="button" className="btn btn--secondary" onClick={onBack}>
                Back
              </button>
            )}
            <button type="button" className="btn btn--secondary" onClick={onSaveExit}>
              Save & Exit
            </button>
          </div>
          <button
            type="button"
            className="btn btn--primary"
            onClick={onContinue}
            disabled={continueDisabled}
          >
            {continueLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
