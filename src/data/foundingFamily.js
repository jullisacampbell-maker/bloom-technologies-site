export const foundingFamilyBenefits = [
  'Help shape future features',
  'Early access before public launch',
  'Occasional founder updates (never spam)',
  'Exclusive Founding Family perks',
];

export const foundingFamilySuccessBenefits = [
  'Early product access',
  'Founder updates',
  'Opportunities to test new features',
  'Exclusive Founding Family perks',
];

export const familyTypeOptions = [
  { value: 'homeschool', label: 'Homeschool' },
  { value: 'public-school', label: 'Public School' },
  { value: 'private-school', label: 'Private School' },
  { value: 'preschool', label: 'Preschool' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'other', label: 'Other' },
];

export const productInterestOptions = [
  {
    value: 'bloom-hq',
    label: 'Bloom HQ',
    description: 'Home & Family Management',
  },
  {
    value: 'bloom-academy',
    label: 'Bloom Academy',
    description: 'Homeschool Planning',
  },
  {
    value: 'bloom-buds',
    label: 'Bloom Buds',
    description: 'Interactive Learning for Kids',
  },
  {
    value: 'everything',
    label: 'Everything',
    description: 'All Bloom products',
  },
];

export const betaTesterOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'not-right-now', label: 'Not right now' },
];

export const initialFoundingFamilyForm = {
  firstName: '',
  email: '',
  childrenCount: '',
  childrenAges: '',
  biggestChallenge: '',
  familyType: '',
  productInterest: '',
  oneThing: '',
  betaTester: '',
  emailUpdates: true,
};
