/** Accessible inline SVG icons for Bloom Family Tech */

export function IconBloom({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 22c-2-3-6-6-6-11a6 6 0 1112 0c0 5-4 8-6 11z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
      <path d="M12 8v8M9 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconAcademy({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 19V5l8-2 8 2v14l-8 2-8-2z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3v18M4 5l8 2 8-2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconAthletics({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 7l-3 5 4 2-1 5M14 7l3 5-4 2 1 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconFamilyFit({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3v4M8 7h8M6 11h12v10H6V11z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 15h6M9 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconMeals({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 10h16v10H4V10z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 10V6a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconOS({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconChevron({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const MODULE_ICONS = {
  'bloom-os': IconOS,
  academy: IconAcademy,
  athletics: IconAthletics,
  'family-fit': IconFamilyFit,
  meals: IconMeals,
};

export function ModuleIcon({ moduleId, size = 24, className = '' }) {
  const Icon = MODULE_ICONS[moduleId] || IconBloom;
  return <Icon size={size} className={className} />;
}
