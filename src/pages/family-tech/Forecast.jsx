import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import FamilyTechLayout from '../../components/family-tech/FamilyTechLayout';
import ModuleCard, { BloomOSBanner } from '../../components/family-tech/ModuleCard';
import { getForecast, getIntake } from '../../services/householdStorage';
import { filterValidInsights } from '../../services/contentFormat';
import './Forecast.css';

function WhyBlock({ module: mod }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="forecast__why">
      <button type="button" className="forecast__why-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        Why Bloom recommended {mod.name.replace('Bloom ', '')} — {mod.status}
      </button>
      {open && (
        <ul className="forecast__why-list">
          {(mod.reasons?.length ? mod.reasons : [mod.reason]).map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      )}
    </div>
  );
}

export default function Forecast() {
  const forecast = getForecast();
  const intake = getIntake();

  if (!forecast || !intake?.quickCompletedAt) {
    return <Navigate to="/family-tech/intake" replace />;
  }

  const startHere = forecast.startHereModule || forecast.modules.find((m) => m.status === 'Start Here');
  const insights = filterValidInsights(forecast.insights || []);

  return (
    <FamilyTechLayout>
      <div className="forecast page-enter">
        <div className="container container--narrow">
          <header className="forecast__header">
            <span className="badge badge--founder">Your Bloom Forecast</span>
            <h1 className="forecast__title">Welcome, {forecast.householdName}</h1>
            <p className="forecast__intro">
              Bloom configured this forecast from your household&apos;s responses. Each recommendation is explainable — expand any module to see why.
            </p>
          </header>

          <section className="forecast__section">
            <h2>Household summary</h2>
            <p className="forecast__summary">{forecast.familySummary}</p>
          </section>

          <BloomOSBanner bloomOs={forecast.bloomOs} />

          {startHere && (
            <section className="forecast__start-here">
              <span className="forecast__start-label">Start Here</span>
              <h3>{startHere.name}</h3>
              <p>{startHere.reason}</p>
              <p className="forecast__next-action">{startHere.nextAction}</p>
            </section>
          )}

          <section className="forecast__section">
            <h2>Module priorities</h2>
            <div className="forecast__modules">
              {forecast.modules.map((mod) => (
                <div key={mod.id}>
                  <ModuleCard module={mod} status={mod.status} reason={mod.reason} />
                  <WhyBlock module={mod} />
                </div>
              ))}
            </div>
          </section>

          {forecast.teachingArrangement && (
            <section className="forecast__section">
              <h2>Teaching & independence arrangement</h2>
              <div className="forecast__summary">{forecast.teachingArrangement.summary}</div>
              {forecast.teachingArrangement.detail && <p className="forecast__detail">{forecast.teachingArrangement.detail}</p>}
            </section>
          )}

          <section className="forecast__section">
            <h2>Starter weekday rhythm</h2>
            <div className="forecast__rhythm">
              {forecast.weekdayRhythm.map((block, i) => (
                <div key={i} className={`forecast__rhythm-block forecast__rhythm-block--${block.type}`}>
                  <span className="forecast__rhythm-time">{block.time}</span>
                  <span className="forecast__rhythm-label">{block.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="forecast__section">
            <h2>Bloom Noticed</h2>
            <div className="forecast__insights">
              {insights.map((insight, i) => (
                <div key={i} className="forecast__insight">
                  <h4>{insight.title}</h4>
                  <p>{insight.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="forecast__section">
            <h2>What Bloom would do next</h2>
            <ol className="forecast__next-steps">
              {forecast.nextSteps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </section>

          <div className="forecast__actions">
            <Link to="/family-tech/home" className="btn btn--primary">Enter My Bloom Home</Link>
            <Link to="/family-tech/intake" className="btn btn--secondary">Edit responses</Link>
          </div>
          <p className="forecast__setup-note">
            Your Forecast is ready. <Link to="/family-tech/setup">Complete your Family Setup</Link> when you&apos;re ready for deeper daily recommendations.
          </p>
        </div>
      </div>
    </FamilyTechLayout>
  );
}
