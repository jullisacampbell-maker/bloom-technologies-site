/**
 * Rules-based Bloom Forecast engine with module scoring.
 */

import { BLOOM_MODULES } from '../data/modules';
import {
  getChildren, getAdults, getPrimaryTeacher, isHomeschool,
  formatNameList, formatTime, parseTimeToMinutes, getFixedCommitments,
  HELP_FIRST_TO_MODULE, CHALLENGE_TO_MODULE, buildStructuredHomeGoals,
  isEarlyMorningAvailability,
} from './householdUtils';
import {
  isPresent, joinSentences, cleanPunctuation, dedupeList, displayText,
  parseDurationMinutes, formatDuration, SETUP_CTA,
  sanitizeGeneratedText, filterValidInsights,
} from './contentFormat';
import { FORECAST_SCHEMA_VERSION } from '../data/intakeOptions';

const PRODUCT_MODULES = ['academy', 'athletics', 'family-fit', 'meals'];
const STATUS = { startHere: 'Start Here', recommended: 'Recommended', available: 'Available' };

const HELP_SCORE = 35;
const CHALLENGE_SCORE = 12;
const SIGNAL_SCORE = 8;

function scoreModules(intake) {
  const scores = { academy: 0, athletics: 0, 'family-fit': 0, meals: 0 };
  const reasons = { academy: [], athletics: [], 'family-fit': [], meals: [] };
  const children = getChildren(intake.members);
  const homeschool = isHomeschool(intake);
  const teacher = getPrimaryTeacher(intake.members);

  (intake.goals?.bloomHelpFirst || []).forEach((h, i) => {
    const mod = HELP_FIRST_TO_MODULE[h];
    if (mod) {
      scores[mod] += HELP_SCORE - i * 5;
      reasons[mod].push(`You asked Bloom to help with ${h.toLowerCase()} first.`);
    }
  });

  (intake.goals?.mentalLoadPainPoints || []).forEach((p) => {
    const mod = CHALLENGE_TO_MODULE[p];
    if (mod) {
      scores[mod] += CHALLENGE_SCORE;
      reasons[mod].push(`${p} showed up in your mental-load responses.`);
    }
  });

  dedupeList([
    ...(intake.meals?.biggestChallenge || []),
    ...(intake.goals?.primaryChallenge?.meals || []),
  ]).forEach((c) => {
    scores.meals += CHALLENGE_SCORE;
    reasons.meals.push(`${c} is a meal-planning challenge for your household.`);
  });

  if (homeschool) {
    scores.academy += 25;
    reasons.academy.push('Your household includes home-based learning.');
  }

  if (children.length >= 2 && teacher && homeschool) {
    scores.academy += 20;
    const names = formatNameList(children.map((c) => c.name));
    const teacherName = isPresent(teacher.name) ? teacher.name : 'one primary teacher';
    reasons.academy.push(`${names} learn at different levels with ${teacherName} — coordination matters.`);
  }

  children.forEach((c) => {
    if (c.supportNeeds?.includes('Physical activity') || c.movementPreferences?.length) {
      scores.athletics += SIGNAL_SCORE;
      const n = isPresent(c.name) ? c.name : 'A child';
      reasons.athletics.push(`${n} has movement preferences or activity support needs.`);
    }
  });

  const wellnessAdult = getAdults(intake.members).find((a) => a.wellnessGoals?.length);
  if (intake.movement?.wellnessGoals?.length || wellnessAdult) {
    scores['family-fit'] += 22;
    const goal = wellnessAdult?.wellnessGoals?.[0] || intake.movement?.wellnessGoals?.[0];
    const adultName = wellnessAdult?.name || intake.basics?.caregiverName || 'A caregiver';
    if (isPresent(goal)) {
      reasons['family-fit'].push(`${adultName} prioritized ${goal.toLowerCase()}.`);
    }
  }

  if (intake.meals?.budget === 'tight') {
    scores.meals += 15;
    reasons.meals.push('A tight grocery budget means planned reuse and smart shopping will help.');
  }

  if (!homeschool && children.length > 0) {
    scores.athletics += 10;
    scores['family-fit'] += 8;
    reasons.athletics.push('After-school movement helps children transition from traditional school days.');
  }

  (intake.learning?.subjectsNeedingSupport || []).forEach((s) => {
    scores.academy += 10;
    reasons.academy.push(`${s} was flagged as needing extra support.`);
  });

  return { scores, reasons };
}

function assignStatuses(scored) {
  const { scores, reasons } = scored;
  const sorted = PRODUCT_MODULES
    .map((id) => ({ id, score: scores[id], reasons: reasons[id] }))
    .sort((a, b) => b.score - a.score);

  let recommendedCount = 0;

  return sorted.map((m, i) => {
    let status = STATUS.available;
    if (i === 0 && m.score > 0) {
      status = STATUS.startHere;
    } else if (recommendedCount < 2 && m.score >= 15) {
      status = STATUS.recommended;
      recommendedCount += 1;
    }

    const topReason = m.reasons[0] ||
      (status === STATUS.available
        ? `Available when ${BLOOM_MODULES[m.id].tagline.toLowerCase()} becomes a priority.`
        : 'Based on your household responses.');

    return {
      id: m.id,
      ...BLOOM_MODULES[m.id],
      score: m.score,
      status,
      reason: cleanPunctuation(topReason),
      reasons: m.reasons.map(cleanPunctuation),
      nextAction: getNextAction(m.id, status),
    };
  });
}

function getNextAction(moduleId, status) {
  const actions = {
    academy: 'Open Bloom Academy and review today\'s coordinated learning blocks',
    athletics: 'Schedule a movement break for each child in Bloom Athletics',
    'family-fit': 'Block your wellness window in Bloom Family Fit',
    meals: 'Confirm tonight\'s meal in Bloom Meals',
  };
  if (status === STATUS.startHere) return actions[moduleId];
  return `Explore ${BLOOM_MODULES[moduleId].name} when ready`;
}

function buildFamilySummary(intake) {
  const { basics, members } = intake;
  const children = getChildren(members);
  const adults = getAdults(members);
  const adultCount = adults.length || parseInt(basics.adultCount, 10) || 1;
  const childCount = children.length || parseInt(basics.childCount, 10) || 0;
  const homeschool = isHomeschool(intake);
  const teacher = getPrimaryTeacher(members);
  const feelings = dedupeList(intake.goals?.desiredFeeling || []).slice(0, 2);

  const parts = [];
  if (isPresent(basics.householdName)) {
    parts.push(`${basics.householdName} includes ${adultCount} adult${adultCount !== 1 ? 's' : ''} and ${childCount} child${childCount !== 1 ? 'ren' : ''}.`);
  }

  if (homeschool && teacher && children.length) {
    const teacherName = isPresent(teacher.name) ? teacher.name : 'A parent';
    parts.push(`${teacherName} leads learning for ${formatNameList(children.map((c) => c.name))}.`);
  } else if (homeschool) {
    parts.push('Learning happens at home.');
  } else if (children.length) {
    parts.push(`${formatNameList(children.map((c) => c.name))} attend traditional school while home rhythms still need coordination.`);
  }

  if (feelings.length) {
    parts.push(`You want home to feel ${feelings.join(' and ').toLowerCase()}.`);
  }

  const goal = intake.goals?.topGoals?.find(isPresent);
  if (goal) parts.push(`Top goal: ${cleanPunctuation(goal)}.`);

  return joinSentences(...parts) || 'Your household profile is ready for a personalized Bloom rhythm.';
}

function buildWeekdayRhythm(intake, modules) {
  const blocks = [];
  const commitments = getFixedCommitments(intake).filter((c) => isPresent(c.startTime));

  commitments.forEach((c) => {
    blocks.push({
      time: formatTime(c.startTime),
      label: cleanPunctuation(c.name),
      type: c.category || 'schedule',
    });
  });

  const hasType = (t) => blocks.some((b) => b.type === t);
  const homeschool = isHomeschool(intake);

  if (!hasType('meal') && !hasType('other')) {
    blocks.push({ time: '8:00 AM', label: 'Breakfast', type: 'meal' });
  }
  if (homeschool && !hasType('learning') && !hasType('school')) {
    blocks.push({ time: '9:00 AM', label: 'Teacher-time block', type: 'learning' });
    blocks.push({ time: '11:00 AM', label: 'Independent / Bloom Basket work', type: 'learning' });
  } else if (!homeschool && !hasType('school') && !hasType('work')) {
    blocks.push({ time: '8:30 AM', label: 'School or work departure', type: 'school' });
    blocks.push({ time: '3:30 PM', label: 'After-school transition', type: 'routine' });
  }
  if (!hasType('meal')) {
    blocks.push({ time: '6:00 PM', label: 'Family dinner', type: 'meal' });
  }
  if (modules.find((m) => m.id === 'athletics' && m.status !== STATUS.available)) {
    blocks.push({ time: '2:30 PM', label: 'Children\'s movement break', type: 'movement' });
  }
  if (modules.find((m) => m.id === 'family-fit' && m.status !== STATUS.available)) {
    blocks.push({
      time: '12:30 PM',
      label: 'Caregiver wellness window (flexible)',
      type: 'wellness',
    });
  }
  if (!hasType('bedtime')) {
    blocks.push({ time: '8:30 PM', label: 'Bedtime wind-down', type: 'bedtime' });
  }
  if (buildStructuredHomeGoals(intake).length || intake.home?.currentChores?.length) {
    blocks.push({ time: '7:30 PM', label: 'Home responsibilities', type: 'home' });
  }

  const seen = new Set();
  const deduped = blocks.filter((b) => {
    const key = `${b.time}|${b.label}`.toLowerCase();
    if (seen.has(key) || !isPresent(b.label)) return false;
    seen.add(key);
    return true;
  });

  return deduped.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
}

function buildTeachingArrangement(intake) {
  const children = getChildren(intake.members);
  const teacher = getPrimaryTeacher(intake.members);
  if (!isHomeschool(intake) || !children.length) return null;

  const names = children.map((c) => c.name).filter(isPresent);
  const teacherName = isPresent(teacher?.name) ? teacher.name : 'the primary teacher';

  if (children.length >= 2) {
    return {
      summary: `Alternate focused teacher-time with ${teacherName} while other children use independent Bloom Baskets.`,
      detail: `Because ${formatNameList(names)} are at different levels, Bloom recommends 20–30 minute individual blocks rather than one shared lesson for everything.`,
    };
  }
  return {
    summary: `${teacherName} can run a single focused block with ${names[0] || 'your child'}, then shift to independent work.`,
    detail: null,
  };
}

function buildCaregiverInsight(intake) {
  const adult = getAdults(intake.members).find((a) => a.wellnessGoals?.length) || getAdults(intake.members)[0];
  const goals = adult?.wellnessGoals?.length ? adult.wellnessGoals : intake.movement?.wellnessGoals || [];
  const goal = goals[0];
  if (!isPresent(goal)) return null;

  const adultName = isPresent(adult?.name) ? adult.name : (isPresent(intake.basics?.caregiverName) ? intake.basics.caregiverName : 'A caregiver');

  if (isEarlyMorningAvailability(intake)) {
    return {
      title: 'Caregiver capacity',
      body: `You identified a possible early-morning wellness window${isPresent(intake.movement?.scheduleOpportunity) ? ` (${intake.movement.scheduleOpportunity})` : ''}. Bloom should protect adequate sleep first, so this may work best as an optional short session or be moved to another part of the day.`,
    };
  }

  const minutes = parseDurationMinutes(
    intake.movement?.availableTimeNotes || intake.movement?.availableTime,
    intake.movement?.availableMinutes
  );
  const durationPhrase = minutes ? formatDuration(minutes) : 'a short';
  const window = isPresent(intake.movement?.scheduleOpportunity)
    ? intake.movement.scheduleOpportunity
    : 'a realistic window in your day';

  return {
    title: 'Caregiver capacity',
    body: `${adultName} prioritized ${goal.toLowerCase()}. Even ${durationPhrase} during ${window} supports the household without sacrificing sleep.`,
  };
}

function buildInsights(intake, modules) {
  const insights = [];
  const children = getChildren(intake.members);
  const teacher = getPrimaryTeacher(intake.members);
  const names = children.map((c) => c.name).filter(isPresent);

  if (children.length >= 2 && teacher && isHomeschool(intake)) {
    const levels = dedupeList(children.map((c) => c.gradeLevel || c.ageRange).filter(isPresent));
    const teacherName = isPresent(teacher.name) ? teacher.name : 'your primary teacher';
    insights.push({
      title: 'Teacher-time coordination',
      body: levels.length > 1
        ? `Because ${formatNameList(names)} are at different learning levels and ${teacherName} leads academics, Bloom recommends alternating individual teacher-time with prepared independent Bloom Baskets.`
        : `${teacherName} can rotate focused blocks with ${formatNameList(names)} while the other uses a prepared independent activity.`,
    });
  }

  const mealChallenges = dedupeList([
    ...(intake.meals?.biggestChallenge || []),
    ...(intake.goals?.primaryChallenge?.meals || []),
  ]);
  if (mealChallenges.includes('Time constraints') || mealChallenges.includes('Meal ideas')) {
    insights.push({
      title: 'Meal decision fatigue',
      body: mealChallenges.includes('Picky eaters') && names.length
        ? `Plan one safe side each child accepts, starting with ${formatNameList(names)}, plus a main you already trust.`
        : 'Two repeatable dinners this week will free more mental space than adding new recipes.',
    });
  }

  if (intake.meals?.budget === 'tight') {
    const store = isPresent(intake.meals?.shoppingLocations) ? ` at ${intake.meals.shoppingLocations}` : '';
    insights.push({
      title: 'Budget-smart rhythm',
      body: `With a tight grocery budget${store}, cook once and serve twice — batch a base protein early in the week.`,
    });
  }

  const caregiver = buildCaregiverInsight(intake);
  if (caregiver) insights.push(caregiver);

  if (intake.goals?.mentalLoadPainPoints?.includes('Scheduling conflicts')) {
    insights.push({
      title: 'Schedule overlap',
      body: 'Your fixed commitments need one view — Bloom OS flags where work, school, and activities compete for the same adult.',
    });
  }

  const startMod = modules.find((m) => m.status === STATUS.startHere);
  if (insights.length < 3 && startMod) {
    insights.push({
      title: `Why ${startMod.name.replace('Bloom ', '')} first`,
      body: startMod.reason,
    });
  }

  while (insights.length < 3) {
    insights.push({
      title: 'One rhythm at a time',
      body: 'Bloom works best when you strengthen one module before adding complexity. Your Start Here module reflects what matters most right now.',
    });
  }

  const seen = new Set();
  return filterValidInsights(
    insights.filter((i) => {
      if (seen.has(i.title)) return false;
      seen.add(i.title);
      return true;
    }).slice(0, 3)
  );
}

function buildNextSteps(intake, modules) {
  const start = modules.find((m) => m.status === STATUS.startHere);
  const steps = [];

  if (start) steps.push(start.nextAction);
  if (start?.id === 'meals') steps.push('Pick two go-to dinners and one backup option for this week');
  const recommended = modules.filter((m) => m.status === STATUS.recommended);
  if (recommended[0]) steps.push(`When ready, explore ${recommended[0].name}`);
  steps.push('Complete Family Setup for deeper daily recommendations');

  return dedupeList(steps).slice(0, 3);
}

function buildTodaysFocus(intake, startModule) {
  if (!startModule) return 'Review your Bloom Home rhythm for today';
  const children = getChildren(intake.members);

  switch (startModule.id) {
    case 'academy':
      return children.length
        ? `Coordinate learning blocks for ${formatNameList(children.map((c) => c.name))} — start in Bloom Academy`
        : 'Review learning resources in Bloom Academy';
    case 'meals': {
      const challenge = intake.meals?.biggestChallenge?.[0] || intake.goals?.primaryChallenge?.meals?.[0];
      return challenge
        ? `Simplify dinner — your top meal challenge is ${challenge.toLowerCase()}`
        : 'Confirm tonight\'s family meal in Bloom Meals';
    }
    case 'athletics':
      return children.length
        ? `Schedule movement breaks for ${formatNameList(children.map((c) => c.name))}`
        : 'Add a family movement break today';
    case 'family-fit': {
      const adult = getAdults(intake.members).find((a) => a.wellnessGoals?.length);
      const goal = adult?.wellnessGoals?.[0] || intake.movement?.wellnessGoals?.[0];
      const name = isPresent(adult?.name) ? adult.name : intake.basics?.caregiverName;
      return isPresent(goal) && isPresent(name)
        ? `Protect a wellness window for ${name}'s ${goal.toLowerCase()} goal`
        : 'Protect a realistic wellness window for yourself today';
    }
    default:
      return startModule.nextAction;
  }
}

function buildHomeConfig(intake) {
  const goals = buildStructuredHomeGoals(intake);
  return {
    stressTasks: intake.home?.stressTasks || [],
    chores: intake.home?.currentChores || [],
    structuredGoals: goals,
    suggestion: goals.length
      ? goals.join(' · ')
      : 'Assign one repeatable chore per child matched to their age',
  };
}

export function generateForecast(intake) {
  if (!intake) throw new Error('Intake data is required');

  const scored = scoreModules(intake);
  const productModules = assignStatuses(scored);
  const startModule = productModules.find((m) => m.status === STATUS.startHere);

  return {
    schemaVersion: FORECAST_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    householdName: displayText(intake.basics?.householdName, 'Your Family'),
    familySummary: sanitizeGeneratedText(buildFamilySummary(intake)) || 'Your household profile is ready for a personalized Bloom rhythm.',
    bloomOs: {
      ...BLOOM_MODULES['bloom-os'],
      tagline: 'Powered by Bloom OS',
      description: 'Your Bloom OS foundation coordinates learning, meals, movement, wellness, and home responsibilities.',
    },
    modules: productModules,
    startHereModule: startModule,
    weekdayRhythm: buildWeekdayRhythm(intake, productModules),
    teachingArrangement: buildTeachingArrangement(intake),
    weeklyFocus: productModules.filter((m) => m.status !== STATUS.available).map((m) => m.name),
    learning: {
      model: intake.learning?.model,
      curriculum: intake.learning?.curriculum,
      screenApproach: intake.learning?.screenPreference,
    },
    meals: {
      budget: intake.meals?.budget,
      approach: intake.meals?.budget === 'tight' ? 'Prioritize pantry staples and planned reuse' : 'Rotate trusted family favorites',
    },
    movement: {
      adultGoal: getAdults(intake.members).find((a) => a.wellnessGoals?.length)?.wellnessGoals?.[0]
        || intake.movement?.wellnessGoals?.[0],
    },
    home: buildHomeConfig(intake),
    insights: buildInsights(intake, productModules),
    nextSteps: buildNextSteps(intake, productModules),
    todaysFocus: buildTodaysFocus(intake, startModule),
    recommendedAction: startModule
      ? { text: startModule.nextAction, path: startModule.path, moduleName: startModule.name }
      : { text: 'Explore Bloom Home', path: '/family-tech/home', moduleName: 'Bloom Home' },
  };
}

export function regenerateForecast(intake) {
  return generateForecast(intake);
}

export { STATUS as MODULE_STATUS };
