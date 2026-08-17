import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import FamilyTechLayout from '../../components/family-tech/FamilyTechLayout';
import ModuleCard, { BloomOSBanner } from '../../components/family-tech/ModuleCard';
import ResetDemoButton from '../../components/family-tech/ResetDemoButton';
import { ModuleIcon } from '../../components/family-tech/BloomIcons';
import { getForecast, getIntake, touchDemoMeta, saveForecast } from '../../services/householdStorage';
import { regenerateForecast } from '../../services/forecastEngine';
import { getSetupProgress } from '../../services/setupProgress';
import { getTodayCommitments, getMemberName, formatTime } from '../../services/householdUtils';
import { filterValidInsights } from '../../services/contentFormat';
import './BloomHome.css';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function BloomHome() {
  const [forecast, setForecast] = useState(() => getForecast());
  const intake = getIntake();

  useEffect(() => { touchDemoMeta(); }, []);

  if (!forecast || !intake?.quickCompletedAt) {
    return <Navigate to="/family-tech/intake" replace />;
  }

  const setup = getSetupProgress(intake);
  const commitments = getTodayCommitments(intake);
  const action = forecast.recommendedAction;
  const [showAllInsights, setShowAllInsights] = useState(false);
  const insight = filterValidInsights(forecast.insights || [])[0];

  const handleRegenerate = () => {
    const next = regenerateForecast(intake);
    saveForecast(next);
    setForecast(next);
  };

  const wakeBlocks = (intake.schedule?.commitments || []).filter((c) =>
    c.category === 'other' && /wake/i.test(c.name)
  );

  return (
    <FamilyTechLayout>
      <div className="bloom-home page-enter">
        <div className="container">
          <header className="bloom-home__header">
            <div>
              <p className="bloom-home__greeting">{getGreeting()}{intake.basics.caregiverName ? `, ${intake.basics.caregiverName}` : ''}</p>
              <h1 className="bloom-home__title">{forecast.householdName}</h1>
              <p className="bloom-home__date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="bloom-home__header-actions">
              <Link to="/family-tech/setup" className="btn btn--secondary btn--small">Family Setup</Link>
              <Link to="/family-tech/intake" className="btn btn--secondary btn--small">Edit profile</Link>
              <button type="button" className="btn btn--secondary btn--small" onClick={handleRegenerate}>Regenerate</button>
              <ResetDemoButton />
            </div>
          </header>

          <Link to="/family-tech/setup" className="bloom-home__setup">
            <span>Setup progress — {setup.percent}%</span>
            <div className="bloom-home__setup-bar">
              <div className="bloom-home__setup-fill" style={{ width: `${setup.percent}%` }} />
            </div>
            {setup.percent < 100 && <span className="bloom-home__setup-cta">Complete setup →</span>}
          </Link>

          <BloomOSBanner bloomOs={forecast.bloomOs} />

          <div className="bloom-home__grid">
            <section className="bloom-home__card bloom-home__card--focus">
              <h2>Your family&apos;s focus today</h2>
              <p className="bloom-home__focus-text">{forecast.todaysFocus}</p>
            </section>
            <section className="bloom-home__card bloom-home__card--action">
              <h2>Recommended next action</h2>
              <p>{action?.text}</p>
              {action?.path && (
                <Link to={action.path} className="bloom-home__action-link">
                  Go to {action.moduleName} →
                </Link>
              )}
            </section>
          </div>

          <section className="bloom-home__card bloom-home__card--rhythm">
            <h2>Today&apos;s family rhythm</h2>
            <div className="bloom-home__rhythm">
              {forecast.weekdayRhythm.slice(0, 8).map((block, i) => (
                <div key={i} className="bloom-home__rhythm-item">
                  <span className="bloom-home__rhythm-time">{block.time}</span>
                  <span>{block.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bloom-home__card">
            <h2>Upcoming fixed commitments</h2>
            {commitments.length > 0 ? (
              <ul className="bloom-home__commitments">
                {commitments.map((c) => (
                  <li key={c.id}>
                    <strong>{formatTime(c.startTime)}</strong> — {c.name}
                    {c.memberIds?.length ? ` (${c.memberIds.map((id) => getMemberName(intake.members, id)).join(', ')})` : ''}
                  </li>
                ))}
              </ul>
            ) : wakeBlocks.length > 0 ? (
              <ul className="bloom-home__commitments">
                {wakeBlocks.map((c) => (
                  <li key={c.id}><strong>{formatTime(c.startTime)}</strong> — {c.name}</li>
                ))}
              </ul>
            ) : (
              <p className="bloom-home__empty">Add schedule anchors in <Link to="/family-tech/setup">Family Setup</Link> for fixed commitments.</p>
            )}
          </section>

          {insight && (
            <section className="bloom-home__insight">
              <span className="bloom-home__insight-label">Bloom Noticed</span>
              <h3>{insight.title}</h3>
              <p>{insight.body}</p>
              {forecast.insights.length > 1 && (
                <button type="button" className="bloom-home__insight-more" onClick={() => setShowAllInsights(!showAllInsights)}>
                  {showAllInsights ? 'Hide' : 'View all'} Forecast insights
                </button>
              )}
              {showAllInsights && filterValidInsights(forecast.insights).slice(1).map((ins, i) => (
                <div key={i} className="bloom-home__insight-extra">
                  <strong>{ins.title}</strong>
                  <p>{ins.body}</p>
                </div>
              ))}
            </section>
          )}

          <section className="bloom-home__quick">
            <h2>Quick actions</h2>
            <div className="bloom-home__quick-grid">
              <Link to="/family-tech/academy" className="bloom-home__quick-btn"><ModuleIcon moduleId="academy" size={20} /> Today&apos;s learning</Link>
              <Link to="/family-tech/resources" className="bloom-home__quick-btn"><ModuleIcon moduleId="academy" size={20} /> Free Resource Vault</Link>
              <Link to="/family-tech/meals" className="bloom-home__quick-btn"><ModuleIcon moduleId="meals" size={20} /> Plan dinner</Link>
              <Link to="/family-tech/athletics" className="bloom-home__quick-btn"><ModuleIcon moduleId="athletics" size={20} /> Movement break</Link>
              <Link to="/family-tech/family-fit" className="bloom-home__quick-btn"><ModuleIcon moduleId="family-fit" size={20} /> Wellness window</Link>
            </div>
          </section>

          <section className="bloom-home__modules">
            <h2>Your modules</h2>
            <div className="bloom-home__modules-grid">
              {forecast.modules.map((mod) => (
                <ModuleCard key={mod.id} module={mod} status={mod.status} reason={mod.reason} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </FamilyTechLayout>
  );
}
