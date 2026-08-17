import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import FamilyTechLayout from '../../components/family-tech/FamilyTechLayout';
import ResourceConfigureModal from '../../components/family-tech/ResourceConfigureModal';
import {
  VAULT_FILTERS, RESOURCE_VAULT_CATALOG, VAULT_LAST_VERIFIED,
} from '../../data/resourceVault';
import {
  filterVaultResources, isVaultResourceInStack, addVaultResourceToStack,
  removeResourceFromStack, findStackResourceByVaultId,
} from '../../services/resourceVaultService';
import { getIntake, saveIntake, saveForecast } from '../../services/householdStorage';
import { regenerateForecast } from '../../services/forecastEngine';
import './ResourceVault.css';

export default function ResourceVault() {
  const [intake, setIntake] = useState(() => getIntake());
  const [search, setSearch] = useState('');
  const [filterId, setFilterId] = useState('all');
  const [configureItem, setConfigureItem] = useState(null);

  if (!intake?.quickCompletedAt && !intake?.completedAt) {
    return <Navigate to="/family-tech/intake" replace />;
  }

  const filtered = useMemo(
    () => filterVaultResources({ search, filterId }),
    [search, filterId]
  );

  const persist = (updated) => {
    setIntake(updated);
    saveIntake(updated);
    saveForecast(regenerateForecast(updated));
  };

  const handleAdd = (config) => {
    const existing = findStackResourceByVaultId(intake, configureItem.id);
    if (existing) {
      const resources = intake.learning.resources.map((r) =>
        r.id === existing.id ? { ...r, ...config, mode: config.usageMode || config.mode } : r
      );
      persist({ ...intake, learning: { ...intake.learning, resources } });
    } else {
      const result = addVaultResourceToStack(intake, configureItem, config);
      if (result.added) persist(result.intake);
    }
    setConfigureItem(null);
  };

  const handleRemove = (vaultId) => {
    const stackItem = findStackResourceByVaultId(intake, vaultId);
    if (stackItem) {
      persist(removeResourceFromStack(intake, stackItem.id));
    }
  };

  return (
    <FamilyTechLayout>
      <div className="resource-vault container">
        <Link to="/family-tech/home" className="resource-vault__back">← Bloom Home</Link>

        <header className="resource-vault__header">
          <h1>Free Resource Vault</h1>
          <p className="resource-vault__tagline">
            Use what serves your family. Adapt what does not. Keep enough proof to tell the story.
          </p>
          <p className="resource-vault__verified">Last verified {VAULT_LAST_VERIFIED}</p>
        </header>

        <div className="resource-vault__toolbar">
          <input
            type="search"
            className="resource-vault__search"
            placeholder="Search resources…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search resources"
          />
          <div className="resource-vault__filters" role="tablist" aria-label="Filter resources">
            {VAULT_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filterId === f.id}
                className={`resource-vault__filter ${filterId === f.id ? 'resource-vault__filter--active' : ''}`}
                onClick={() => setFilterId(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="resource-vault__count">{filtered.length} resource{filtered.length !== 1 ? 's' : ''} shown</p>
        </div>

        <div className="resource-vault__grid">
          {filtered.map((item) => {
            const inStack = isVaultResourceInStack(intake, item.id);
            return (
              <article key={item.id} className="resource-vault__card">
                <div className="resource-vault__card-top">
                  <span className="resource-vault__format">{item.format}</span>
                  <span className="resource-vault__level">{item.level}</span>
                </div>
                <h2 className="resource-vault__title">{item.title}</h2>
                <p className="resource-vault__provider">{item.provider}</p>
                <p className="resource-vault__desc">{item.description}</p>
                <div className="resource-vault__chips">
                  {item.subjects?.map((s) => <span key={s} className="resource-vault__chip">{s}</span>)}
                </div>
                <div className="resource-vault__actions">
                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--secondary btn--small"
                  >
                    Visit official resource
                  </a>
                  {inStack ? (
                    <>
                      <span className="resource-vault__in-stack">In My Stack</span>
                      <button
                        type="button"
                        className="btn btn--secondary btn--small"
                        onClick={() => setConfigureItem(item)}
                      >
                        Configure
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary btn--small"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--primary btn--small"
                      onClick={() => setConfigureItem(item)}
                    >
                      Add to My Stack
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="resource-vault__empty">No resources match your search. Try a different filter.</p>
        )}

        <footer className="resource-vault__footer">
          <p>{RESOURCE_VAULT_CATALOG.length} curated free resources · Links go to official providers only</p>
          <Link to="/family-tech/setup" className="btn btn--secondary">Configure in Family Setup</Link>
        </footer>
      </div>

      {configureItem && (
        <ResourceConfigureModal
          vaultResource={configureItem}
          members={intake.members}
          initialConfig={findStackResourceByVaultId(intake, configureItem.id)}
          onSave={handleAdd}
          onClose={() => setConfigureItem(null)}
        />
      )}
    </FamilyTechLayout>
  );
}
