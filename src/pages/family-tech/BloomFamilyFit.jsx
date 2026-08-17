import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import FamilyTechLayout from '../../components/family-tech/FamilyTechLayout';
import ModulePageLayout, { ActivityCard, LabeledValue } from '../../components/family-tech/ModulePageLayout';
import ActivityControls from '../../components/family-tech/ActivityControls';
import WeeklyRecord from '../../components/family-tech/WeeklyRecord';
import { getIntake, getForecast } from '../../services/householdStorage';
import { buildFamilyFitContent } from '../../services/moduleContentEngine';
import { getActivityRecord } from '../../services/activityStorage';
import { BLOOM_MODULES } from '../../data/modules';
import { SETUP_CTA } from '../../services/contentFormat';

export default function BloomFamilyFit() {
  const intake = getIntake();
  const forecast = getForecast();
  const [, tick] = useState(0);
  const refresh = () => tick((n) => n + 1);
  const status = (id) => getActivityRecord('family-fit', id)?.status;

  if (!forecast || !intake?.quickCompletedAt) return <Navigate to="/family-tech/intake" replace />;

  const fit = buildFamilyFitContent(intake);
  const rec = fit.recommendation;
  const isSetup = (v) => v === SETUP_CTA;

  return (
    <FamilyTechLayout>
      <ModulePageLayout title={BLOOM_MODULES['family-fit'].name} moduleId="family-fit">
        <section className="module-section">
          <h2>{fit.adultName}&apos;s wellness focus</h2>
          <div className="module-section__grid">
            <LabeledValue label="Primary goal" value={fit.primaryGoal} isSetupPrompt={isSetup(fit.primaryGoal)} />
            {fit.secondaryGoal && <LabeledValue label="Secondary goal" value={fit.secondaryGoal} />}
            <LabeledValue label="Available time" value={fit.availableTime} isSetupPrompt={isSetup(fit.availableTime)} />
            {fit.scheduleOpportunity && <LabeledValue label="Best window" value={fit.scheduleOpportunity} />}
            {fit.preferredDays?.length > 0 && <LabeledValue label="Preferred days" value={fit.preferredDays.join(', ')} />}
            {fit.availabilityFixed && <LabeledValue label="Schedule type" value="Fixed window" />}
          </div>
        </section>

        {fit.recommendation.fromPreferredLibrary && (
          <p className="info-block" style={{ marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
            From your preferred workout library
            {fit.preferredWorkouts.length > 0 && (
              <> · <Link to="/family-tech/setup">Manage workouts</Link></>
            )}
          </p>
        )}

        <ActivityCard title={rec.title} description={`${rec.description} ${rec.why}`} status={status(rec.id)}>
          <ActivityControls
            moduleId="family-fit"
            activityId={rec.id}
            meta={{ title: rec.title, childName: fit.adultName, category: 'wellness' }}
            onUpdate={refresh}
          />
        </ActivityCard>

        <section className="module-section">
          <h2>Session options</h2>
          <div className="module-section__grid">
            <LabeledValue label="Minimum" value={rec.minimum} isSetupPrompt={isSetup(rec.minimum)} />
            <LabeledValue label="Full session" value={rec.full} isSetupPrompt={isSetup(rec.full)} />
            <LabeledValue label="Low energy" value={rec.lowEnergy} />
          </div>
        </section>

        {fit.equipment.length > 0 && (
          <LabeledValue label="Using equipment" value={fit.equipment.join(', ')} />
        )}

        <ActivityCard title="Hydration and recovery check" description="Full glass of water and 5 minutes of stretching before returning to family responsibilities." status={status('fit-recovery')}>
          <ActivityControls moduleId="family-fit" activityId="fit-recovery" meta={{ title: 'Recovery', category: 'recovery' }} onUpdate={refresh} />
        </ActivityCard>

        <WeeklyRecord moduleId="family-fit" title="Weekly wellness record" />
      </ModulePageLayout>
    </FamilyTechLayout>
  );
}
