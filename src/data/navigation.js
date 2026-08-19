import { productUrls } from './ecosystem';

export const navLinks = [
  { label: 'Products', path: '/products' },
  { label: 'About', path: '/about' },
  { label: 'Founder', path: '/founder' },
  { label: 'Vision', path: '/#vision' },
  { label: 'Contact', path: '/contact' },
];

export const footerLinks = [
  ...navLinks,
];

export const socialLinks = [];

export const primaryProductCta = {
  label: 'Explore Bloom Family Tech',
  href: productUrls.familyTech,
  external: true,
};
