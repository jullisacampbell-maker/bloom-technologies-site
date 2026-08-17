import { FormField, TextInput, SelectInput, ChipGroup } from './FormComponents';
import { createEmptyCommitment, commitmentCategoryOptions, dayOptions } from '../../data/intakeOptions';
import { formatTime } from '../../services/householdUtils';
import './CommitmentEditor.css';

export default function CommitmentEditor({ commitments = [], members = [], onChange, compact = false }) {
  const update = (index, field, value) => {
    const next = [...commitments];
    next[index] = { ...next[index], [field]: value };
    if (field === 'startTime' || field === 'endTime') {
      next[index][field] = formatTime(value) || value;
    }
    onChange(next);
  };

  const add = () => onChange([...commitments, createEmptyCommitment()]);

  const remove = (index) => onChange(commitments.filter((_, i) => i !== index));

  const toggleDay = (index, day) => {
    const days = commitments[index].days || [];
    const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    update(index, 'days', next);
  };

  const toggleMember = (index, memberId) => {
    const ids = commitments[index].memberIds || [];
    const next = ids.includes(memberId) ? ids.filter((id) => id !== memberId) : [...ids, memberId];
    update(index, 'memberIds', next);
  };

  return (
    <div className="commitment-editor">
      {commitments.length === 0 && (
        <p className="commitment-editor__empty">Add schedule anchors like wake times, school, work, or activities.</p>
      )}
      {commitments.map((c, i) => (
        <div key={c.id} className="commitment-card">
          <div className="commitment-card__header">
            <span>Commitment {i + 1}</span>
            <button type="button" className="commitment-card__remove" onClick={() => remove(i)}>Remove</button>
          </div>
          <FormField label="Name" id={`c-name-${i}`}>
            <TextInput id={`c-name-${i}`} value={c.name} onChange={(v) => update(i, 'name', v)} placeholder="e.g. Morning wake, Soccer practice" />
          </FormField>
          {!compact && members.length > 0 && (
            <FormField label="Applies to">
              <div className="chip-group">
                {members.filter((m) => m.name).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`chip ${(c.memberIds || []).includes(m.id) ? 'chip--selected' : ''}`}
                    onClick={() => toggleMember(i, m.id)}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </FormField>
          )}
          <FormField label="Days">
            <div className="chip-group">
              {dayOptions.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`chip ${(c.days || []).includes(d) ? 'chip--selected' : ''}`}
                  onClick={() => toggleDay(i, d)}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </FormField>
          <div className="form-row">
            <FormField label="Start time" id={`c-start-${i}`}>
              <TextInput id={`c-start-${i}`} value={c.startTime} onChange={(v) => update(i, 'startTime', v)} placeholder="7:00 AM" />
            </FormField>
            <FormField label="End time" id={`c-end-${i}`}>
              <TextInput id={`c-end-${i}`} value={c.endTime} onChange={(v) => update(i, 'endTime', v)} placeholder="8:00 AM" />
            </FormField>
          </div>
          <FormField label="Category">
            <SelectInput
              value={c.category}
              onChange={(v) => update(i, 'category', v)}
              options={commitmentCategoryOptions}
              placeholder="Category"
            />
          </FormField>
          <label className="toggle">
            <input
              type="checkbox"
              checked={c.fixed !== false}
              onChange={(e) => update(i, 'fixed', e.target.checked)}
            />
            <span className="toggle__track" aria-hidden="true" />
            <span className="toggle__label">Fixed commitment</span>
          </label>
        </div>
      ))}
      <button type="button" className="commitment-editor__add" onClick={add}>+ Add commitment</button>
    </div>
  );
}
