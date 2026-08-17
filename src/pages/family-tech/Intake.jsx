import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IntakeLayout from '../../components/family-tech/IntakeLayout';
import CommitmentEditor from '../../components/family-tech/CommitmentEditor';
import {
  FormField, TextInput, TextArea, SelectInput, ChipGroup, CardSelect,
} from '../../components/family-tech/FormComponents';
import {
  createInitialIntake, createEmptyMember, QUICK_INTAKE_STEPS,
  timeZoneOptions, householdTypeOptions, memberRoleOptions, ageRangeOptions,
  schoolWorkModelOptions, learningModelOptions, mealChallengeOptions,
  mentalLoadOptions, bloomHelpOptions, householdFeelingOptions, choreOptions,
} from '../../data/intakeOptions';
import { getIntake, saveIntake, saveForecast } from '../../services/householdStorage';
import { generateForecast } from '../../services/forecastEngine';
import { isChildMember } from '../../services/householdUtils';
import './Intake.css';

function validateStep(step, intake) {
  const errors = {};
  if (step === 0) {
    if (!intake.basics.householdName.trim()) errors.householdName = 'Household name is required';
    if (!intake.basics.caregiverName.trim()) errors.caregiverName = 'Your name is required';
    if (!intake.basics.timeZone) errors.timeZone = 'Time zone is required';
  }
  if (step === 1) {
    if (!intake.members.some((m) => m.name.trim() && m.role)) {
      errors.members = 'Add at least one member with a name and role';
    }
  }
  return errors;
}

export default function Intake() {
  const navigate = useNavigate();
  const [intake, setIntake] = useState(() => getIntake() || createInitialIntake());
  const [step, setStep] = useState(intake.currentStep || 0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    saveIntake({ ...intake, currentStep: step });
  }, [intake, step]);

  const updateBasics = (f, v) => setIntake((p) => ({ ...p, basics: { ...p.basics, [f]: v } }));
  const updateLearning = (f, v) => setIntake((p) => ({ ...p, learning: { ...p.learning, [f]: v } }));
  const updateGoals = (f, v) => setIntake((p) => ({ ...p, goals: { ...p.goals, [f]: v } }));
  const updateMember = (i, f, v) => setIntake((p) => {
    const members = [...p.members];
    members[i] = { ...members[i], [f]: v };
    if (f === 'isPrimaryTeacher' && v) {
      members.forEach((m, j) => { if (j !== i) members[j] = { ...m, isPrimaryTeacher: false }; });
    }
    return { ...p, members };
  });

  const addMember = () => setIntake((p) => ({ ...p, members: [...p.members, createEmptyMember()] }));
  const removeMember = (i) => {
    if (intake.members.length <= 1) return;
    setIntake((p) => ({ ...p, members: p.members.filter((_, j) => j !== i) }));
  };

  const finish = () => {
    const completed = {
      ...intake,
      quickCompletedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      currentStep: 0,
    };
    saveIntake(completed);
    saveForecast(generateForecast(completed));
    navigate('/family-tech/forecast');
  };

  const handleContinue = () => {
    const errs = validateStep(step, intake);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    if (step < QUICK_INTAKE_STEPS.length - 1) { setStep(step + 1); window.scrollTo(0, 0); }
    else finish();
  };

  const renderMemberFields = (member, i) => {
    const isChild = isChildMember(member) || ['child', 'teen'].includes(member.role);
    return (
      <div key={member.id} className="member-card">
        <div className="member-card__header">
          <span className="member-card__title">Member {i + 1}</span>
          {intake.members.length > 1 && (
            <button type="button" className="member-card__remove" onClick={() => removeMember(i)}>Remove</button>
          )}
        </div>
        <div className="form-row">
          <FormField label="Name" id={`name-${i}`}>
            <TextInput id={`name-${i}`} value={member.name} onChange={(v) => updateMember(i, 'name', v)} placeholder="First name or nickname" />
          </FormField>
          <FormField label="Role" id={`role-${i}`}>
            <SelectInput id={`role-${i}`} value={member.role} onChange={(v) => updateMember(i, 'role', v)} options={memberRoleOptions} placeholder="Role" />
          </FormField>
        </div>
        <div className="form-row">
          <FormField label="Age range" id={`age-${i}`}>
            <SelectInput id={`age-${i}`} value={member.ageRange} onChange={(v) => updateMember(i, 'ageRange', v)} options={ageRangeOptions} placeholder="Age" />
          </FormField>
          <FormField label={isChild ? 'Learning model' : 'Work model'} id={`swm-${i}`}>
            <SelectInput id={`swm-${i}`} value={member.schoolWorkModel} onChange={(v) => updateMember(i, 'schoolWorkModel', v)} options={schoolWorkModelOptions} placeholder="Select" />
          </FormField>
        </div>
        {!isChild && ['homeschool', 'hybrid', 'unschooling', 'stay-home'].includes(member.schoolWorkModel) && (
          <label className="toggle" style={{ marginBottom: '1rem' }}>
            <input type="checkbox" checked={member.isPrimaryTeacher} onChange={(e) => updateMember(i, 'isPrimaryTeacher', e.target.checked)} />
            <span className="toggle__track" aria-hidden="true" />
            <span className="toggle__label">Primary homeschool teacher / learning support</span>
          </label>
        )}
        {isChild && (
          <FormField label="Grade or level" id={`grade-${i}`}>
            <TextInput id={`grade-${i}`} value={member.gradeLevel} onChange={(v) => updateMember(i, 'gradeLevel', v)} placeholder="e.g. 2nd grade" />
          </FormField>
        )}
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <h2 className="intake-step__title">Quick Bloom Forecast</h2>
            <p className="intake-step__subtitle">About 5–7 minutes to your personalized forecast. You can add deeper details later.</p>
            <FormField label="Household name" id="householdName" required error={errors.householdName}>
              <TextInput id="householdName" value={intake.basics.householdName} onChange={(v) => updateBasics('householdName', v)} placeholder="e.g. The Martinez Family" />
            </FormField>
            <FormField label="Your name" id="caregiverName" required error={errors.caregiverName}>
              <TextInput id="caregiverName" value={intake.basics.caregiverName} onChange={(v) => updateBasics('caregiverName', v)} />
            </FormField>
            <div className="form-row">
              <FormField label="Time zone" id="timeZone" required error={errors.timeZone}>
                <SelectInput id="timeZone" value={intake.basics.timeZone} onChange={(v) => updateBasics('timeZone', v)} options={timeZoneOptions} placeholder="Select" />
              </FormField>
              <FormField label="Household type" id="householdType">
                <SelectInput id="householdType" value={intake.basics.householdType} onChange={(v) => updateBasics('householdType', v)} options={householdTypeOptions} placeholder="Select" />
              </FormField>
            </div>
            <div className="form-row">
              <FormField label="Adults" id="adultCount"><TextInput id="adultCount" type="number" min="1" value={intake.basics.adultCount} onChange={(v) => updateBasics('adultCount', v)} /></FormField>
              <FormField label="Children" id="childCount"><TextInput id="childCount" type="number" min="0" value={intake.basics.childCount} onChange={(v) => updateBasics('childCount', v)} /></FormField>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h2 className="intake-step__title">Your people</h2>
            <p className="intake-step__subtitle">Add household members with basic roles and learning/work models.</p>
            {errors.members && <p className="form-field__error" role="alert">{errors.members}</p>}
            {intake.members.map(renderMemberFields)}
            <button type="button" className="intake-add-member" onClick={addMember}>+ Add member</button>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="intake-step__title">Schedule anchors & learning</h2>
            <p className="intake-step__subtitle">Add fixed schedule blocks and tell Bloom about learning.</p>
            <CommitmentEditor
              commitments={intake.schedule.commitments}
              members={intake.members}
              onChange={(c) => setIntake((p) => ({ ...p, schedule: { ...p.schedule, commitments: c } }))}
              compact
            />
            <FormField label="Household learning model">
              <CardSelect options={learningModelOptions} value={intake.learning.model} onChange={(v) => updateLearning('model', v)} />
            </FormField>
            <FormField label="Current curriculum & resources" hint="List what you already use — comma or line separated">
              <TextArea id="curriculum" value={intake.learning.curriculum} onChange={(v) => updateLearning('curriculum', v)} placeholder="e.g. CKLA, Singapore Math, library books" rows={3} />
            </FormField>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="intake-step__title">Goals & priorities</h2>
            <p className="intake-step__subtitle">What should Bloom help with first?</p>
            <FormField label="Primary meal challenges"><ChipGroup options={mealChallengeOptions} selected={intake.goals.primaryChallenge?.meals || intake.meals.biggestChallenge} onChange={(v) => updateGoals('primaryChallenge', { ...intake.goals.primaryChallenge, meals: v })} /></FormField>
            <FormField label="Mental-load pain points"><ChipGroup options={mentalLoadOptions} selected={intake.goals.mentalLoadPainPoints} onChange={(v) => updateGoals('mentalLoadPainPoints', v)} /></FormField>
            <FormField label="Home stress tasks"><ChipGroup options={choreOptions} selected={intake.goals.primaryChallenge?.home || []} onChange={(v) => updateGoals('primaryChallenge', { ...intake.goals.primaryChallenge, home: v })} /></FormField>
            <FormField label="What should Bloom address first?"><ChipGroup options={bloomHelpOptions} selected={intake.goals.bloomHelpFirst} onChange={(v) => updateGoals('bloomHelpFirst', v)} /></FormField>
            <FormField label="Top family goal" id="goal0"><TextInput id="goal0" value={intake.goals.topGoals[0]} onChange={(v) => { const g = [...intake.goals.topGoals]; g[0] = v; updateGoals('topGoals', g); }} /></FormField>
            <FormField label="How should home feel?"><ChipGroup options={householdFeelingOptions} selected={intake.goals.desiredFeeling} onChange={(v) => updateGoals('desiredFeeling', v)} /></FormField>
          </>
        );
      default: return null;
    }
  };

  return (
    <IntakeLayout
      currentStep={step}
      steps={QUICK_INTAKE_STEPS}
      onBack={() => { setStep(step - 1); setErrors({}); window.scrollTo(0, 0); }}
      onContinue={handleContinue}
      onSaveExit={() => { saveIntake({ ...intake, currentStep: step }); navigate('/family-tech'); }}
      continueLabel={step === QUICK_INTAKE_STEPS.length - 1 ? 'Generate My Forecast' : 'Continue'}
      showBack={step > 0}
    >
      {renderStep()}
    </IntakeLayout>
  );
}
