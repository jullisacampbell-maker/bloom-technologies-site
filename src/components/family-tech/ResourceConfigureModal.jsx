import { useState } from 'react';
import ResourceConfigureForm from './ResourceConfigureForm';
import { vaultResourceToStackEntry } from '../../services/resourceVaultService';
import './ResourceConfigureModal.css';

export default function ResourceConfigureModal({
  vaultResource,
  members,
  initialConfig,
  onSave,
  onClose,
}) {
  const [resource, setResource] = useState(() =>
    initialConfig || vaultResourceToStackEntry(vaultResource, {})
  );

  const handleSave = () => {
    onSave({ ...resource, mode: resource.usageMode || resource.mode });
  };

  return (
    <div className="resource-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="resource-modal-title">
      <div className="resource-modal">
        <header className="resource-modal__header">
          <h2 id="resource-modal-title">Configure & add to My Stack</h2>
          <p>{vaultResource?.title}</p>
        </header>
        <ResourceConfigureForm resource={resource} members={members} onChange={setResource} />
        <div className="resource-modal__actions">
          <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn--primary" onClick={handleSave} disabled={!resource.name?.trim()}>
            Add to My Stack
          </button>
        </div>
      </div>
    </div>
  );
}
