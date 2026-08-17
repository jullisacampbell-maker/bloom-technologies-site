import { Link } from 'react-router-dom';
import { ModuleIcon } from './BloomIcons';
import { SETUP_LINK } from '../../services/contentFormat';
import './ModulePageLayout.css';

export default function ModulePageLayout({ title, moduleId, children, backTo = '/family-tech/home' }) {
  return (
    <div className="module-page page-enter">
      <div className="container">
        <nav className="module-page__nav">
          <Link to={backTo} className="module-page__back">← Bloom Home</Link>
        </nav>
        <header className="module-page__header">
          {moduleId && <span className="module-page__icon"><ModuleIcon moduleId={moduleId} size={32} /></span>}
          <h1 className="module-page__title">{title}</h1>
        </header>
        {children}
      </div>
    </div>
  );
}

export function LabeledValue({ label, value, isSetupPrompt = false }) {
  const showSetup = isSetupPrompt || (typeof value === 'string' && value.includes('Complete this part of your Family Setup'));
  return (
    <div className="labeled-value info-block">
      <span className="labeled-value__label">{label}</span>
      {showSetup ? (
        <Link to={SETUP_LINK} className="labeled-value__setup-link">{value}</Link>
      ) : (
        <span className="labeled-value__value">{value}</span>
      )}
    </div>
  );
}

export function ActivityCard({ title, description, children, status }) {
  return (
    <div className={`activity-card ${status ? `activity-card--${status}` : ''}`}>
      <h3 className="activity-card__title">{title}</h3>
      {description && <p className="activity-card__desc">{description}</p>}
      {children}
    </div>
  );
}

export function ProfileCard({ name, details }) {
  return (
    <div className="profile-card">
      <h4>{name}</h4>
      <ul>
        {details.map((d, i) => (
          <li key={i}>
            <span className="labeled-value__label">{d.label}: </span>
            {d.isSetupPrompt || (typeof d.value === 'string' && d.value.includes('Complete this part of your Family Setup')) ? (
              <Link to={SETUP_LINK}>{d.value}</Link>
            ) : (
              <span>{d.value}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
