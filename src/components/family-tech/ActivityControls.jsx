import { useState } from 'react';
import {
  completeActivity, skipActivity, moveActivity, undoActivity, getActivityRecord,
} from '../../services/activityStorage';
import './ActivityControls.css';

const MOVE_DAYS = ['Tomorrow', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ActivityControls({
  moduleId,
  activityId,
  meta = {},
  onUpdate,
}) {
  const [showMove, setShowMove] = useState(false);
  const [skipReason, setSkipReason] = useState('');
  const [showSkipInput, setShowSkipInput] = useState(false);
  const record = getActivityRecord(moduleId, activityId);
  const status = record?.status;

  const refresh = () => onUpdate?.(getActivityRecord(moduleId, activityId));

  const handleComplete = () => {
    completeActivity(moduleId, activityId, meta);
    refresh();
  };

  const handleSkip = () => {
    if (!showSkipInput) { setShowSkipInput(true); return; }
    skipActivity(moduleId, activityId, skipReason, meta);
    setShowSkipInput(false);
    refresh();
  };

  const handleMove = (day) => {
    moveActivity(moduleId, activityId, day, meta);
    setShowMove(false);
    refresh();
  };

  const handleUndo = () => {
    undoActivity(moduleId, activityId);
    refresh();
  };

  if (status === 'complete') {
    return (
      <div className="activity-controls">
        <span className="activity-controls__status activity-controls__status--done">Completed</span>
        <button type="button" className="activity-controls__btn activity-controls__btn--undo" onClick={handleUndo}>Undo</button>
      </div>
    );
  }

  if (status === 'skip') {
    return (
      <div className="activity-controls">
        <span className="activity-controls__status activity-controls__status--skip">
          Skipped{record.skipReason ? `: ${record.skipReason}` : ''}
        </span>
        <button type="button" className="activity-controls__btn activity-controls__btn--undo" onClick={handleUndo}>Undo</button>
      </div>
    );
  }

  if (status === 'move') {
    return (
      <div className="activity-controls">
        <span className="activity-controls__status activity-controls__status--move">Moved to {record.moveTo}</span>
        <button type="button" className="activity-controls__btn activity-controls__btn--undo" onClick={handleUndo}>Undo</button>
      </div>
    );
  }

  return (
    <div className="activity-controls" role="group" aria-label="Activity actions">
      <button type="button" className="activity-controls__btn activity-controls__btn--complete" onClick={handleComplete}>Complete</button>
      <button type="button" className="activity-controls__btn activity-controls__btn--skip" onClick={handleSkip}>
        {showSkipInput ? 'Confirm skip' : 'Skip'}
      </button>
      <button type="button" className="activity-controls__btn activity-controls__btn--move" onClick={() => setShowMove(!showMove)}>Move</button>
      {showSkipInput && (
        <input
          type="text"
          className="activity-controls__skip-input"
          placeholder="Optional reason"
          value={skipReason}
          onChange={(e) => setSkipReason(e.target.value)}
          aria-label="Skip reason"
        />
      )}
      {showMove && (
        <div className="activity-controls__move-panel" role="listbox" aria-label="Move to">
          {MOVE_DAYS.map((d) => (
            <button key={d} type="button" className="activity-controls__move-option" onClick={() => handleMove(d)}>{d}</button>
          ))}
        </div>
      )}
    </div>
  );
}
