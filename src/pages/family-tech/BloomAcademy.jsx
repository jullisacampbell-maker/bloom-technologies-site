import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import FamilyTechLayout from '../../components/family-tech/FamilyTechLayout';
import ModulePageLayout, { ActivityCard, ProfileCard } from '../../components/family-tech/ModulePageLayout';
import ActivityControls from '../../components/family-tech/ActivityControls';
import WeeklyRecord from '../../components/family-tech/WeeklyRecord';
import ResourceConfigureModal from '../../components/family-tech/ResourceConfigureModal';
import { getForecast, getIntake, saveIntake, saveForecast } from '../../services/householdStorage';
import { buildLearningContent } from '../../services/learningEngine';
import { getActivityRecord } from '../../services/activityStorage';
import { addVaultResourceToStack } from '../../services/resourceVaultService';
import { getVaultResource } from '../../data/resourceVault';
import { regenerateForecast } from '../../services/forecastEngine';
import { BLOOM_MODULES } from '../../data/modules';
import { SETUP_CTA } from '../../services/contentFormat';

export default function BloomAcademy() {
  const [intake, setIntake] = useState(() => getIntake());
  const forecast = getForecast();
  const [, tick] = useState(0);
  const [vaultConfigureId, setVaultConfigureId] = useState(null);
  const refresh = () => tick((n) => n + 1);

  if (!forecast || !intake?.quickCompletedAt) return <Navigate to="/family-tech/intake" replace />;

  const content = buildLearningContent(intake);
  const mod = BLOOM_MODULES.academy;
  const status = (id) => getActivityRecord('academy', id)?.status;
  const vaultItem = vaultConfigureId ? getVaultResource(vaultConfigureId) : null;

  const handleVaultAdd = (config) => {
    if (!vaultItem) return;
    const result = addVaultResourceToStack(intake, vaultItem, config);
    if (result.added) {
      setIntake(result.intake);
      saveIntake(result.intake);
      saveForecast(regenerateForecast(result.intake));
      refresh();
    }
    setVaultConfigureId(null);
  };

  return (
    <FamilyTechLayout>
      <ModulePageLayout title={mod.name} moduleId="academy">
        <p className="info-block" style={{ marginBottom: 'var(--space-lg)' }}>
          <Link to="/family-tech/resources">Free Resource Vault</Link>
          {' · '}
          <Link to="/family-tech/setup">Configure resources in Family Setup</Link>
        </p>

        <section className="module-section">
          <h2>Child learning profiles</h2>
          {content.profiles.length ? content.profiles.map((p) => (
            <ProfileCard
              key={p.id}
              name={p.name}
              details={[
                { label: 'Level', value: p.level, isSetupPrompt: p.levelMissing },
                { label: 'Learning model', value: p.learningModel || SETUP_CTA, isSetupPrompt: !p.learningModel },
                { label: 'Strengths', value: p.strengths.length ? p.strengths.join(', ') : SETUP_CTA, isSetupPrompt: !p.strengths.length },
                { label: 'Support needs', value: p.supportNeeds.length ? p.supportNeeds.join(', ') : 'None noted' },
                { label: 'Independence', value: p.independenceLevel, isSetupPrompt: p.independenceMissing },
                { label: 'Approach', value: p.approach, isSetupPrompt: p.approach === SETUP_CTA },
                {
                  label: 'Resources',
                  value: p.resources.length
                    ? p.resources.map((r) => `${r.name} (${r.usageLabel || r.usageMode || 'teacher-led'})`).join('; ')
                    : SETUP_CTA,
                  isSetupPrompt: !p.resources.length,
                },
              ]}
            />
          )) : <p className="info-block">Add children in your profile to see learning profiles.</p>}
        </section>

        {content.plan.blocks.length > 0 && (
          <section className="module-section">
            <h2>Coordinated learning plan</h2>
            <p className="info-block" style={{ marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
              Block order and resource usage modes are configured in Family Setup.
            </p>
            <div className="coord-table-wrap">
              <table className="coord-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>{content.plan.teacherName || 'Teacher'}</th>
                    {content.profiles.map((p) => <th key={p.id}>{p.name}</th>)}
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {content.plan.blocks.map((block, i) => (
                    <tr key={i}>
                      <td>{block.time}</td>
                      <td>{block.teacher}</td>
                      {content.profiles.map((p) => {
                        const a = block.assignments.find((x) => x.childId === p.id);
                        return <td key={p.id}>{a?.activity || '—'}</td>;
                      })}
                      <td><span className={`coord-type coord-type--${block.type}`}>{block.type}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="module-section">
          <h2>Today&apos;s learning</h2>
          {content.todayActivities.length ? content.todayActivities.map((act) => (
            <ActivityCard
              key={act.id}
              title={`${act.childName}: ${act.activity}`}
              description={`${act.time} · ${act.activityType || act.blockType}${act.teacher ? ` · ${act.teacher}` : ''}`}
              status={status(act.id)}
            >
              <ActivityControls
                moduleId="academy"
                activityId={act.id}
                meta={{ title: act.activity, childName: act.childName, category: act.activityType || act.blockType, blockType: act.activityType }}
                onUpdate={refresh}
              />
            </ActivityCard>
          )) : <p className="info-block">{content.plan.message}</p>}
        </section>

        <section className="module-section">
          <h2>My Stack</h2>
          {content.resources.length > 0 ? (
            <div className="module-section__grid">
              {content.resources.map((r) => (
                <div key={r.id || r.name} className="info-block">
                  <strong>{r.name}</strong>
                  <div>{r.subject} · {r.usageLabel || r.usageMode}</div>
                  <div>{r.assignmentLabel}{r.duration ? ` · ${r.duration}` : ''}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="info-block">
              No resources in My Stack yet. <Link to="/family-tech/resources">Browse the Free Resource Vault</Link> or add resources in Family Setup.
            </p>
          )}
        </section>

        <section className="module-section">
          <h2>Resource gaps</h2>
          {content.gaps.length > 0 ? content.gaps.map((g, i) => (
            <div key={i} className="info-block"><strong>{g.subject}</strong> — {g.suggestion}</div>
          )) : (
            <p className="info-block">{content.gapsMessage}</p>
          )}
          {content.vaultRecommendations?.length > 0 && (
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>Vault suggestions</h3>
              {content.vaultRecommendations.map((rec) => (
                <div key={rec.vaultId} className="info-block" style={{ marginBottom: 'var(--space-md)' }}>
                  <strong>{rec.title}</strong>
                  <p>{rec.why}</p>
                  {rec.childNames?.length > 0 && <p>Supports: {rec.childNames.join(', ')}</p>}
                  <p>Prep: {rec.preparationLevel}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                    <button type="button" className="btn btn--primary btn--small" onClick={() => setVaultConfigureId(rec.vaultId)}>
                      Add to My Stack
                    </button>
                    <a href={rec.officialUrl} target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--small">
                      Visit official resource
                    </a>
                  </div>
                </div>
              ))}
              <Link to="/family-tech/resources">Browse all vault resources →</Link>
            </div>
          )}
        </section>

        <section className="module-section">
          <h2>Bloom Basket suggestions</h2>
          {content.baskets.map((b) => (
            <ActivityCard
              key={b.id}
              title={`${b.childName}: ${b.activity}`}
              description={`${b.purpose} · ${b.materials} · ${b.estimatedTime} · ${b.independent ? 'Independent' : 'Needs check-in'}. ${b.why}`}
              status={status(b.id)}
            >
              <ActivityControls
                moduleId="academy"
                activityId={b.id}
                meta={{ title: b.activity, childName: b.childName, category: 'Bloom Basket', blockType: b.independent ? 'independent' : 'guided' }}
                onUpdate={refresh}
              />
            </ActivityCard>
          ))}
        </section>

        <WeeklyRecord moduleId="academy" title="Weekly learning record" />
      </ModulePageLayout>

      {vaultItem && (
        <ResourceConfigureModal
          vaultResource={vaultItem}
          members={intake.members}
          onSave={handleVaultAdd}
          onClose={() => setVaultConfigureId(null)}
        />
      )}
    </FamilyTechLayout>
  );
}
