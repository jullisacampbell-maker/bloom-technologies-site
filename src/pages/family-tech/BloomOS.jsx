import { Link, Navigate } from 'react-router-dom';
import FamilyTechLayout from '../../components/family-tech/FamilyTechLayout';
import ModuleCard from '../../components/family-tech/ModuleCard';
import { ModuleIcon } from '../../components/family-tech/BloomIcons';
import { getForecast, getIntake } from '../../services/householdStorage';
import { getSetupProgress } from '../../services/setupProgress';
import { filterValidInsights } from '../../services/contentFormat';
import './BloomOS.css';

export default function BloomOS() {
  const forecast = getForecast();
  const intake = getIntake();

  if (!forecast || !intake?.quickCompletedAt) {
    return <Navigate to="/family-tech/intake" replace />;
  }

  const setup = getSetupProgress(intake);
  const homeGoals = forecast.home?.structuredGoals || [];
  const insights = filterValidInsights(forecast.insights || []);
  const conflicts = (intake.schedule?.commitments?.length || 0) >= 4
    ? 'Several fixed blocks compete for the same windows — review timing in your coordinated rhythm below.'
    : null;

  return (
    <FamilyTechLayout>
      <div className="bloom-os-page container">
        <Link to="/family-tech/home" className="bloom-os-page__back">← Bloom Home</Link>
        <header className="bloom-os-page__header">
          <ModuleIcon moduleId="bloom-os" size={36} />
          <div>
            <span className="bloom-os-page__label">Powered by Bloom OS</span>
            <h1>Your Bloom OS foundation</h1>
            <p>Family intelligence coordinating {forecast.householdName}&apos;s rhythm across modules.</p>
          </div>
        </header>

        <section className="bloom-os-page__section">
          <h2>Family system overview</h2>
          <p>{forecast.familySummary}</p>
        </section>

        <section className="bloom-os-page__section">
          <h2>Today&apos;s coordinated rhythm</h2>
          <div className="bloom-os-page__rhythm">
            {forecast.weekdayRhythm.map((b, i) => (
              <div key={i} className="bloom-os-page__rhythm-row">
                <span>{b.time}</span><span>{b.label}</span>
              </div>
            ))}
          </div>
        </section>

        {conflicts && (
          <section className="bloom-os-page__alert">
            <h3>Capacity concern</h3>
            <p>{conflicts}</p>
          </section>
        )}

        <section className="bloom-os-page__section">
          <h2>Module priorities</h2>
          <div className="bloom-os-page__modules">
            {forecast.modules.map((m) => (
              <ModuleCard key={m.id} module={m} status={m.status} compact linkLabel={`Open ${m.name.replace('Bloom ', '')} →`} />
            ))}
          </div>
        </section>

        <section className="bloom-os-page__section">
          <h2>Responsibilities and goals</h2>
          {homeGoals.length > 0 ? (
            <ul className="bloom-os-page__goals">
              {homeGoals.map((g) => <li key={g}>{g}</li>)}
            </ul>
          ) : (
            <p>Complete home responsibilities in <Link to="/family-tech/setup">Family Setup</Link> for structured household goals.</p>
          )}
          {intake.goals?.mentalLoadPainPoints?.length > 0 && (
            <>
              <h3 style={{ marginTop: '1rem', fontSize: '0.9375rem' }}>Mental-load focus areas</h3>
              <ul className="bloom-os-page__tags">
                {intake.goals.mentalLoadPainPoints.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </>
          )}
        </section>

        <section className="bloom-os-page__section">
          <h2>Bloom Noticed</h2>
          {insights.length > 0 ? insights.map((ins, i) => (
            <div key={i} className="bloom-os-page__insight"><strong>{ins.title}</strong><p>{ins.body}</p></div>
          )) : (
            <p>Complete Family Setup for personalized insights about your household rhythm.</p>
          )}
        </section>

        <section className="bloom-os-page__section">
          <h2>What Bloom recommends next</h2>
          <ol>{forecast.nextSteps.map((s, i) => <li key={i}>{s}</li>)}</ol>
          {forecast.recommendedAction && (
            <Link to={forecast.recommendedAction.path} className="btn btn--primary" style={{ marginTop: '1rem' }}>
              {forecast.recommendedAction.text}
            </Link>
          )}
        </section>

        <section className="bloom-os-page__section">
          <h2>Family Setup — {setup.percent}%</h2>
          <Link to="/family-tech/setup" className="btn btn--secondary">Continue Family Setup</Link>
        </section>
      </div>
    </FamilyTechLayout>
  );
}
