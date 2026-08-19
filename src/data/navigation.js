import { productUrls } from './ecosystem';

export const navLinks = [
  { label: 'Products', path: '/products' },
  { label: 'Vision', path: '/#vision' },
  { label: 'Founder', path: '/founder' },
  { label: 'Contact', path: '/contact' },
];

export const footerLinks = [
  ...navLinks,
  { label: 'About', path: '/about' },
];

export const socialLinks = [];

export const primaryProductCta = {
  label: 'Explore Bloom Family Tech',
  href: productUrls.familyTech,
  external: true,
};
