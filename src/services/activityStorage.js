import { getCompletions, saveCompletions } from './householdStorage';

export function getActivityRecord(moduleId, activityId) {
  const all = getCompletions();
  return all[moduleId]?.[activityId] || null;
}

export function updateActivity(moduleId, activityId, update, meta = {}) {
  const all = getCompletions();
  if (!all[moduleId]) all[moduleId] = {};

  const prev = all[moduleId][activityId] || {};
  const record = {
    ...prev,
    ...update,
    ...meta,
    updatedAt: new Date().toISOString(),
    history: [
      ...(prev.history || []),
      { action: update.status || 'update', at: new Date().toISOString(), prev: prev.status },
    ].slice(-10),
  };

  all[moduleId][activityId] = record;
  saveCompletions(all);
  return record;
}

export function completeActivity(moduleId, activityId, meta) {
  return updateActivity(moduleId, activityId, { status: 'complete', completedAt: new Date().toISOString() }, meta);
}

export function skipActivity(moduleId, activityId, reason = '', meta) {
  return updateActivity(moduleId, activityId, { status: 'skip', skipReason: reason }, meta);
}

export function moveActivity(moduleId, activityId, moveTo, meta) {
  return updateActivity(moduleId, activityId, { status: 'move', moveTo }, meta);
}

export function undoActivity(moduleId, activityId) {
  const all = getCompletions();
  const record = all[moduleId]?.[activityId];
  if (!record) return null;

  const history = record.history || [];
  const last = history[history.length - 1];
  const restored = { ...record, status: last?.prev || null, updatedAt: new Date().toISOString() };

  if (!restored.status) {
    delete all[moduleId][activityId];
  } else {
    all[moduleId][activityId] = restored;
  }
  saveCompletions(all);
  return restored;
}

export function getWeeklyRecords(moduleId) {
  const all = getCompletions();
  const mod = all[moduleId] || {};
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return Object.entries(mod)
    .map(([id, record]) => ({ id, ...record }))
    .filter((r) => r.updatedAt && new Date(r.updatedAt).getTime() > weekAgo)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export function getWeeklyTotals(moduleId) {
  const records = getWeeklyRecords(moduleId);
  return {
    completed: records.filter((r) => r.status === 'complete').length,
    skipped: records.filter((r) => r.status === 'skip').length,
    moved: records.filter((r) => r.status === 'move').length,
    total: records.length,
  };
}
