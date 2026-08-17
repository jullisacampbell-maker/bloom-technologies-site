/** Shared household data helpers */

import { isPresent, cleanPunctuation, dedupeList } from './contentFormat';

export function isChildMember(m) {
  return ['child', 'teen'].includes(m.role) ||
    ['0-2', '3-5', '6-8', '9-11', '12-14', '15-17'].includes(m.ageRange);
}

export function isAdultMember(m) {
  return ['parent', 'adult', 'grandparent'].includes(m.role) || m.ageRange === '18+';
}

export function getChildren(members = []) {
  return members.filter(isChildMember);
}

export function getAdults(members = []) {
  return members.filter(isAdultMember);
}

export function getPrimaryTeacher(members = []) {
  return members.find((m) => m.isPrimaryTeacher) ||
    getAdults(members).find((m) =>
      ['homeschool', 'hybrid', 'unschooling', 'stay-home'].includes(m.schoolWorkModel)
    ) ||
    getAdults(members).find((m) => m.role === 'parent');
}

export function isHomeschool(intake) {
  const model = intake?.learning?.model;
  if (['homeschool', 'unschooling', 'hybrid'].includes(model)) return true;
  return (intake?.members || []).some((m) =>
    isChildMember(m) && ['homeschool', 'unschooling', 'hybrid'].includes(m.schoolWorkModel)
  );
}

export function formatNameList(names) {
  const list = dedupeList(names.filter(isPresent));
  if (list.length === 0) return 'your children';
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`;
}

export function formatTime(time) {
  if (!isPresent(time)) return '';
  const match = String(time).trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm|AM|PM)?$/i);
  if (!match) return cleanPunctuation(String(time));
  let h = parseInt(match[1], 10);
  const m = match[2];
  const ap = (match[3] || (h >= 12 ? 'PM' : 'AM')).toUpperCase();
  if (!match[3]) {
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
  }
  return `${h}:${m} ${ap}`;
}

export function parseTimeToMinutes(time) {
  const match = String(time || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return 0;
  let h = parseInt(match[1], 10);
  const min = parseInt(match[2], 10);
  const ap = match[3]?.toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}

export function getMemberName(members, memberId) {
  const m = members.find((x) => x.id === memberId);
  return isPresent(m?.name) ? m.name : '';
}

const AGE_RANGE_LABELS = {
  '0-2': 'Ages 0–2',
  '3-5': 'Ages 3–5',
  '6-8': 'Ages 6–8',
  '9-11': 'Ages 9–11',
  '12-14': 'Ages 12–14',
  '15-17': 'Ages 15–17',
  '18+': 'Adult',
};

/** Grade/level only — never combine with age band label */
export function getChildLevelDisplay(child) {
  if (isPresent(child?.gradeLevel)) return cleanPunctuation(child.gradeLevel);
  if (isPresent(child?.ageRange) && AGE_RANGE_LABELS[child.ageRange]) {
    return AGE_RANGE_LABELS[child.ageRange];
  }
  return null;
}

/** Developmental hint for activity copy — conservative */
export function getChildDevelopmentHint(child) {
  if (isPresent(child?.gradeLevel)) {
    const g = child.gradeLevel.toLowerCase();
    if (/pre-k|preschool|prek/.test(g)) return 'preschool';
    if (/kindergarten|^k\b/.test(g)) return 'kindergarten';
    if (/1st|2nd|3rd|4th|5th|grade/.test(g)) return 'elementary';
    if (/6th|7th|8th|middle/.test(g)) return 'middle school';
    if (/9th|10th|11th|12th|high/.test(g)) return 'high school';
    return null;
  }
  if (child?.ageRange === '3-5') return 'preschool';
  if (child?.ageRange === '6-8' || child?.ageRange === '9-11') return 'elementary';
  if (child?.ageRange === '12-14') return 'middle school';
  if (child?.ageRange === '15-17') return 'high school';
  return null;
}

export function getAgeLabel(ageRange) {
  const map = {
    '0-2': 'toddler', '3-5': 'preschool age', '6-8': 'elementary age',
    '9-11': 'elementary age', '12-14': 'middle school age', '15-17': 'high school age',
  };
  return map[ageRange] || null;
}

export function getCommitments(intake) {
  return intake?.schedule?.commitments || [];
}

export function getFixedCommitments(intake) {
  return getCommitments(intake).filter((c) => c.fixed !== false && isPresent(c.name));
}

export function getTodayCommitments(intake) {
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  return getFixedCommitments(intake).filter((c) =>
    !c.days?.length || c.days.includes(day)
  ).sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));
}

export const HELP_FIRST_TO_MODULE = {
  'Learning rhythm': 'academy',
  'Meal planning': 'meals',
  'Movement & wellness': 'athletics',
  'Home responsibilities': 'meals',
  'Schedule coordination': 'academy',
  'Reducing mental load': 'meals',
  'Family goals': 'academy',
  'Resource recommendations': 'academy',
};

export const CHALLENGE_TO_MODULE = {
  'Picky eaters': 'meals', 'Time constraints': 'meals', 'Budget': 'meals',
  'Meal ideas': 'meals', 'Grocery planning': 'meals', 'Allergies / restrictions': 'meals',
  'Coordination with schedules': 'meals', 'Energy for cooking': 'meals', 'Variety': 'meals',
  'Scheduling conflicts': 'academy', 'Meal planning': 'meals', 'School coordination': 'academy',
  'Chore balance': 'meals', 'Activity logistics': 'athletics',
  'Screen time decisions': 'academy', 'Bedtime routines': 'athletics',
  'Work-life boundaries': 'family-fit', 'Sibling coordination': 'academy',
  'Remembering everything': 'academy',
};

export function buildStructuredHomeGoals(intake) {
  const goals = [];
  const resp = intake.home?.responsibilitiesByPerson || '';
  const indep = intake.home?.independenceAreas || '';
  const text = `${resp} ${indep}`.toLowerCase();

  if (/cook|dinner|meal/.test(text) && /ian|partner|spouse|adult|parent/.test(text)) {
    const nameMatch = resp.match(/([A-Z][a-z]+)/);
    const name = nameMatch ? nameMatch[1] : 'a partner';
    goals.push(`Share one weekly dinner with ${name}`);
  }
  if (/breakfast/.test(text) && /child|children|kid/.test(text)) {
    goals.push('Help the children prepare and clean up breakfast');
    goals.push('Build age-appropriate kitchen independence');
  }
  if (/chore|laundry|dishes|clean/.test(text) && goals.length < 3) {
    goals.push('Assign repeatable chores matched to each person\'s age');
  }
  if (isPresent(indep) && goals.length < 3) {
    goals.push(cleanPunctuation(indep));
  }
  (intake.goals?.topGoals || []).filter(isPresent).forEach((g) => {
    if (goals.length < 5) goals.push(cleanPunctuation(g));
  });

  return dedupeList(goals).slice(0, 5);
}

export function isEarlyMorningAvailability(intake) {
  const combined = [
    intake.movement?.availableTimeNotes,
    intake.movement?.availableTime,
    intake.movement?.scheduleOpportunity,
    intake.movement?.preferredTime,
  ].filter(isPresent).join(' ').toLowerCase();
  return /early|before.*wake|before household|after .* leaves|stay up|morning window/.test(combined);
}
