import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import FamilyTechLayout from '../../components/family-tech/FamilyTechLayout';
import ModulePageLayout, { ActivityCard } from '../../components/family-tech/ModulePageLayout';
import ActivityControls from '../../components/family-tech/ActivityControls';
import WeeklyRecord from '../../components/family-tech/WeeklyRecord';
import { getIntake, getForecast } from '../../services/householdStorage';
import { buildMealsContent } from '../../services/moduleContentEngine';
import { getActivityRecord } from '../../services/activityStorage';
import { BLOOM_MODULES } from '../../data/modules';
import { SETUP_LINK } from '../../services/contentFormat';

export default function BloomMeals() {
  const intake = getIntake();
  const forecast = getForecast();
  const [, tick] = useState(0);
  const refresh = () => tick((n) => n + 1);
  const status = (id) => getActivityRecord('meals', id)?.status;

  if (!forecast || !intake?.quickCompletedAt) return <Navigate to="/family-tech/intake" replace />;

  const meals = buildMealsContent(intake);
  const main = meals.mainMeal;

  return (
    <FamilyTechLayout>
      <ModulePageLayout title={BLOOM_MODULES.meals.name} moduleId="meals">
        <section className="module-section">
          <h2>Tonight&apos;s family meal</h2>
          <ActivityCard title={main.title} description={`${main.prep} · Budget: ${main.budget}. ${main.leftover}`} status={status(main.id)}>
            <ActivityControls moduleId="meals" activityId={main.id} meta={{ title: main.title, category: 'dinner' }} onUpdate={refresh} />
          </ActivityCard>
        </section>

        {main.childComponents.length > 0 && (
          <section className="module-section">
            <h2>Safe component per child</h2>
            {main.childComponents.map((c) => (
              <div key={c.name} className="info-block">
                {c.hasData ? (
                  <>
                    <strong>{c.name}</strong> — serve {c.safe}
                    {c.avoid && <span> (avoid {c.avoid})</span>}
                  </>
                ) : (
                  <Link to={SETUP_LINK}>{c.safePrompt}</Link>
                )}
              </div>
            ))}
          </section>
        )}

        {main.substitutions.length > 0 && (
          <section className="module-section">
            <h2>Substitutions</h2>
            {main.substitutions.map((s, i) => <div key={i} className="info-block">{s}</div>)}
          </section>
        )}

        <section className="module-section">
          <h2>Preparation timeline</h2>
          {main.timeline.map((t) => (
            <div key={t.time} className="info-block"><strong>{t.time}</strong> {t.step}</div>
          ))}
        </section>

        {meals.groceryGaps.length > 0 && (
          <section className="module-section">
            <h2>{meals.grocerySectionTitle}</h2>
            <ul className="info-block" style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
              {meals.groceryGaps.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          </section>
        )}

        {meals.memberFood.some((m) => m.favorites || m.dinner) && (
          <section className="module-section">
            <h2>Family food preferences</h2>
            {meals.memberFood.filter((m) => m.favorites || m.dinner).map((m) => (
              <div key={m.name} className="info-block">
                <strong>{m.name}</strong>
                {m.favorites && <> Favorites: {m.favorites}. </>}
                {m.dinner && <> Dinners: {m.dinner}. </>}
                {m.allergies && <> Allergies: {m.allergies}. </>}
              </div>
            ))}
          </section>
        )}

        <WeeklyRecord moduleId="meals" title="Weekly meals record" />
      </ModulePageLayout>
    </FamilyTechLayout>
  );
}
