import { SETUP_SECTIONS } from '../data/intakeOptions';
import { getChildren, getAdults, isChildMember } from './householdUtils';

function sectionComplete(intake, sectionId) {
  if (intake.setupCompleted?.[sectionId]) return true;

  switch (sectionId) {
    case 'child-profiles':
      return getChildren(intake.members).every((c) =>
        c.strengths?.length || c.supportNeeds?.length || c.independenceLevel
      );
    case 'schedules':
      return getAdults(intake.members).some((a) => a.workSchedule?.trim()) ||
        intake.schedule?.commitments?.length >= 2;
    case 'food':
      return intake.members.some((m) =>
        m.favoriteFoods?.trim() || m.breakfastFoods?.trim() || m.allergies?.trim()
      );
    case 'movement':
      return intake.movement?.equipment?.length > 0 ||
        intake.movement?.availableTime?.trim() ||
        getAdults(intake.members).some((a) => a.wellnessGoals?.length);
    case 'responsibilities':
      return intake.home?.currentChores?.length > 0 ||
        intake.home?.responsibilitiesByPerson?.trim() ||
        intake.members.some((m) => m.householdResponsibilities?.length);
    case 'curriculum':
      return intake.learning?.resources?.some((r) =>
        r.name?.trim() && r.usageMode
      ) || (intake.learning?.curriculum?.trim()?.length > 40);
    case 'preferred-workouts':
      return (intake.movement?.preferredWorkouts?.length || 0) > 0;
    case 'commitments':
      return (intake.schedule?.commitments?.length || 0) >= 3;
    default:
      return false;
  }
}

export function getSetupProgress(intake) {
  if (!intake) return { percent: 0, sections: [] };

  const sections = SETUP_SECTIONS.map((s) => ({
    ...s,
    complete: sectionComplete(intake, s.id),
  }));

  const completeCount = sections.filter((s) => s.complete).length;
  const quickBonus = intake.quickCompletedAt ? 1 : 0;
  const total = SETUP_SECTIONS.length + 1;
  const percent = Math.round(((completeCount + quickBonus) / total) * 100);

  return { percent, sections, completeCount, totalSections: SETUP_SECTIONS.length };
}

export function markSetupSection(intake, sectionId, complete = true) {
  return {
    ...intake,
    setupCompleted: { ...intake.setupCompleted, [sectionId]: complete },
  };
}
