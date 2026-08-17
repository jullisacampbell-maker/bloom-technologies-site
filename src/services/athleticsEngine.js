import {
  getChildren, getChildDevelopmentHint, getChildLevelDisplay, formatNameList,
} from './householdUtils';
import { isPresent, cleanPunctuation, formatDuration } from './contentFormat';

const PLAYFUL_BREAKS = [
  'Animal walks — bear crawl, frog hops, and butterfly stretches',
  'Freeze dance — move to music, freeze on pause',
  'Balance trail — walk a tape line, one foot, then the other',
  'Follow-the-leader around the room with silly moves',
  'Balloon keep-up — keep a balloon off the floor together',
  'Indoor obstacle path — cushions, tape lines, and soft targets',
];

function ageAppropriateBreak(child, index) {
  const dev = getChildDevelopmentHint(child);
  if (dev === 'preschool' || dev === 'kindergarten' || child?.ageRange === '3-5') {
    return PLAYFUL_BREAKS[index % PLAYFUL_BREAKS.length];
  }
  if (dev === 'elementary' || ['6-8', '9-11'].includes(child?.ageRange)) {
    return PLAYFUL_BREAKS[(index + 2) % PLAYFUL_BREAKS.length];
  }
  return 'Active relay — hop, skip, and side shuffle between markers';
}

function childActivity(child, intake, index) {
  const prefs = child.movementPreferences?.length
    ? child.movementPreferences
    : intake.movement?.childMovementPreferences || [];
  const indoor = intake.movement?.indoorOutdoor !== 'outdoor';
  const outdoor = intake.movement?.indoorOutdoor !== 'indoor';
  const equipment = intake.movement?.equipment || [];
  const interest = child.interests?.[0];
  const dev = getChildDevelopmentHint(child);
  const level = getChildLevelDisplay(child);
  const childName = isPresent(child.name) ? child.name : 'Child';

  let activity = '';
  let purpose = 'Mid-day energy reset';
  let duration = dev === 'preschool' ? '10 minutes' : '15 minutes';
  let materials = 'Open space';
  let indoorAlt = '';
  let outdoorAlt = '';

  if (prefs.includes('Structured sports') || interest === 'Sports') {
    activity = dev === 'preschool' || dev === 'kindergarten'
      ? 'Soft target toss and catching games at close range'
      : 'Throwing and catching progression — start close, increase distance';
    purpose = 'Hand-eye coordination';
    materials = equipment.includes('Sports equipment') ? 'Ball, cones or markers' : 'Soft ball or rolled socks';
  } else if (prefs.includes('Dance') || interest === 'Dance') {
    activity = 'Follow-along dance with freeze moments between songs';
    purpose = 'Rhythm and body awareness';
    materials = 'Speaker or phone, clear floor space';
  } else if (prefs.includes('Outdoor exploration') && outdoor) {
    activity = 'Nature scavenger hunt — find textures, colors, and shapes';
    purpose = 'Observation and movement combined';
    materials = 'Checklist on paper, pencil';
    outdoorAlt = activity;
    indoorAlt = 'Indoor texture hunt using items around the house';
  } else if (child.supportNeeds?.includes('Sensory needs')) {
    activity = 'Heavy work circuit — wall pushes, crab walks, carry books across the room';
    purpose = 'Sensory regulation through proprioceptive input';
    duration = '12 minutes';
  } else if (dev === 'preschool') {
    activity = 'Animal movement parade — hop, crawl, and stretch like different animals';
    purpose = 'Gross motor development for preschoolers';
    duration = '10 minutes';
  } else if (dev === 'kindergarten') {
    activity = 'Obstacle path with balance, crawl, and target toss stations';
    purpose = 'Coordination and active play for kindergarten';
    materials = 'Tape, cushions, soft ball';
  } else {
    activity = 'Active relay — hop, skip, and side shuffle between two markers';
    purpose = 'Cardio and coordination';
    materials = 'Two markers (towels or tape lines)';
  }

  if (indoor && !indoorAlt) indoorAlt = activity;
  if (outdoor && !outdoorAlt) outdoorAlt = 'Same activity with more space outdoors';

  let whyParts = [];
  if (level) whyParts.push(`${childName} is at ${level}`);
  else if (dev) whyParts.push(`activity sized for ${dev} level`);
  if (interest) whyParts.push(`interested in ${interest.toLowerCase()}`);
  if (prefs[0]) whyParts.push(`matches ${prefs[0].toLowerCase()} preference`);

  return {
    id: `ath-${child.id}`,
    childId: child.id,
    childName,
    activity,
    purpose,
    duration,
    materials,
    indoorAlt,
    outdoorAlt,
    why: whyParts.length
      ? cleanPunctuation(whyParts.join(', ') + '.')
      : `Personalized movement for ${childName}.`,
  };
}

function familyActivity(children, intake) {
  const names = children.map((c) => c.name).filter(isPresent);
  const outdoor = intake.movement?.indoorOutdoor !== 'indoor';
  const youngest = children.some((c) => getChildDevelopmentHint(c) === 'preschool' || c.ageRange === '3-5');

  return {
    id: 'ath-family',
    activity: outdoor
      ? (youngest ? 'Family walk with a simple scavenger checklist' : 'Family walk or bike ride — children choose the route')
      : (youngest ? 'Living room obstacle course with animal walks' : 'Living room obstacle course — each person designs one station'),
    purpose: 'Shared movement and sibling connection',
    duration: '20–25 minutes',
    materials: outdoor ? 'Shoes, water bottles' : 'Cushions, tape, household items',
    why: names.length >= 2
      ? `Gives ${formatNameList(names)} a shared active outlet.`
      : 'Builds a family movement habit together.',
  };
}

export function buildAthleticsContent(intake) {
  const children = getChildren(intake.members);
  const childActivities = children.map((c, i) => childActivity(c, intake, i));
  const family = children.length ? familyActivity(children, intake) : null;

  const focusChild = children[0];
  const shortBreak = focusChild ? {
    id: `ath-break-${focusChild.id}`,
    childId: focusChild.id,
    childName: isPresent(focusChild.name) ? focusChild.name : 'Child',
    activity: ageAppropriateBreak(focusChild, 0),
    purpose: 'Quick energy reset between learning or meal blocks',
    duration: '10 minutes',
    materials: 'Open floor space, optional music',
    why: `Playful break sized for ${getChildLevelDisplay(focusChild) || getChildDevelopmentHint(focusChild) || 'your child\'s'} level.`,
  } : null;

  return { childActivities, family, shortBreak };
}
