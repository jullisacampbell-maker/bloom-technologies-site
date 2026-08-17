import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import FamilyTechLayout from '../../components/family-tech/FamilyTechLayout';
import ModulePageLayout, { ActivityCard } from '../../components/family-tech/ModulePageLayout';
import ActivityControls from '../../components/family-tech/ActivityControls';
import WeeklyRecord from '../../components/family-tech/WeeklyRecord';
import { getIntake, getForecast } from '../../services/householdStorage';
import { buildAthleticsContent } from '../../services/athleticsEngine';
import { getActivityRecord } from '../../services/activityStorage';
import { BLOOM_MODULES } from '../../data/modules';

export default function BloomAthletics() {
  const intake = getIntake();
  const forecast = getForecast();
  const [, tick] = useState(0);
  const refresh = () => tick((n) => n + 1);
  const status = (id) => getActivityRecord('athletics', id)?.status;

  if (!forecast || !intake?.quickCompletedAt) return <Navigate to="/family-tech/intake" replace />;

  const { childActivities, family, shortBreak } = buildAthleticsContent(intake);

  return (
    <FamilyTechLayout>
      <ModulePageLayout title={BLOOM_MODULES.athletics.name} moduleId="athletics">
        {childActivities.map((act) => (
          <ActivityCard
            key={act.id}
            title={`${act.childName}: ${act.activity}`}
            description={`${act.purpose} · ${act.duration} · ${act.materials}. Indoor: ${act.indoorAlt}. Outdoor: ${act.outdoorAlt}. ${act.why}`}
            status={status(act.id)}
          >
            <ActivityControls
              moduleId="athletics"
              activityId={act.id}
              meta={{ title: act.activity, childName: act.childName, category: 'movement' }}
              onUpdate={refresh}
            />
          </ActivityCard>
        ))}

        {shortBreak && childActivities.length > 0 && (
          <ActivityCard title="Quick movement break" description={shortBreak.activity} status={status(shortBreak.id)}>
            <ActivityControls moduleId="athletics" activityId={shortBreak.id} meta={{ title: 'Movement break', category: 'break' }} onUpdate={refresh} />
          </ActivityCard>
        )}

        {family && (
          <section className="module-section">
            <h2>Shared family activity</h2>
            <ActivityCard title={family.activity} description={`${family.purpose} · ${family.duration} · ${family.materials}. ${family.why}`} status={status(family.id)}>
              <ActivityControls moduleId="athletics" activityId={family.id} meta={{ title: family.activity, category: 'family' }} onUpdate={refresh} />
            </ActivityCard>
          </section>
        )}

        {childActivities.length === 0 && (
          <p className="info-block">Add children with movement preferences in your profile for personalized activities.</p>
        )}

        <WeeklyRecord moduleId="athletics" title="Weekly movement record" />
      </ModulePageLayout>
    </FamilyTechLayout>
  );
}
