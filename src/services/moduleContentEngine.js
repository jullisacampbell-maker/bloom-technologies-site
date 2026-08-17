import { getAdults, getChildren } from './householdUtils';
import {
  isPresent, parseDurationMinutes, formatDuration, stripInternalPhrases,
  cleanPunctuation, dedupeList, mealSafeFoodPrompt, SETUP_CTA, sanitizeGeneratedText,
} from './contentFormat';

const WORKOUT_GOAL_MAP = {
  Pilates: ['Stress relief', 'Mobility', 'Consistency'],
  Strength: ['Strength', 'More energy'],
  'Indoor cycling': ['More energy', 'Consistency', 'Weight management'],
  Rowing: ['More energy', 'Strength', 'Consistency'],
  Walking: ['More energy', 'Stress relief', 'Consistency'],
  Mobility: ['Stress relief', 'Mobility', 'Better sleep'],
};

function pickPreferredWorkout(intake, primaryGoal, equipment) {
  const workouts = intake.movement?.preferredWorkouts || [];
  if (!workouts.length) return null;

  const scored = workouts.map((w) => {
    let score = 0;
    const goals = WORKOUT_GOAL_MAP[w.workoutType] || [];
    if (primaryGoal && goals.includes(primaryGoal)) score += 10;
    if (w.equipment?.length && w.equipment.some((e) => equipment.includes(e))) score += 5;
    if (isPresent(w.instructorName)) score += 2;
    return { workout: w, score };
  }).sort((a, b) => b.score - a.score);

  return scored[0]?.workout || workouts[0];
}

function buildWorkoutRecommendation(workout, primary, parsedMinutes) {
  const instructor = isPresent(workout.instructorName) ? workout.instructorName : '';
  const type = workout.workoutType || 'Workout';
  const mins = workout.durationMinutes || parsedMinutes || 20;
  const minimum = Math.min(10, Math.max(5, Math.round(mins * 0.4)));
  const full = mins;
  const equip = workout.equipment?.length ? ` using ${workout.equipment.join(' and ')}` : '';

  let title = instructor
    ? `Today: ${formatDuration(full) || '20-minute'} ${instructor} ${type} session`
    : `Today: ${formatDuration(full) || '20-minute'} ${type} session`;

  if (type === 'Strength' && instructor) {
    title = `Today: ${instructor} strength session${equip || ' using dumbbells'}`;
  } else if (type === 'Pilates' && instructor) {
    title = `Today: ${formatDuration(full) || '20-minute'} ${instructor} Pilates session`;
  } else if (type === 'Indoor cycling') {
    title = `Today: ${formatDuration(full) || '20-minute'} indoor cycle session`;
  } else if (type === 'Rowing') {
    title = `Today: ${formatDuration(full) || '20-minute'} rowing session`;
  }

  const description = instructor
    ? `${formatDuration(full) || '20 minutes'} with ${instructor}${equip}.`
    : `${formatDuration(full) || '20 minutes'} ${type.toLowerCase()}${equip}.`;

  return {
    id: `fit-workout-${workout.id}`,
    title,
    description,
    why: cleanPunctuation(
      `${primary || 'Your wellness goal'} aligns with your preferred ${type.toLowerCase()} program${instructor ? ` (${instructor})` : ''}.`
    ),
    minimum: `${formatDuration(minimum) || '10 minutes'} — shortened version`,
    full: `${formatDuration(full) || '20 minutes'} — full session`,
    lowEnergy: type === 'Pilates' || type === 'Mobility'
      ? '5 minutes gentle stretching and breathing'
      : '10-minute walk or easy mobility',
    fromPreferredLibrary: true,
    preferredWorkout: workout,
  };
}

export function buildFamilyFitContent(intake) {
  const adults = getAdults(intake.members);
  const adult = adults.find((a) => a.wellnessGoals?.length) || adults[0];
  const goals = dedupeList(
    adult?.wellnessGoals?.length ? adult.wellnessGoals : (intake.movement?.wellnessGoals || [])
  );
  const primary = goals[0] || null;
  const secondary = goals[1] || null;

  const structuredMinutes = intake.movement?.availableMinutes;
  const parsedMinutes = parseDurationMinutes(
    intake.movement?.availableTimeNotes || intake.movement?.availableTime,
    structuredMinutes
  );

  const availableDisplay = isPresent(intake.movement?.availableTimeNotes)
    ? intake.movement.availableTimeNotes
    : isPresent(intake.movement?.availableTime)
      ? intake.movement.availableTime
      : parsedMinutes
        ? formatDuration(parsedMinutes)
        : SETUP_CTA;

  const equipment = intake.movement?.equipment || [];
  const prefs = adult?.movementPreferences?.length
    ? adult.movementPreferences
    : intake.movement?.adultMovementPreferences || [];
  const hasRowing = equipment.includes('Rowing machine');
  const hasDumbbells = equipment.includes('Dumbbells');
  const hasBands = equipment.includes('Resistance bands');
  const hasMat = equipment.includes('Yoga mat');
  const hasCycle = equipment.includes('Indoor cycle bike');

  const targetDuration = parsedMinutes ? Math.min(parsedMinutes, 45) : 20;
  const minimum = parsedMinutes ? Math.min(10, Math.max(5, Math.round(parsedMinutes * 0.4))) : 10;
  const full = parsedMinutes || 20;

  const preferredWorkout = pickPreferredWorkout(intake, primary, equipment);

  let recommendation = preferredWorkout
    ? buildWorkoutRecommendation(preferredWorkout, primary, parsedMinutes)
    : {
      id: 'fit-main',
      title: 'Personalized movement session',
      description: SETUP_CTA,
      why: SETUP_CTA,
      minimum: SETUP_CTA,
      full: SETUP_CTA,
      lowEnergy: '5 minutes gentle stretching and hydration',
      fromPreferredLibrary: false,
    };

  if (!preferredWorkout) {
    if (primary === 'Strength' && (hasDumbbells || hasBands || hasRowing)) {
      recommendation = {
        id: 'fit-main',
        title: hasRowing ? 'Rowing intervals with strength finisher' : 'Strength circuit',
        description: hasRowing
          ? `${formatDuration(minimum) || '10 minutes'} of rowing intervals plus bodyweight squats and push-ups.`
          : `${formatDuration(full) || '20 minutes'} circuit: squats, rows, and presses for three rounds.`,
        why: cleanPunctuation(
          `${primary} is your primary goal${hasRowing ? ' with a rowing machine available' : hasDumbbells ? ' with dumbbells on hand' : ''}. Start with ${formatDuration(minimum) || 'a short session'} before extending to ${formatDuration(full) || 'a longer session'}.`
        ),
        minimum: `${formatDuration(minimum) || '10 minutes'} — one round`,
        full: `${formatDuration(full) || '20 minutes'} — full circuit`,
        lowEnergy: '10-minute brisk walk or mobility flow',
        fromPreferredLibrary: false,
      };
    } else if (primary === 'Stress relief') {
      recommendation = {
        id: 'fit-main',
        title: 'Mobility and breath work',
        description: `${formatDuration(minimum) || '10 minutes'} of hip and shoulder mobility with steady breathing${hasMat ? ' on your mat' : ''}.`,
        why: cleanPunctuation(
          `Stress relief is your primary goal.${isPresent(intake.movement?.scheduleOpportunity) ? ` Best window: ${intake.movement.scheduleOpportunity}.` : ''} Bloom protects sleep — choose a window that does not require waking earlier than you can sustain.`
        ),
        minimum: `${formatDuration(minimum) || '10 minutes'} mobility`,
        full: `${formatDuration(full) || '20 minutes'} mobility plus a short walk`,
        lowEnergy: '5 minutes seated stretching and breathing',
        fromPreferredLibrary: false,
      };
    } else if (primary === 'More energy' || primary === 'Consistency') {
      recommendation = {
        id: 'fit-main',
        title: hasRowing ? 'Steady-state row' : hasCycle ? 'Indoor cycle session' : 'Brisk walk or bodyweight circuit',
        description: hasRowing
          ? `${formatDuration(minimum) || '10 minutes'} steady row at conversational pace.`
          : hasCycle
            ? `${formatDuration(full) || '20 minutes'} steady indoor cycle at conversational pace.`
            : `${formatDuration(full) || '20 minutes'} walk or marching with arm swings.`,
        why: cleanPunctuation(
          `${primary} improves with regular sessions. ${formatDuration(minimum) || 'A short session'} counts even when ${formatDuration(full) || 'a longer session'} is not realistic.${isPresent(intake.movement?.possibleObstacle) ? ` Note: ${intake.movement.possibleObstacle}.` : ''}`
        ),
        minimum: formatDuration(minimum) || '10 minutes',
        full: formatDuration(full) || '20 minutes',
        lowEnergy: '5-minute walk around the house or block',
        fromPreferredLibrary: false,
      };
    } else if (primary) {
      recommendation = {
        id: 'fit-main',
        title: 'Goal-aligned movement session',
        description: parsedMinutes
          ? `${formatDuration(full)} session aligned to ${primary.toLowerCase()}.`
          : `Session aligned to ${primary.toLowerCase()} — duration based on your available window.`,
        why: cleanPunctuation(
          `Matched to your primary goal of ${primary.toLowerCase()}${parsedMinutes ? ` and ${formatDuration(parsedMinutes)} available` : ''}.`
        ),
        minimum: formatDuration(minimum) || '10 minutes',
        full: formatDuration(full) || '20 minutes',
        lowEnergy: 'Gentle stretching and hydration break',
        fromPreferredLibrary: false,
      };
    }
  }

  recommendation.description = stripInternalPhrases(recommendation.description);
  recommendation.why = stripInternalPhrases(sanitizeGeneratedText(recommendation.why));

  return {
    adultName: isPresent(adult?.name) ? adult.name : (isPresent(intake.basics?.caregiverName) ? intake.basics.caregiverName : 'You'),
    primaryGoal: primary || SETUP_CTA,
    secondaryGoal: secondary,
    availableTime: availableDisplay,
    availableMinutes: parsedMinutes,
    scheduleOpportunity: isPresent(intake.movement?.scheduleOpportunity) ? intake.movement.scheduleOpportunity : null,
    preferredTime: isPresent(intake.movement?.preferredTime) ? intake.movement.preferredTime : null,
    preferredDays: intake.movement?.preferredDays?.length ? intake.movement.preferredDays : null,
    availabilityFixed: intake.movement?.availabilityFixed ?? false,
    possibleObstacle: isPresent(intake.movement?.possibleObstacle) ? intake.movement.possibleObstacle : null,
    equipment,
    preferredWorkouts: intake.movement?.preferredWorkouts || [],
    recommendation,
  };
}

export function buildMealsContent(intake) {
  const children = getChildren(intake.members);
  const tight = intake.meals?.budget === 'tight';
  const budget = intake.meals?.budget || 'moderate';
  const store = intake.meals?.shoppingLocations;

  let mainMeal = tight ? 'Bean and cheese quesadillas with frozen vegetable side' : 'Sheet pan chicken, roasted vegetables, and rice';
  let prep = 'Prep vegetables while protein cooks — about 35 minutes total';

  if (intake.meals?.foodPreferences?.includes('Vegetarian')) {
    mainMeal = tight ? 'Lentil soup with bread' : 'Roasted vegetable pasta with herbs';
  }

  const childComponents = children.map((c) => {
    const safeRaw = c.favoriteFoods?.split(/[,;]/)[0]?.trim()
      || c.dinnerFoods?.split(/[,;]/)[0]?.trim()
      || c.snackFoods?.split(/[,;]/)[0]?.trim();
    return {
      name: isPresent(c.name) ? c.name : 'Child',
      safe: isPresent(safeRaw) ? safeRaw : null,
      safePrompt: mealSafeFoodPrompt(c.name),
      avoid: isPresent(c.avoidedFoods) ? c.avoidedFoods : (isPresent(c.allergies) ? c.allergies : null),
      hasData: isPresent(safeRaw),
    };
  });

  const substitutions = childComponents
    .filter((c) => c.avoid && c.safe)
    .map((c) => `${c.name}: avoid ${c.avoid} — serve ${c.safe} separately`);

  const hasPantryData = false;
  const grocerySectionTitle = hasPantryData ? 'Grocery gaps' : 'Suggested grocery check';

  const gaps = dedupeList([
    ...(tight ? ['Pantry staples: rice, beans, pasta, canned tomatoes'] : []),
    ...(tight ? ['Frozen vegetables for quick sides'] : []),
    ...(store ? [`Compare store-brand staples at ${store}`] : []),
    ...(mainMeal.includes('chicken') ? ['Check: chicken, vegetables, rice or tortillas'] : []),
  ].filter(isPresent));

  const leftover = tight
    ? 'Double the base protein — serve leftovers as bowls or wraps tomorrow'
    : 'Reserve half the roasted vegetables for lunch wraps';

  return {
    mainMeal: {
      id: 'meal-main',
      title: mainMeal,
      timeline: [
        { time: '4:30 PM', step: 'Review ingredients and prep list' },
        { time: '5:00 PM', step: 'Begin cooking' },
        { time: '6:00 PM', step: 'Serve with safe components per child where entered' },
        { time: '6:30 PM', step: 'Cleanup rotation' },
      ],
      prep,
      budget,
      childComponents,
      substitutions,
      leftover,
    },
    grocerySectionTitle,
    groceryGaps: gaps,
    memberFood: children.map((c) => ({
      name: c.name,
      favorites: c.favoriteFoods,
      breakfast: c.breakfastFoods,
      lunch: c.lunchFoods,
      dinner: c.dinnerFoods,
      snacks: c.snackFoods,
      avoided: c.avoidedFoods,
      allergies: c.allergies,
    })),
  };
}
