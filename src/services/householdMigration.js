/**
 * Migrate legacy intake to current schema.
 */

import {
  createInitialIntake, createEmptyCommitment, SCHEMA_VERSION, DEFAULT_PLAN_BLOCK_ORDER,
} from '../data/intakeOptions';
import { normalizeResource } from './learningEngine';
import { formatTime } from './householdUtils';
import { parseDurationMinutes } from './contentFormat';
import { FORECAST_SCHEMA_VERSION } from '../data/intakeOptions';

function migrateEquipment(equipment = []) {
  return equipment.flatMap((e) => {
    if (e === 'Treadmill / bike') return ['Treadmill', 'Indoor cycle bike'];
    return [e];
  });
}

function migrateResource(r) {
  return normalizeResource({
    vaultId: '',
    isShared: false,
    usageMode: 'teacher-led',
    sequence: 0,
    duration: '',
    durationMinutes: null,
    days: [],
    teacherPrepRequired: false,
    printPrepStatus: '',
    notes: '',
    ...r,
  });
}

function migrateLearning(learning = {}, baseLearning) {
  const resources = (learning.resources || []).map(migrateResource);
  return {
    ...baseLearning,
    ...learning,
    resources,
    planBlockOrder: learning.planBlockOrder?.length
      ? learning.planBlockOrder
      : [...DEFAULT_PLAN_BLOCK_ORDER],
  };
}

function migrateMovement(movement = {}, baseMovement) {
  const availableTime = movement.availableTime || '';
  const parsed = parseDurationMinutes(availableTime, movement.availableMinutes);
  const isAmbiguous = availableTime && !parsed && /hour|if i|stay up|after|maybe|when/i.test(availableTime);

  return {
    ...baseMovement,
    childMovementPreferences: movement.childMovementPreferences || [],
    adultMovementPreferences: movement.adultMovementPreferences || [],
    equipment: migrateEquipment(movement.equipment || []),
    indoorOutdoor: movement.indoorOutdoor || 'both',
    wellnessGoals: movement.wellnessGoals || [],
    availableMinutes: movement.availableMinutes ?? parsed ?? null,
    availableTime: isAmbiguous ? '' : availableTime,
    availableTimeNotes: movement.availableTimeNotes || (isAmbiguous ? availableTime : ''),
    preferredTime: movement.preferredTime || '',
    preferredDays: movement.preferredDays || [],
    availabilityFixed: movement.availabilityFixed ?? false,
    scheduleOpportunity: movement.scheduleOpportunity || '',
    possibleObstacle: movement.possibleObstacle || '',
    preferredWorkouts: movement.preferredWorkouts || [],
  };
}

function migrateMember(m) {
  return {
    gradeLevel: '',
    favoriteFoods: '',
    avoidedFoods: '',
    allergies: m.allergies || '',
    breakfastFoods: '',
    lunchFoods: '',
    dinnerFoods: '',
    snackFoods: '',
    independenceLevel: '',
    isPrimaryTeacher: Boolean(m.isPrimaryTeacher),
    workSchedule: m.workSchedule || '',
    caregivingResponsibilities: '',
    wellnessGoals: m.wellnessGoals || [],
    householdResponsibilities: m.householdResponsibilities || [],
    assignedResources: m.assignedResources || '',
    ...m,
  };
}

function extractWakeCommitments(schedule, members) {
  const commitments = [...(schedule.commitments || [])];
  if (schedule.wakeTimes && commitments.every((c) => c.category !== 'other' || !c.name?.includes('Wake'))) {
    commitments.push({
      ...createEmptyCommitment(),
      name: 'Morning wake',
      category: 'other',
      startTime: formatTime(schedule.wakeTimes.split(/[,;]/)[0]?.trim() || '7:00 AM'),
      fixed: true,
      days: dayOptions,
    });
  }
  if (schedule.bedtimes) {
    commitments.push({
      ...createEmptyCommitment(),
      name: 'Bedtime',
      category: 'bedtime',
      startTime: formatTime(schedule.bedtimes.split(/[,;]/)[0]?.trim() || '8:30 PM'),
      fixed: true,
      days: dayOptions,
    });
  }
  return commitments;
}

const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function migrateIntake(raw) {
  if (!raw) return null;

  const base = createInitialIntake();

  if (raw.schemaVersion === SCHEMA_VERSION) {
    return {
      ...raw,
      schemaVersion: SCHEMA_VERSION,
      learning: migrateLearning(raw.learning, base.learning),
      movement: migrateMovement(raw.movement, base.movement),
    };
  }

  const migrated = {
    ...base,
    ...raw,
    schemaVersion: SCHEMA_VERSION,
    basics: { ...base.basics, ...raw.basics },
    members: (raw.members || [base.members[0]]).map(migrateMember),
    schedule: {
      commitments: raw.schedule?.commitments?.length
        ? raw.schedule.commitments
        : extractWakeCommitments(raw.schedule || {}, raw.members),
      wakeByMember: raw.schedule?.wakeByMember || {},
      notes: raw.schedule?.notes || '',
      legacyNotes: [
        raw.schedule?.workSchedules,
        raw.schedule?.schoolSchedules,
        raw.schedule?.activities,
        raw.schedule?.worshipCommunity,
        raw.schedule?.recurringObligations,
        raw.schedule?.wakeTimes && `Wake: ${raw.schedule.wakeTimes}`,
        raw.schedule?.bedtimes && `Bed: ${raw.schedule.bedtimes}`,
      ].filter(Boolean).join('\n'),
    },
    learning: migrateLearning(raw.learning, base.learning),
    movement: migrateMovement(raw.movement, base.movement),
    goals: {
      ...base.goals,
      ...raw.goals,
      primaryChallenge: raw.goals?.primaryChallenge || {
        meals: raw.meals?.biggestChallenge || [],
        movement: [],
        home: raw.home?.stressTasks || [],
        mentalLoad: raw.goals?.mentalLoadPainPoints || [],
      },
    },
    setupCompleted: raw.setupCompleted || {},
    quickCompletedAt: raw.quickCompletedAt || raw.completedAt || null,
    completedAt: raw.completedAt || null,
  };

  if (migrated.quickCompletedAt && !migrated.completedAt) {
    migrated.completedAt = migrated.quickCompletedAt;
  }

  return migrated;
}

export function migrateForecast(raw, intake) {
  if (!raw) return null;
  if (raw.schemaVersion === FORECAST_SCHEMA_VERSION) return raw;
  return null;
}
