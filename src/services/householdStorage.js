/**
 * Household data persistence via localStorage with schema migration.
 */

import { createInitialIntake } from '../data/intakeOptions';
import { migrateIntake } from './householdMigration';
import { generateForecast } from './forecastEngine';
import { FORECAST_SCHEMA_VERSION } from '../data/intakeOptions';
import { filterValidInsights, isValidGeneratedText } from './contentFormat';

function forecastNeedsRepair(raw) {
  if (!raw) return true;
  if (raw.schemaVersion !== FORECAST_SCHEMA_VERSION) return true;
  if (!filterValidInsights(raw.insights || []).length && (raw.insights || []).length > 0) return true;
  if ((raw.insights || []).some((i) => !isValidGeneratedText(i?.body) || !isValidGeneratedText(i?.title))) return true;
  if (!isValidGeneratedText(raw.familySummary)) return true;
  return false;
}

const STORAGE_KEYS = {
  intake: 'bloom_household_intake',
  forecast: 'bloom_household_forecast',
  completions: 'bloom_household_completions',
  demoMeta: 'bloom_demo_meta',
};

function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    console.warn(`Malformed localStorage data for "${key}" — resetting.`);
    localStorage.removeItem(key);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    console.warn(`Unable to write localStorage key "${key}".`);
    return false;
  }
}

export function getIntake() {
  const raw = safeParse(STORAGE_KEYS.intake, null);
  if (!raw) return null;
  try {
    return migrateIntake(raw);
  } catch {
    console.warn('Intake migration failed — using fresh intake.');
    return createInitialIntake();
  }
}

export function saveIntake(intake) {
  return safeSet(STORAGE_KEYS.intake, intake);
}

export function getForecast() {
  const raw = safeParse(STORAGE_KEYS.forecast, null);
  if (!raw) return null;
  const intake = getIntake();
  if (forecastNeedsRepair(raw)) {
    if (intake?.quickCompletedAt || intake?.completedAt) {
      const next = generateForecast(intake);
      saveForecast(next);
      return next;
    }
  }
  if (raw.insights) {
    raw.insights = filterValidInsights(raw.insights);
  }
  return raw;
}

export function saveForecast(forecast) {
  return safeSet(STORAGE_KEYS.forecast, forecast);
}

export function getCompletions() {
  return safeParse(STORAGE_KEYS.completions, {});
}

export function saveCompletions(completions) {
  return safeSet(STORAGE_KEYS.completions, completions);
}

/** @deprecated use activityStorage.updateActivity */
export function updateCompletion(moduleId, activityId, status) {
  const completions = getCompletions();
  if (!completions[moduleId]) completions[moduleId] = {};
  completions[moduleId][activityId] = {
    status,
    updatedAt: new Date().toISOString(),
  };
  saveCompletions(completions);
  return completions;
}

export function hasHouseholdData() {
  return Boolean(getIntake()?.quickCompletedAt || getIntake()?.completedAt);
}

export function resetDemoData() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function getDemoMeta() {
  return safeParse(STORAGE_KEYS.demoMeta, { lastVisit: null });
}

export function touchDemoMeta() {
  const meta = getDemoMeta();
  meta.lastVisit = new Date().toISOString();
  safeSet(STORAGE_KEYS.demoMeta, meta);
}
