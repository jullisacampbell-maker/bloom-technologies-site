import { Link } from 'react-router-dom';
import {
  createEmptyResource, DEFAULT_PLAN_BLOCK_ORDER,
} from '../../data/intakeOptions';
import { FormField, TextArea } from './FormComponents';
import ResourceConfigureForm from './ResourceConfigureForm';
import { findVaultMatchesFromCurriculum } from '../../services/resourceVaultService';
import './ResourceInventoryEditor.css';

const BLOCK_LABELS = {
  'shared-morning': 'Shared family learning (morning)',
  'teacher-0': 'Child A teacher-time',
  'teacher-1': 'Child B teacher-time',
  'shared-afternoon': 'Shared learning (afternoon)',
  break: 'Movement break',
  movement: 'Active play / movement',
};

export default function ResourceInventoryEditor({ intake, onChange }) {
  const resources = intake.learning?.resources || [];
  const blockOrder = intake.learning?.planBlockOrder || [...DEFAULT_PLAN_BLOCK_ORDER];
  const vaultMatches = findVaultMatchesFromCurriculum(intake);

  const updateResources = (next) => {
    onChange({
      ...intake,
      learning: { ...intake.learning, resources: next },
    });
  };

  const updateResource = (id, updates) => {
    updateResources(resources.map((r) => (r.id === id ? { ...r, ...updates, mode: updates.usageMode || r.usageMode } : r)));
  };

  const addResource = () => {
    updateResources([...resources, createEmptyResource()]);
  };

  const removeResource = (id) => {
    updateResources(resources.filter((r) => r.id !== id));
  };

  const moveBlock = (index, dir) => {
    const next = [...blockOrder];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange({
      ...intake,
      learning: { ...intake.learning, planBlockOrder: next },
    });
  };

  return (
    <div className="resource-inventory">
      <p className="resource-inventory__intro">
        Configure each resource&apos;s usage mode and assignment. Shared learning resources appear in family blocks — never as one child&apos;s independent practice.
        <Link to="/family-tech/resources" className="resource-inventory__vault-link">Browse Free Resource Vault →</Link>
      </p>

      {vaultMatches.length > 0 && (
        <div className="resource-inventory__matches">
          <h4>Possible vault matches — confirm in the Resource Vault</h4>
          {vaultMatches.map((m, i) => (
            <p key={i}>
              &ldquo;{m.enteredName}&rdquo; may match <strong>{m.vaultResource.title}</strong>.
              {m.alreadyInStack ? ' Already in My Stack.' : (
                <> <Link to="/family-tech/resources">Review in Vault →</Link></>
              )}
            </p>
          ))}
        </div>
      )}

      <FormField label="Legacy curriculum notes (optional)">
        <TextArea
          value={intake.learning.curriculum || ''}
          onChange={(v) => onChange({ ...intake, learning: { ...intake.learning, curriculum: v } })}
          rows={2}
          hint="Free-text inventory — structured resources below drive your coordinated plan"
        />
      </FormField>

      <div className="resource-inventory__blocks">
        <h4>Learning block order</h4>
        <p className="resource-inventory__hint">Reorder the coordinated learning sequence for your household.</p>
        <ol className="resource-inventory__block-list">
          {blockOrder.map((key, i) => (
            <li key={key} className="resource-inventory__block-item">
              <span>{BLOCK_LABELS[key] || key}</span>
              <span className="resource-inventory__block-actions">
                <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                <button type="button" onClick={() => moveBlock(i, 1)} disabled={i === blockOrder.length - 1} aria-label="Move down">↓</button>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="resource-inventory__list">
        <div className="resource-inventory__list-header">
          <h4>My Stack ({resources.length})</h4>
          <button type="button" className="btn btn--secondary btn--small" onClick={addResource}>Add resource</button>
        </div>

        {resources.length === 0 ? (
          <p className="resource-inventory__empty">
            No configured resources yet. Add resources manually or from the <Link to="/family-tech/resources">Free Resource Vault</Link>.
          </p>
        ) : resources.map((r) => (
          <details key={r.id} className="resource-inventory__card" open={!r.name}>
            <summary>
              <strong>{r.name || 'New resource'}</strong>
              <span className="resource-inventory__meta">
                {(r.usageMode || r.mode || 'teacher-led').replace(/-/g, ' ')}
                {r.isShared || !r.memberIds?.length ? ' · Shared' : ` · ${r.memberIds.length} child(ren)`}
              </span>
            </summary>
            <ResourceConfigureForm
              resource={r}
              members={intake.members}
              onChange={(updated) => updateResource(r.id, updated)}
            />
            <button type="button" className="btn btn--secondary btn--small resource-inventory__remove" onClick={() => removeResource(r.id)}>
              Remove
            </button>
          </details>
        ))}
      </div>
    </div>
  );
}
