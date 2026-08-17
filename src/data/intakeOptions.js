export const SCHEMA_VERSION = 3;

export const FORECAST_SCHEMA_VERSION = 3;

export const householdTypeOptions = [
  { value: 'two-parent', label: 'Two-parent household' },
  { value: 'single-parent', label: 'Single-parent household' },
  { value: 'co-parenting', label: 'Co-parenting across homes' },
  { value: 'multigenerational', label: 'Multigenerational' },
  { value: 'guardian', label: 'Guardian or kinship care' },
  { value: 'other', label: 'Other arrangement' },
];

export const timeZoneOptions = [
  { value: 'America/New_York', label: 'Eastern (ET)' },
  { value: 'America/Chicago', label: 'Central (CT)' },
  { value: 'America/Denver', label: 'Mountain (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
  { value: 'America/Anchorage', label: 'Alaska (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii (HT)' },
  { value: 'other', label: 'Other / international' },
];

export const memberRoleOptions = [
  { value: 'parent', label: 'Parent / caregiver' },
  { value: 'child', label: 'Child' },
  { value: 'teen', label: 'Teen' },
  { value: 'adult', label: 'Adult (non-parent)' },
  { value: 'grandparent', label: 'Grandparent / elder' },
  { value: 'other', label: 'Other' },
];

export const ageRangeOptions = [
  { value: '0-2', label: '0–2 years' },
  { value: '3-5', label: '3–5 years' },
  { value: '6-8', label: '6–8 years' },
  { value: '9-11', label: '9–11 years' },
  { value: '12-14', label: '12–14 years' },
  { value: '15-17', label: '15–17 years' },
  { value: '18+', label: '18+ years' },
];

export const schoolWorkModelOptions = [
  { value: 'homeschool', label: 'Homeschool' },
  { value: 'traditional', label: 'Traditional school' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'preschool', label: 'Preschool / early learning' },
  { value: 'unschooling', label: 'Unschooling' },
  { value: 'work-full', label: 'Full-time work' },
  { value: 'work-part', label: 'Part-time work' },
  { value: 'work-remote', label: 'Remote work' },
  { value: 'stay-home', label: 'Stay-at-home' },
  { value: 'retired', label: 'Retired' },
  { value: 'na', label: 'Not applicable' },
];

export const independenceLevelOptions = [
  { value: 'high-support', label: 'Needs frequent support' },
  { value: 'guided', label: 'Guided with check-ins' },
  { value: 'moderate', label: 'Moderate independence' },
  { value: 'independent', label: 'Mostly independent' },
];

export const strengthOptions = [
  'Reading', 'Math', 'Creativity', 'Movement', 'Music', 'Building',
  'Nature', 'Social skills', 'Independence', 'Organization', 'Leadership',
];

export const supportNeedOptions = [
  'Focus & attention', 'Reading support', 'Math support', 'Social-emotional',
  'Sensory needs', 'Executive function', 'Physical activity', 'Routine structure',
  'Meal flexibility', 'Sleep schedule',
];

export const interestOptions = [
  'Art', 'Science', 'History', 'Sports', 'Music', 'Cooking', 'Animals',
  'Technology', 'Nature', 'Reading', 'Building', 'Dance', 'Games',
];

export const movementPreferenceOptions = [
  'Active play', 'Structured sports', 'Dance', 'Yoga / stretching',
  'Outdoor exploration', 'Swimming', 'Cycling', 'Martial arts', 'Gentle movement',
];

export const foodPreferenceOptions = [
  'Vegetarian', 'Vegan', 'Pescatarian', 'Gluten-free', 'Dairy-free',
  'Low-carb', 'Comfort foods', 'International cuisine', 'Simple meals',
  'Batch cooking', 'Minimal prep',
];

export const learningModelOptions = [
  { value: 'homeschool', label: 'Homeschool' },
  { value: 'traditional', label: 'Traditional school' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'preschool', label: 'Preschool' },
  { value: 'unschooling', label: 'Unschooling' },
  { value: 'na', label: 'Not applicable' },
];

export const gradeLevelOptions = [
  'Pre-K', 'Kindergarten', '1st', '2nd', '3rd', '4th', '5th',
  '6th', '7th', '8th', '9th', '10th', '11th', '12th', 'Mixed ages',
];

export const subjectOptions = [
  'Reading / ELA', 'Math', 'Science', 'History', 'Writing',
  'Foreign language', 'Art', 'Music', 'PE', 'Life skills',
];

export const screenPreferenceOptions = [
  { value: 'minimal', label: 'Minimal screens' },
  { value: 'moderate', label: 'Moderate, purposeful use' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'learning-focused', label: 'Learning-focused screens OK' },
];

export const groceryBudgetOptions = [
  { value: 'tight', label: 'Tight budget' },
  { value: 'moderate', label: 'Moderate budget' },
  { value: 'comfortable', label: 'Comfortable budget' },
  { value: 'flexible', label: 'Flexible budget' },
];

export const mealPrepStyleOptions = [
  { value: 'daily', label: 'Cook daily' },
  { value: 'batch', label: 'Batch prep on weekends' },
  { value: 'mix', label: 'Mix of both' },
  { value: 'simple', label: 'Simple / minimal prep' },
  { value: 'meal-kit', label: 'Meal kits or shortcuts' },
];

export const mealChallengeOptions = [
  'Picky eaters', 'Time constraints', 'Budget', 'Meal ideas',
  'Grocery planning', 'Allergies / restrictions', 'Coordination with schedules',
  'Energy for cooking', 'Variety',
];

export const wellnessGoalOptions = [
  'More energy', 'Strength', 'Stress relief', 'Better sleep',
  'Consistency', 'Weight management', 'Mobility', 'Mental clarity',
];

export const equipmentOptions = [
  'None', 'Dumbbells', 'Resistance bands', 'Yoga mat', 'Rowing machine',
  'Indoor cycle bike', 'Treadmill', 'Outdoor space', 'Playground access',
  'Sports equipment', 'Home gym basics',
];

export const usageModeOptions = [
  { value: 'shared-learning', label: 'Shared learning' },
  { value: 'teacher-led', label: 'Teacher-led' },
  { value: 'independent', label: 'Independent' },
  { value: 'bloom-basket', label: 'Bloom Basket / support activity' },
  { value: 'parent-planning', label: 'Parent planning (not a child activity)' },
];

export const resourceSubjectOptions = [
  'Faith/devotional', 'Reading/ELA', 'Math', 'Science', 'History', 'Art',
  'History/Art', 'Music', 'Physical education', 'Social studies/culture',
  'Preschool/multi-subject', 'Life skills', 'Financial literacy', 'Technology', 'General',
];

export const workoutTypeOptions = [
  'Pilates', 'Strength', 'Indoor cycling', 'Rowing', 'Walking', 'Mobility', 'Other',
];

export const printPrepStatusOptions = [
  { value: 'ready', label: 'Ready to use' },
  { value: 'needs-print', label: 'Needs printing' },
  { value: 'needs-prep', label: 'Needs prep time' },
  { value: 'digital-only', label: 'Digital only' },
];

export const choreOptions = [
  'Dishes', 'Laundry', 'Meals / cooking', 'Cleaning', 'Yard work',
  'Pet care', 'Trash', 'Organization', 'Grocery shopping', 'Bills / admin',
];

export const householdFeelingOptions = [
  'Calm', 'Connected', 'Organized', 'Playful', 'Purposeful',
  'Restful', 'Flexible', 'Encouraging', 'Independent', 'Present',
];

export const mentalLoadOptions = [
  'Scheduling conflicts', 'Meal planning', 'School coordination',
  'Chore balance', 'Activity logistics', 'Screen time decisions',
  'Bedtime routines', 'Work-life boundaries', 'Sibling coordination',
  'Remembering everything',
];

export const bloomHelpOptions = [
  'Learning rhythm', 'Meal planning', 'Movement & wellness',
  'Home responsibilities', 'Schedule coordination', 'Reducing mental load',
  'Family goals', 'Resource recommendations',
];

export const commitmentCategoryOptions = [
  { value: 'work', label: 'Work' },
  { value: 'school', label: 'School' },
  { value: 'activity', label: 'Activity' },
  { value: 'appointment', label: 'Appointment' },
  { value: 'worship', label: 'Worship / community' },
  { value: 'meal', label: 'Meal' },
  { value: 'bedtime', label: 'Bedtime' },
  { value: 'other', label: 'Other' },
];

export const dayOptions = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

/** Quick Bloom Forecast — target 5–7 minutes */
export const QUICK_INTAKE_STEPS = [
  { id: 'basics', label: 'Household basics', number: 1 },
  { id: 'members', label: 'Your people', number: 2 },
  { id: 'anchors', label: 'Schedule & learning', number: 3 },
  { id: 'priorities', label: 'Goals & priorities', number: 4 },
];

/** Complete Family Setup sections (progressive) */
export const SETUP_SECTIONS = [
  { id: 'child-profiles', label: 'Detailed child learning profiles', description: 'Strengths, support needs, interests, independence' },
  { id: 'schedules', label: 'Work & school schedules', description: 'Detailed schedules and recurring commitments' },
  { id: 'food', label: 'Individual food preferences', description: 'Favorite foods, allergies, meal-specific preferences' },
  { id: 'movement', label: 'Movement & wellness details', description: 'Equipment, time, wellness goals per adult' },
  { id: 'responsibilities', label: 'Home responsibilities', description: 'Chores, stress tasks, independence goals' },
  { id: 'curriculum', label: 'Curriculum & resource inventory', description: 'Configure resources, assignments, and learning block order' },
  { id: 'preferred-workouts', label: 'Preferred workouts and instructors', description: 'Trusted programs Bloom Family Fit should recommend first' },
  { id: 'commitments', label: 'Recurring commitments', description: 'All fixed schedule blocks' },
];

export function createEmptyCommitment() {
  return {
    id: crypto.randomUUID(),
    name: '',
    memberIds: [],
    days: [],
    startTime: '',
    endTime: '',
    fixed: true,
    category: 'other',
  };
}

export function createEmptyResource() {
  return {
    id: crypto.randomUUID(),
    vaultId: '',
    name: '',
    subject: '',
    memberIds: [],
    isShared: false,
    usageMode: 'teacher-led',
    mode: 'teacher-led',
    sequence: 0,
    duration: '',
    durationMinutes: null,
    days: [],
    frequency: '',
    teacherPrepRequired: false,
    printPrepStatus: '',
    notes: '',
  };
}

export function createEmptyPreferredWorkout() {
  return {
    id: crypto.randomUUID(),
    workoutType: '',
    instructorName: '',
    url: '',
    duration: '',
    durationMinutes: null,
    equipment: [],
    preferredDays: [],
    notes: '',
  };
}

export const DEFAULT_PLAN_BLOCK_ORDER = [
  'shared-morning',
  'teacher-0',
  'teacher-1',
  'shared-afternoon',
  'break',
];

export function createEmptyMember(role = '') {
  const isChild = ['child', 'teen'].includes(role);
  return {
    id: crypto.randomUUID(),
    name: '',
    ageRange: '',
    role: role || '',
    schoolWorkModel: '',
    gradeLevel: '',
    strengths: [],
    supportNeeds: [],
    interests: [],
    movementPreferences: [],
    foodPreferences: [],
    favoriteFoods: '',
    avoidedFoods: '',
    allergies: '',
    breakfastFoods: '',
    lunchFoods: '',
    dinnerFoods: '',
    snackFoods: '',
    independenceLevel: '',
    isPrimaryTeacher: false,
    workSchedule: '',
    caregivingResponsibilities: '',
    wellnessGoals: [],
    householdResponsibilities: [],
    assignedResources: '',
  };
}

export function createInitialIntake() {
  return {
    schemaVersion: SCHEMA_VERSION,
    basics: {
      householdName: '',
      caregiverName: '',
      email: '',
      timeZone: '',
      householdType: '',
      adultCount: '',
      childCount: '',
    },
    members: [createEmptyMember('parent')],
    schedule: {
      commitments: [],
      wakeByMember: {},
      notes: '',
      legacyNotes: '',
    },
    learning: {
      model: '',
      gradeLevels: [],
      curriculum: '',
      resources: [],
      planBlockOrder: [...DEFAULT_PLAN_BLOCK_ORDER],
      teacherLedWork: '',
      independentWork: '',
      screenPreference: '',
      outdoorLearning: false,
      subjectsNeedingSupport: [],
      learningGoals: '',
    },
    meals: {
      foodPreferences: [],
      allergies: '',
      budget: '',
      shoppingLocations: '',
      cookingFrequency: '',
      mealPrepStyle: '',
      biggestChallenge: [],
    },
    movement: {
      childMovementPreferences: [],
      adultMovementPreferences: [],
      equipment: [],
      indoorOutdoor: 'both',
      wellnessGoals: [],
      availableMinutes: null,
      availableTime: '',
      availableTimeNotes: '',
      preferredTime: '',
      preferredDays: [],
      availabilityFixed: false,
      scheduleOpportunity: '',
      possibleObstacle: '',
      preferredWorkouts: [],
    },
    home: {
      currentChores: [],
      responsibilitiesByPerson: '',
      stressTasks: [],
      independenceAreas: '',
    },
    goals: {
      topGoals: ['', '', ''],
      desiredFeeling: [],
      mentalLoadPainPoints: [],
      bloomHelpFirst: [],
      primaryChallenge: { meals: [], movement: [], home: [], mentalLoad: [] },
    },
    setupCompleted: {},
    quickCompletedAt: null,
    completedAt: null,
    currentStep: 0,
  };
}

/** @deprecated use QUICK_INTAKE_STEPS */
export const INTAKE_STEPS = QUICK_INTAKE_STEPS;
