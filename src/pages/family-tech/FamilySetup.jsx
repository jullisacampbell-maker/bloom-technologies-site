import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import FamilyTechLayout from '../../components/family-tech/FamilyTechLayout';
import CommitmentEditor from '../../components/family-tech/CommitmentEditor';
import {
  FormField, TextInput, TextArea, ChipGroup, SelectInput,
} from '../../components/family-tech/FormComponents';
import ResourceInventoryEditor from '../../components/family-tech/ResourceInventoryEditor';
import PreferredWorkoutEditor from '../../components/family-tech/PreferredWorkoutEditor';
import {
  SETUP_SECTIONS, strengthOptions, supportNeedOptions, interestOptions,
  movementPreferenceOptions, independenceLevelOptions, gradeLevelOptions,
  wellnessGoalOptions, equipmentOptions, choreOptions, groceryBudgetOptions,
  mealPrepStyleOptions, subjectOptions, dayOptions,
} from '../../data/intakeOptions';
import { getIntake, saveIntake, saveForecast, getForecast } from '../../services/householdStorage';
import { regenerateForecast } from '../../services/forecastEngine';
import { getSetupProgress, markSetupSection } from '../../services/setupProgress';
import { isChildMember } from '../../services/householdUtils';
import './FamilySetup.css';

export default function FamilySetup() {
  const [intake, setIntake] = useState(() => getIntake());
  const [activeSection, setActiveSection] = useState(null);

  if (!intake?.quickCompletedAt && !intake?.completedAt) {
    return <Navigate to="/family-tech/intake" replace />;
  }

  const progress = getSetupProgress(intake);

  const persist = (updated) => {
    setIntake(updated);
    saveIntake(updated);
    saveForecast(regenerateForecast(updated));
  };

  const updateMember = (i, field, value) => {
    const members = [...intake.members];
    members[i] = { ...members[i], [field]: value };
    persist({ ...intake, members });
  };

  const renderSectionForm = (sectionId) => {
    switch (sectionId) {
      case 'child-profiles':
        return intake.members.filter(isChildMember).map((m, i) => {
          const idx = intake.members.indexOf(m);
          return (
            <div key={m.id} className="setup-form-card">
              <h4>{m.name || `Child ${i + 1}`}</h4>
              <FormField label="Strengths"><ChipGroup options={strengthOptions} selected={m.strengths} onChange={(v) => updateMember(idx, 'strengths', v)} /></FormField>
              <FormField label="Support needs"><ChipGroup options={supportNeedOptions} selected={m.supportNeeds} onChange={(v) => updateMember(idx, 'supportNeeds', v)} /></FormField>
              <FormField label="Interests"><ChipGroup options={interestOptions} selected={m.interests} onChange={(v) => updateMember(idx, 'interests', v)} /></FormField>
              <FormField label="Independence level"><SelectInput value={m.independenceLevel} onChange={(v) => updateMember(idx, 'independenceLevel', v)} options={independenceLevelOptions} placeholder="Select" /></FormField>
              <FormField label="Movement preferences"><ChipGroup options={movementPreferenceOptions} selected={m.movementPreferences} onChange={(v) => updateMember(idx, 'movementPreferences', v)} /></FormField>
            </div>
          );
        });
      case 'food':
        return intake.members.map((m, i) => (
          <div key={m.id} className="setup-form-card">
            <h4>{m.name || `Member ${i + 1}`}</h4>
            <FormField label="Favorite / safe foods"><TextInput value={m.favoriteFoods} onChange={(v) => updateMember(i, 'favoriteFoods', v)} placeholder="Foods they reliably eat" /></FormField>
            <FormField label="Foods to avoid"><TextInput value={m.avoidedFoods} onChange={(v) => updateMember(i, 'avoidedFoods', v)} /></FormField>
            <FormField label="Allergies"><TextInput value={m.allergies} onChange={(v) => updateMember(i, 'allergies', v)} /></FormField>
            {isChildMember(m) && (
              <>
                <FormField label="Preferred dinners"><TextInput value={m.dinnerFoods} onChange={(v) => updateMember(i, 'dinnerFoods', v)} /></FormField>
                <FormField label="Preferred snacks"><TextInput value={m.snackFoods} onChange={(v) => updateMember(i, 'snackFoods', v)} /></FormField>
              </>
            )}
          </div>
        ));
      case 'movement':
        return (
          <>
            <FormField label="Available equipment"><ChipGroup options={equipmentOptions} selected={intake.movement.equipment} onChange={(v) => persist({ ...intake, movement: { ...intake.movement, equipment: v } })} /></FormField>
            <FormField label="Duration (minutes)" hint="Structured time — e.g. 20">
              <TextInput
                type="number"
                min="5"
                max="120"
                value={intake.movement.availableMinutes ?? ''}
                onChange={(v) => persist({ ...intake, movement: { ...intake.movement, availableMinutes: v ? parseInt(v, 10) : null } })}
              />
            </FormField>
            <FormField label="Availability notes" hint="Optional — e.g. after kids leave, flexible evenings">
              <TextArea value={intake.movement.availableTimeNotes || intake.movement.availableTime || ''} onChange={(v) => persist({ ...intake, movement: { ...intake.movement, availableTimeNotes: v, availableTime: v } })} rows={2} />
            </FormField>
            <FormField label="Preferred time window">
              <TextInput value={intake.movement.preferredTime || intake.movement.scheduleOpportunity || ''} onChange={(v) => persist({ ...intake, movement: { ...intake.movement, preferredTime: v, scheduleOpportunity: v } })} placeholder="e.g. midday, after school drop-off" />
            </FormField>
            <FormField label="Preferred days">
              <ChipGroup options={dayOptions} selected={intake.movement.preferredDays || []} onChange={(v) => persist({ ...intake, movement: { ...intake.movement, preferredDays: v } })} />
            </FormField>
            <FormField label="Schedule type">
              <SelectInput
                value={intake.movement.availabilityFixed ? 'fixed' : 'flexible'}
                onChange={(v) => persist({ ...intake, movement: { ...intake.movement, availabilityFixed: v === 'fixed' } })}
                options={[{ value: 'flexible', label: 'Flexible' }, { value: 'fixed', label: 'Fixed window' }]}
              />
            </FormField>
            <FormField label="Possible obstacle">
              <TextInput value={intake.movement.possibleObstacle || ''} onChange={(v) => persist({ ...intake, movement: { ...intake.movement, possibleObstacle: v } })} />
            </FormField>
            {intake.members.filter((m) => !isChildMember(m)).map((m, i) => {
              const idx = intake.members.indexOf(m);
              return (
                <div key={m.id} className="setup-form-card">
                  <h4>{m.name} — wellness goals</h4>
                  <ChipGroup options={wellnessGoalOptions} selected={m.wellnessGoals} onChange={(v) => updateMember(idx, 'wellnessGoals', v)} />
                </div>
              );
            })}
          </>
        );
      case 'responsibilities':
        return (
          <>
            <FormField label="Current chores"><ChipGroup options={choreOptions} selected={intake.home.currentChores} onChange={(v) => persist({ ...intake, home: { ...intake.home, currentChores: v } })} /></FormField>
            <FormField label="Stress tasks"><ChipGroup options={choreOptions} selected={intake.home.stressTasks} onChange={(v) => persist({ ...intake, home: { ...intake.home, stressTasks: v } })} /></FormField>
            <FormField label="Independence goals"><TextArea value={intake.home.independenceAreas} onChange={(v) => persist({ ...intake, home: { ...intake.home, independenceAreas: v } })} /></FormField>
          </>
        );
      case 'curriculum':
        return (
          <>
            <ResourceInventoryEditor intake={intake} onChange={persist} />
            <FormField label="Learning goals"><TextArea value={intake.learning.learningGoals} onChange={(v) => persist({ ...intake, learning: { ...intake.learning, learningGoals: v } })} /></FormField>
            <FormField label="Subjects needing support"><ChipGroup options={subjectOptions} selected={intake.learning.subjectsNeedingSupport} onChange={(v) => persist({ ...intake, learning: { ...intake.learning, subjectsNeedingSupport: v } })} /></FormField>
          </>
        );
      case 'preferred-workouts':
        return <PreferredWorkoutEditor intake={intake} onChange={persist} />;
      case 'schedules':
      case 'commitments':
        return (
          <CommitmentEditor
            commitments={intake.schedule.commitments}
            members={intake.members}
            onChange={(c) => persist({ ...intake, schedule: { ...intake.schedule, commitments: c } })}
          />
        );
      default:
        return null;
    }
  };

  const completeSection = (sectionId) => {
    persist(markSetupSection(intake, sectionId, true));
    setActiveSection(null);
  };

  return (
    <FamilyTechLayout>
      <div className="family-setup container container--narrow">
        <Link to="/family-tech/home" className="family-setup__back">← Bloom Home</Link>
        <h1 className="family-setup__title">Complete Family Setup</h1>
        <p className="family-setup__intro">
          Your Forecast is ready. Complete your Family Setup when you&apos;re ready for deeper daily recommendations.
        </p>
        <div className="family-setup__progress">
          <span>{progress.percent}% complete</span>
          <div className="family-setup__bar"><div style={{ width: `${progress.percent}%` }} /></div>
        </div>
        <ul className="family-setup__list">
          {progress.sections.map((s) => (
            <li key={s.id} className={`family-setup__item ${s.complete ? 'family-setup__item--done' : ''}`}>
              <button type="button" className="family-setup__item-btn" onClick={() => setActiveSection(activeSection === s.id ? null : s.id)}>
                <span className="family-setup__check">{s.complete ? '✓' : '○'}</span>
                <div>
                  <strong>{s.label}</strong>
                  <p>{s.description}</p>
                </div>
              </button>
              {activeSection === s.id && (
                <div className="family-setup__form">
                  {renderSectionForm(s.id)}
                  <button type="button" className="btn btn--primary btn--small" onClick={() => completeSection(s.id)}>Save section</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </FamilyTechLayout>
  );
}
