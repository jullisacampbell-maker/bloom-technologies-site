import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetDemoData } from '../../services/householdStorage';
import './ResetDemoButton.css';

export default function ResetDemoButton({ redirectTo = '/family-tech/intake', className = '' }) {
  const [confirming, setConfirming] = useState(false);
  const navigate = useNavigate();

  const handleReset = () => {
    resetDemoData();
    setConfirming(false);
    navigate(redirectTo);
  };

  if (confirming) {
    return (
      <div className={`reset-demo reset-demo--confirm ${className}`}>
        <p>Reset all demo data? This cannot be undone.</p>
        <div className="reset-demo__actions">
          <button type="button" className="btn btn--secondary btn--small" onClick={() => setConfirming(false)}>
            Cancel
          </button>
          <button type="button" className="btn reset-demo__confirm btn--small" onClick={handleReset}>
            Yes, reset
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`reset-demo__trigger ${className}`}
      onClick={() => setConfirming(true)}
    >
      Reset demo data
    </button>
  );
}
