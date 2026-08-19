/**
 * Live Bloom Family Tech product URLs (bloom-dashboard repository).
 * Source: bloom-dashboard/index.html og:url and page structure.
 */
export const BLOOM_PRODUCT_BASE = 'https://jullisacampbell-maker.github.io/bloom-dashboard';

export const productUrls = {
  familyTech: `${BLOOM_PRODUCT_BASE}/resource-vault.html`,
  bloomHome: `${BLOOM_PRODUCT_BASE}/index.html`,
  academy: `${BLOOM_PRODUCT_BASE}/bloom-academy.html`,
  meals: `${BLOOM_PRODUCT_BASE}/bloom-meals.html`,
  athletics: `${BLOOM_PRODUCT_BASE}/bloom-athletics.html`,
  familyFit: `${BLOOM_PRODUCT_BASE}/bloom-family-fit.html`,
};

export const ecosystemProducts = [
  {
    id: 'family-tech',
    name: 'Bloom Family Tech',
    tagline: 'The family platform that brings the pieces together.',
    description:
      'The customer-facing experience where families learn, plan, move, and coordinate daily life — powered by Bloom OS.',
    highlights: [
      'Unified family platform',
      'Powered by Bloom OS intelligence',
      'Entry point to Bloom Home and modules',
    ],
    cta: 'Explore Bloom Family Tech →',
    href: productUrls.familyTech,
    external: true,
    status: 'live',
    icon: '🌿',
    color: '#2D5A3D',
  },
  {
    id: 'bloom-os',
    name: 'Bloom OS',
    tagline: 'The intelligence behind the family.',
    description:
      'Bloom OS coordinates family rhythms, learning, meals, movement, responsibilities, and changing needs — connecting modules into one adaptive system.',
    highlights: [
      'Household-aware orchestration',
      'Rhythm and priority coordination',
      'Technology layer, not a separate consumer brand',
    ],
    cta: 'See Bloom Home →',
    href: productUrls.bloomHome,
    external: true,
    status: 'live',
    icon: '✦',
    color: '#1a2840',
  },
  {
    id: 'bloom-home',
    name: 'Bloom Home',
    tagline: "The family's everyday command center.",
    description:
      'Where daily focus, rhythms, commitments, and quick paths into learning, meals, and movement come together in one place.',
    highlights: [
      'Daily family dashboard',
      'Rhythm and schedule awareness',
      'Gateway to every Bloom module',
    ],
    cta: 'See Bloom Home →',
    href: productUrls.bloomHome,
    external: true,
    status: 'live',
    icon: '🏡',
    color: '#234032',
    showInGrid: false,
  },
  {
    id: 'academy',
    name: 'Bloom Academy',
    tagline: 'Learning organized around your family.',
    description:
      'Personalized homeschool and learning organization — from free curriculum discovery to weekly school rhythms.',
    highlights: [
      'Free Resource Vault',
      'My School curriculum organization',
      'Parent / Teacher Guides',
      'Print + Prep workflows',
      'Personalized school rhythms',
    ],
    cta: 'Explore Bloom Academy →',
    href: productUrls.academy,
    external: true,
    status: 'live',
    icon: '📚',
    color: '#3D6B4F',
  },
  {
    id: 'meals',
    name: 'Bloom Meals',
    tagline: 'Family meals that work with your real week.',
    description:
      'Schedule-aware meal planning that respects household preferences and reduces the daily mental load of feeding a family.',
    highlights: [
      'Meal planning',
      'Grocery organization',
      'Schedule-aware planning',
      'Household food preferences',
    ],
    cta: 'Explore Bloom Meals →',
    href: productUrls.meals,
    external: true,
    status: 'coming-soon',
    icon: '🍽',
    color: '#6B9B7A',
  },
  {
    id: 'athletics',
    name: 'Bloom Athletics',
    tagline: 'Movement made part of everyday family life.',
    description:
      "Children's daily movement, skill development, and indoor/outdoor activities coordinated with family schedules.",
    highlights: [
      "Children's daily movement",
      'Skill development activities',
      'Indoor and outdoor options',
      'Schedule coordination',
    ],
    cta: 'Explore Bloom Athletics →',
    href: productUrls.athletics,
    external: true,
    status: 'coming-soon',
    icon: '⚡',
    color: '#4A7C59',
  },
  {
    id: 'family-fit',
    name: 'Bloom Family Fit',
    tagline: 'Wellness that fits the adults in the family too.',
    description:
      'Realistic parent fitness, wellness habits, and movement planning that works around family responsibilities.',
    highlights: [
      'Realistic parent fitness',
      'Wellness habit support',
      'Movement planning',
      'Consistency around family life',
    ],
    cta: 'Explore Bloom Family Fit →',
    href: productUrls.familyFit,
    external: true,
    status: 'coming-soon',
    icon: '💪',
    color: '#5C8A6A',
  },
];

export const ecosystemFlow = [
  { label: 'Bloom Technologies', tier: 'company' },
  { label: 'Bloom Family Tech', tier: 'platform' },
  { label: 'Powered by Bloom OS', tier: 'intelligence' },
  { label: 'Bloom Home', tier: 'hub' },
  {
    label: 'Bloom Academy · Bloom Meals · Bloom Athletics · Bloom Family Fit',
    tier: 'modules',
  },
];

export const companyPrinciples = [
  {
    title: 'Family First',
    description:
      'Technology should support family life rather than demand more attention from it.',
  },
  {
    title: 'Useful Intelligence',
    description:
      'Bloom should reduce decisions and mental load, not add another dashboard to manage.',
  },
  {
    title: 'Start With What Already Works',
    description:
      'Families should be able to use free curriculum, existing routines, and tools they already love.',
  },
  {
    title: 'Adapt to Real Life',
    description:
      'The system should change when the family changes.',
  },
];

export const companyContactEmail = 'bloomfamilytech@gmail.com';
