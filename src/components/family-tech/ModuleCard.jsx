import { Link } from 'react-router-dom';
import { ModuleIcon } from './BloomIcons';
import './ModuleCard.css';

const STATUS_CLASS = {
  'Start Here': 'start-here',
  Recommended: 'recommended',
  Available: 'available',
};

export default function ModuleCard({ module, status, reason, nextAction, compact = false, linkLabel }) {
  const statusKey = status || module.status;
  const statusClass = STATUS_CLASS[statusKey] || 'available';

  return (
    <Link to={module.path} className={`module-card module-card--${statusClass} ${compact ? 'module-card--compact' : ''}`}>
      <div className="module-card__header">
        <span className="module-card__icon"><ModuleIcon moduleId={module.id} size={28} /></span>
        {statusKey && (
          <span className={`module-card__status module-card__status--${statusClass}`}>{statusKey}</span>
        )}
      </div>
      <h3 className="module-card__name">{module.name}</h3>
      <p className="module-card__tagline">{module.tagline}</p>
      {!compact && (reason || module.reason) && (
        <p className="module-card__reason">{reason || module.reason}</p>
      )}
      <span className="module-card__link">{linkLabel || 'Open module →'}</span>
    </Link>
  );
}

export function BloomOSBanner({ bloomOs }) {
  return (
    <div className="bloom-os-banner">
      <div className="bloom-os-banner__icon"><ModuleIcon moduleId="bloom-os" size={32} /></div>
      <div className="bloom-os-banner__content">
        <span className="bloom-os-banner__label">Powered by Bloom OS</span>
        <p>{bloomOs?.description || 'Your family intelligence layer coordinates modules into one rhythm.'}</p>
      </div>
      <Link to="/family-tech/bloom-os" className="btn btn--secondary btn--small">View your Bloom OS</Link>
    </div>
  );
}
