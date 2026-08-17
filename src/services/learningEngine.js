/**
 * Learning plan, Bloom Basket, and resource matching engine.
 */

import {
  getChildren, getPrimaryTeacher, isHomeschool, getChildLevelDisplay,
  getChildDevelopmentHint, formatNameList,
} from './householdUtils';
import {
  isPresent, SETUP_CTA, resourceAssignmentLabel, cleanPunctuation, dedupeList,
} from './contentFormat';
import { DEFAULT_PLAN_BLOCK_ORDER } from '../data/intakeOptions';
import { recommendVaultForGaps } from './resourceVaultService';

const SUBJECT_PATTERNS = [
  { pattern: /history and art|history\/art/i, subject: 'History/Art' },
  { pattern: /devotions.*preschool|tiny truths|bible|devotional/i, subject: 'Faith/devotional' },
  { pattern: /pan-african|african curriculum|social studies.*culture/i, subject: 'Social studies/culture' },
  { pattern: /ckla|reading.*skill|phonics|ela\b|language arts/i, subject: 'Reading/ELA' },
  { pattern: /mep math|singapore math|saxon math|\bmath\b/i, subject: 'Math' },
  { pattern: /freedom homeschool preschool|preschool curriculum|letter of the week/i, subject: 'Preschool/multi-subject' },
  { pattern: /piano|keyboard lesson|music lesson|\bpiano\b/i, subject: 'Music' },
  { pattern: /pool|swim|swimming/i, subject: 'Physical education' },
  { pattern: /science experiment|science lab|\bscience\b/i, subject: 'Science' },
  { pattern: /\bhistory\b/i, subject: 'History' },
  { pattern: /\bart\b|drawing|painting/i, subject: 'Art' },
  { pattern: /life skill|chore|home ec/i, subject: 'Life skills' },
  { pattern: /money|currency|financial/i, subject: 'Financial literacy' },
];

const USAGE_MODES = {
  SHARED: 'shared-learning',
  TEACHER: 'teacher-led',
  INDEPENDENT: 'independent',
  BASKET: 'bloom-basket',
  PARENT: 'parent-planning',
};

function classifyResource(name) {
  const n = name.toLowerCase();
  for (const { pattern, subject } of SUBJECT_PATTERNS) {
    if (pattern.test(n)) return subject;
  }
  return 'General';
}

export function normalizeResource(r) {
  const usageMode = r.usageMode || (
    r.mode === 'independent' ? USAGE_MODES.INDEPENDENT :
      r.mode === 'shared' ? USAGE_MODES.SHARED :
        r.mode === 'bloom-basket' ? USAGE_MODES.BASKET :
          r.mode === 'parent-planning' ? USAGE_MODES.PARENT :
            USAGE_MODES.TEACHER
  );
  return {
    ...r,
    usageMode,
    mode: usageMode,
    isShared: r.isShared ?? (!r.memberIds?.length),
    sequence: typeof r.sequence === 'number' ? r.sequence : 0,
  };
}

export function parseCurriculumResources(intake) {
  const structured = intake.learning?.resources || [];
  if (structured.length) {
    return structured.map(normalizeResource).map((r) => ({
      ...r,
      subject: r.subject || classifyResource(r.name),
    }));
  }

  const text = intake.learning?.curriculum || '';
  if (!isPresent(text)) return [];

  return dedupeList(text.split(/[,;\n]+/).map((s) => s.trim()).filter(isPresent)).map((name, i) =>
    normalizeResource({
      id: name,
      name,
      subject: classifyResource(name),
      memberIds: [],
      sequence: i,
    })
  );
}

function resourceAssignedToChild(resource, childId) {
  if (resource.isShared || !resource.memberIds?.length) return true;
  return resource.memberIds.includes(childId);
}

function resourcesForChild(child, allResources, usageModes) {
  const modes = usageModes || [USAGE_MODES.TEACHER, USAGE_MODES.INDEPENDENT, USAGE_MODES.BASKET];
  return allResources
    .filter((r) => modes.includes(r.usageMode))
    .filter((r) => resourceAssignedToChild(r, child.id))
    .sort((a, b) => a.sequence - b.sequence);
}

function sharedResources(allResources) {
  return allResources
    .filter((r) => r.usageMode === USAGE_MODES.SHARED)
    .sort((a, b) => a.sequence - b.sequence);
}

function teacherResourcesForChild(child, allResources) {
  return allResources
    .filter((r) => r.usageMode === USAGE_MODES.TEACHER)
    .filter((r) => resourceAssignedToChild(r, child.id))
    .sort((a, b) => a.sequence - b.sequence);
}

function independentResourcesForChild(child, allResources) {
  return allResources
    .filter((r) => [USAGE_MODES.INDEPENDENT, USAGE_MODES.BASKET].includes(r.usageMode))
    .filter((r) => resourceAssignedToChild(r, child.id))
    .sort((a, b) => a.sequence - b.sequence);
}

function formatResourceActivity(resource, suffix) {
  const dur = resource.duration ? ` (${resource.duration})` : '';
  return `${resource.name}${dur} — ${suffix}`;
}

function activityForResource(resource, blockType) {
  if (resource.usageMode === USAGE_MODES.PARENT) {
    return null;
  }
  if (blockType === 'shared') {
    return formatResourceActivity(resource, 'shared lesson');
  }
  if (blockType === 'teacher-led') {
    return formatResourceActivity(resource, 'teacher-led');
  }
  if (resource.usageMode === USAGE_MODES.BASKET) {
    return formatResourceActivity(resource, 'Bloom Basket');
  }
  return formatResourceActivity(resource, 'independent practice');
}

function fallbackIndependentActivity(child) {
  const interest = child.interests?.[0];
  const dev = getChildDevelopmentHint(child);
  const name = isPresent(child.name) ? child.name : 'Child';

  if (dev === 'preschool' || dev === 'kindergarten') {
    return interest
      ? `${interest}-themed picture book and discussion`
      : 'Hands-on early literacy or math play';
  }
  return interest
    ? `Independent ${interest.toLowerCase()} project`
    : 'Prepared Bloom Basket from available materials';
}

function buildSharedAssignments(children, resources, sharedList) {
  const label = sharedList.length
    ? sharedList.map((r) => activityForResource(r, 'shared')).join('; ')
    : 'Shared family lesson';

  return children.map((c) => ({
    childId: c.id,
    childName: isPresent(c.name) ? c.name : 'Child',
    activity: label,
    activityType: 'shared',
  }));
}

function buildTeacherBlock(children, allResources, focusIndex, teacherName) {
  const focusChild = children[focusIndex];
  const focusName = isPresent(focusChild?.name) ? focusChild.name : `Child ${focusIndex + 1}`;
  const teacherResources = teacherResourcesForChild(focusChild, allResources);
  const focusActivity = teacherResources[0]
    ? activityForResource(teacherResources[0], 'teacher-led')
    : `${focusName} — teacher-time block`;

  const parentPlanning = allResources
    .filter((r) => r.usageMode === USAGE_MODES.PARENT)
    .filter((r) => resourceAssignedToChild(r, focusChild.id) || r.isShared)
    .map((r) => `Parent planning: ${r.name}`)
    .join('; ');

  const assignments = children.map((c, i) => {
    if (i === focusIndex) {
      return {
        childId: c.id,
        childName: isPresent(c.name) ? c.name : 'Child',
        activity: focusActivity,
        activityType: 'teacher-led',
      };
    }

    const indResources = independentResourcesForChild(c, allResources);
    const sharedOnly = allResources.some((r) =>
      r.usageMode === USAGE_MODES.SHARED && resourceAssignedToChild(r, c.id)
    );

    if (sharedOnly && indResources.length === 0) {
      return {
        childId: c.id,
        childName: isPresent(c.name) ? c.name : 'Child',
        activity: 'Bloom Basket — independent work while sibling has teacher-time',
        activityType: 'independent',
      };
    }

    const ind = indResources[0];
    return {
      childId: c.id,
      childName: isPresent(c.name) ? c.name : 'Child',
      activity: ind
        ? activityForResource(ind, 'independent')
        : fallbackIndependentActivity(c),
      activityType: ind?.usageMode === USAGE_MODES.BASKET ? 'bloom-basket' : 'independent',
    };
  });

  return {
    type: 'teacher-led',
    teacher: parentPlanning
      ? `${teacherName} — ${focusName} (${parentPlanning})`
      : `${teacherName} — focused block with ${focusName}`,
    assignments,
    focusChildId: focusChild?.id,
  };
}

function resolveBlockOrder(intake, children) {
  const stored = intake.learning?.planBlockOrder?.length
    ? [...intake.learning.planBlockOrder]
    : [...DEFAULT_PLAN_BLOCK_ORDER];

  return stored.filter((key) => {
    if (key === 'teacher-1' && children.length < 2) return false;
    return true;
  });
}

const BLOCK_TIMES = {
  'shared-morning': '9:00 AM',
  'teacher-0': '9:30 AM',
  'teacher-1': '10:00 AM',
  'shared-afternoon': '1:30 PM',
  break: '2:30 PM',
  movement: '2:45 PM',
};

export function buildCoordinatedPlan(intake) {
  const children = getChildren(intake.members);
  const teacher = getPrimaryTeacher(intake.members);
  const resources = parseCurriculumResources(intake);
  const homeschool = isHomeschool(intake);

  if (!homeschool || !children.length) {
    return {
      blocks: [],
      homeschool: false,
      message: children.length
        ? 'Traditional school schedule — use evening or weekend learning blocks as needed.'
        : 'Add children to see a coordinated learning plan.',
      blockOrder: [],
    };
  }

  const teacherName = isPresent(teacher?.name) ? teacher.name : 'Primary teacher';
  const sharedMorning = sharedResources(resources);
  const sharedAfternoon = sharedResources(resources).slice(1);
  const blockOrder = resolveBlockOrder(intake, children);
  const blocks = [];
  let timeOffset = 0;

  for (const key of blockOrder) {
    let block = null;
    const time = BLOCK_TIMES[key] || `${9 + Math.floor(timeOffset / 2)}:${timeOffset % 2 ? '30' : '00'} AM`;

    if (key === 'shared-morning') {
      if (sharedMorning.length || intake.learning?.outdoorLearning) {
        block = {
          time,
          type: 'shared',
          teacher: 'Family',
          assignments: buildSharedAssignments(
            children,
            resources,
            sharedMorning.length ? sharedMorning : [{ name: 'Outdoor nature observation or shared read-aloud' }]
          ),
        };
      }
    } else if (key === 'teacher-0' && children[0]) {
      block = { time, ...buildTeacherBlock(children, resources, 0, teacherName) };
    } else if (key === 'teacher-1' && children[1]) {
      block = { time, ...buildTeacherBlock(children, resources, 1, teacherName) };
    } else if (key === 'shared-afternoon') {
      const afternoonShared = sharedAfternoon.length ? sharedAfternoon : sharedMorning.slice(-1);
      if (afternoonShared.length) {
        block = {
          time,
          type: 'shared',
          teacher: 'Family',
          assignments: buildSharedAssignments(children, resources, afternoonShared),
        };
      }
    } else if (key === 'break') {
      block = {
        time,
        type: 'break',
        teacher: '—',
        assignments: children.map((c) => ({
          childId: c.id,
          childName: isPresent(c.name) ? c.name : 'Child',
          activity: 'Movement break — see Bloom Athletics',
          activityType: 'break',
        })),
      };
    } else if (key === 'movement') {
      block = {
        time,
        type: 'movement',
        teacher: '—',
        assignments: children.map((c) => ({
          childId: c.id,
          childName: isPresent(c.name) ? c.name : 'Child',
          activity: 'Active play or outdoor movement',
          activityType: 'movement',
        })),
      };
    }

    if (block) {
      blocks.push(block);
      timeOffset += 1;
    }
  }

  if (!blocks.length) {
    blocks.push({
      time: '9:00 AM',
      type: 'teacher-led',
      teacher: `${teacherName} — configure resources in Family Setup`,
      assignments: children.map((c) => ({
        childId: c.id,
        childName: isPresent(c.name) ? c.name : 'Child',
        activity: SETUP_CTA,
        activityType: 'setup',
      })),
    });
  }

  return { blocks, homeschool: true, teacherName, blockOrder };
}

function buildChildProfile(child, intake, allResources) {
  const childResources = resourcesForChild(child, allResources);

  let approach = 'Balanced teacher-led and independent blocks';
  if (child.independenceLevel === 'independent') approach = 'Short teacher check-in, then independent projects';
  else if (child.independenceLevel === 'high-support') approach = 'Frequent teacher presence with shorter focused segments';
  else if (child.supportNeeds?.includes('Focus & attention')) approach = 'Shorter blocks with movement breaks between';
  else if (!isPresent(child.independenceLevel)) approach = SETUP_CTA;

  const level = getChildLevelDisplay(child);

  return {
    id: child.id,
    name: isPresent(child.name) ? child.name : 'Child',
    level: level || SETUP_CTA,
    levelMissing: !level,
    independenceMissing: !isPresent(child.independenceLevel),
    learningModel: isPresent(child.schoolWorkModel) ? child.schoolWorkModel : null,
    strengths: child.strengths || [],
    supportNeeds: child.supportNeeds || [],
    interests: child.interests || [],
    independenceLevel: isPresent(child.independenceLevel) ? child.independenceLevel : SETUP_CTA,
    resources: childResources,
    approach,
  };
}

export function buildBloomBaskets(intake) {
  const children = getChildren(intake.members);
  const teacher = getPrimaryTeacher(intake.members);
  const teacherName = isPresent(teacher?.name) ? teacher.name : 'a parent';
  const allResources = parseCurriculumResources(intake);

  return children.map((child) => {
    const basketResources = allResources.filter((r) =>
      r.usageMode === USAGE_MODES.BASKET && resourceAssignedToChild(r, child.id)
    );

    if (basketResources.length) {
      const r = basketResources[0];
      return {
        id: `bb-${child.id}`,
        childId: child.id,
        childName: isPresent(child.name) ? child.name : 'Child',
        activity: activityForResource(r, 'independent'),
        purpose: r.notes || `Configured Bloom Basket while ${teacherName} leads another child`,
        materials: r.printPrepStatus === 'needs-print' ? 'Print materials before the block' : 'Materials listed in resource notes',
        estimatedTime: r.duration || '20–25 min',
        independent: true,
        why: cleanPunctuation(`${r.name} is set as a Bloom Basket activity for ${child.name || 'this child'}.`),
      };
    }

    const interest = child.interests?.[0];
    const strength = child.strengths?.[0];
    const support = child.supportNeeds?.[0];
    const dev = getChildDevelopmentHint(child);
    const independent = ['moderate', 'independent'].includes(child.independenceLevel);
    const childName = isPresent(child.name) ? child.name : 'Child';

    let activity = '';
    let materials = 'Paper, pencils, books on hand';
    let purpose = '';
    let time = '20–25 min';

    if (dev === 'preschool') {
      activity = interest
        ? `${interest}-themed picture cards and simple matching game`
        : 'Letter or theme picture book with naming game';
      purpose = 'Early literacy through play';
      materials = 'Picture books, index cards, tray';
      time = '15–20 min';
    } else if (dev === 'kindergarten') {
      if (strength === 'Reading') {
        activity = 'Decodable reader with illustrated response drawing';
        purpose = 'Builds reading confidence independently';
        materials = 'Current reader, paper, crayons';
      } else {
        activity = interest
          ? `${interest}-themed sorting and labeling activity`
          : 'Hands-on math or literacy station with manipulatives';
        purpose = 'Kindergarten-level independent practice';
      }
      time = '20–25 min';
    } else if (strength === 'Reading') {
      activity = 'Independent reading with short written or oral response';
      purpose = 'Extends reading strength independently';
      materials = 'Current reader, notebook, timer';
    } else if (support === 'Focus & attention') {
      activity = 'Three short tasks, 8 minutes each, with a visible timer';
      purpose = 'Supports focus with clear boundaries';
      materials = 'Timer, prepped task cards, quiet space';
      time = '25 min';
    } else {
      activity = interest
        ? `${interest}-themed project — research, build, or create`
        : 'Open-ended project basket from available materials';
      purpose = interest ? `Extends ${interest.toLowerCase()} interest independently` : 'Independent exploration';
    }

    const why = strength
      ? `Uses ${childName}'s strength in ${strength.toLowerCase()} while ${teacherName} leads another child.`
      : interest
        ? `Matches ${childName}'s interest in ${interest.toLowerCase()} at a ${dev || 'school-age'} level.`
        : `Sized for ${childName}'s current independence level.`;

    return {
      id: `bb-${child.id}`,
      childId: child.id,
      childName,
      activity,
      purpose: purpose || `Independent learning for ${childName}`,
      materials,
      estimatedTime: time,
      independent: independent || child.independenceLevel !== 'high-support',
      why: cleanPunctuation(why),
    };
  });
}

const SUBJECT_ALIASES = {
  'Reading / ELA': ['Reading/ELA', 'Reading', 'ELA', 'Phonics'],
  'Math': ['Math'],
  'Music': ['Music', 'Piano'],
  'PE': ['Physical education', 'PE'],
  'Art': ['Art', 'History/Art'],
  'History': ['History', 'Social studies/culture'],
  'Science': ['Science'],
  'Life skills': ['Life skills'],
  'Foreign language': [],
};

function subjectCovered(requested, resources, intake) {
  const req = requested.toLowerCase();
  const subjects = resources.map((r) => r.subject?.toLowerCase() || '');

  if (/music/i.test(req) && (
    subjects.some((s) => /music|piano/i.test(s)) ||
    resources.some((r) => /piano|music/i.test(r.name))
  )) return true;
  if (/pe|physical|movement/i.test(req) && (
    subjects.some((s) => /physical|pe/i.test(s)) ||
    intake.movement?.childMovementPreferences?.length
  )) return true;
  if (/art/i.test(req) && (
    subjects.some((s) => /art/i.test(s)) ||
    resources.some((r) => /art/i.test(r.name))
  )) return true;
  if (/life skill/i.test(req) && (
    subjects.some((s) => /life skill/i.test(s)) ||
    intake.home?.currentChores?.length
  )) return true;
  if (/foreign language/i.test(req)) return false;

  const aliases = SUBJECT_ALIASES[requested] || [requested];
  return aliases.some((a) =>
    subjects.some((s) => s.includes(a.toLowerCase().split('/')[0]))
  );
}

export function detectResourceGaps(intake, resources) {
  const needed = intake.learning?.subjectsNeedingSupport || [];
  if (!needed.length) {
    return { gaps: [], message: 'Bloom found no urgent resource gap based on your current inventory and support requests.' };
  }

  const gaps = needed.filter((subject) => !subjectCovered(subject, resources, intake)).map((subject) => ({
    subject,
    suggestion: `You noted ${subject} needs support, but no matching resource appears in your inventory. Browse the Free Resource Vault or add a targeted material in Family Setup.`,
  }));

  if (!gaps.length) {
    return { gaps: [], message: 'Bloom found no urgent resource gap — your listed resources appear to cover the subjects you flagged.' };
  }

  return { gaps, message: null };
}

export function buildLearningContent(intake) {
  const children = getChildren(intake.members);
  const resources = parseCurriculumResources(intake);
  const profiles = children.map((c) => buildChildProfile(c, intake, resources));
  const plan = buildCoordinatedPlan(intake);
  const baskets = buildBloomBaskets(intake);
  const gapResult = detectResourceGaps(intake, resources);
  const vaultRecommendations = recommendVaultForGaps(intake, gapResult.gaps);

  const todayActivities = plan.blocks.flatMap((b) =>
    b.assignments
      .filter((a) => a.activityType !== 'setup')
      .map((a) => ({
        id: `learn-${b.time}-${a.childId}`,
        time: b.time,
        blockType: b.type,
        activityType: a.activityType,
        childName: a.childName,
        activity: a.activity,
        teacher: b.teacher,
      }))
  );

  const displayResources = resources.map((r) => ({
    ...r,
    assignmentLabel: r.isShared || !r.memberIds?.length
      ? 'Shared household resource'
      : resourceAssignmentLabel(r),
    usageLabel: (r.usageMode || r.mode || 'teacher-led').replace(/-/g, ' '),
  }));

  return {
    profiles,
    resources: displayResources,
    plan,
    baskets,
    gaps: gapResult.gaps,
    gapsMessage: gapResult.message,
    vaultRecommendations,
    todayActivities,
  };
}
