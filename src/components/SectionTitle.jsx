import './SectionTitle.css';

export default function SectionTitle({ label, title, subtitle, align = 'center', light = false }) {
  return (
    <div className={`section-title section-title--${align} ${light ? 'section-title--light' : ''}`}>
      {label && <span className="section-title__label">{label}</span>}
      <h2 className="section-title__title">{title}</h2>
      {subtitle && <p className="section-title__subtitle">{subtitle}</p>}
    </div>
  );
}
