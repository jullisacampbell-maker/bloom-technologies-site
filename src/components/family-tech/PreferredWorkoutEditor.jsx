import { createEmptyPreferredWorkout, workoutTypeOptions, equipmentOptions, dayOptions } from '../../data/intakeOptions';
import { FormField, TextInput, TextArea, ChipGroup, SelectInput } from './FormComponents';
import './PreferredWorkoutEditor.css';

export default function PreferredWorkoutEditor({ intake, onChange }) {
  const workouts = intake.movement?.preferredWorkouts || [];

  const updateWorkouts = (next) => {
    onChange({
      ...intake,
      movement: { ...intake.movement, preferredWorkouts: next },
    });
  };

  const updateWorkout = (id, updates) => {
    updateWorkouts(workouts.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  };

  const addWorkout = () => {
    updateWorkouts([...workouts, createEmptyPreferredWorkout()]);
  };

  const removeWorkout = (id) => {
    updateWorkouts(workouts.filter((w) => w.id !== id));
  };

  return (
    <div className="preferred-workouts">
      <p className="preferred-workouts__intro">
        Add trusted workouts and instructors. Bloom Family Fit recommends these before generic suggestions.
      </p>

      {workouts.map((w) => (
        <div key={w.id} className="preferred-workouts__card">
          <FormField label="Workout type">
            <SelectInput
              value={w.workoutType}
              onChange={(v) => updateWorkout(w.id, { workoutType: v })}
              options={workoutTypeOptions.map((t) => ({ value: t, label: t }))}
              placeholder="Select type"
            />
          </FormField>
          <FormField label="Instructor / program name">
            <TextInput
              value={w.instructorName || ''}
              onChange={(v) => updateWorkout(w.id, { instructorName: v })}
              placeholder="e.g. Kristin, Caroline G."
            />
          </FormField>
          <FormField label="Optional URL">
            <TextInput
              value={w.url || ''}
              onChange={(v) => updateWorkout(w.id, { url: v })}
              placeholder="https://"
            />
          </FormField>
          <FormField label="Typical duration (minutes)">
            <TextInput
              type="number"
              min="5"
              max="120"
              value={w.durationMinutes ?? ''}
              onChange={(v) => updateWorkout(w.id, {
                durationMinutes: v ? parseInt(v, 10) : null,
                duration: v ? `${v} min` : '',
              })}
            />
          </FormField>
          <FormField label="Equipment">
            <ChipGroup
              options={equipmentOptions.filter((e) => e !== 'None')}
              selected={w.equipment || []}
              onChange={(v) => updateWorkout(w.id, { equipment: v })}
            />
          </FormField>
          <FormField label="Preferred days">
            <ChipGroup
              options={dayOptions}
              selected={w.preferredDays || []}
              onChange={(v) => updateWorkout(w.id, { preferredDays: v })}
            />
          </FormField>
          <FormField label="Notes">
            <TextArea value={w.notes || ''} onChange={(v) => updateWorkout(w.id, { notes: v })} rows={2} />
          </FormField>
          <button type="button" className="btn btn--secondary btn--small" onClick={() => removeWorkout(w.id)}>Remove</button>
        </div>
      ))}

      <button type="button" className="btn btn--secondary btn--small" onClick={addWorkout}>Add preferred workout</button>
    </div>
  );
}
