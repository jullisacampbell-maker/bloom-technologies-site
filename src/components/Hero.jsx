import { Link } from 'react-router-dom';
import './Hero.css';

function CtaButton({ cta }) {
  if (!cta) return null;

  const className = cta.variant === 'secondary' ? 'btn btn--secondary' : 'btn btn--primary';

  if (cta.external) {
    return (
      <a href={cta.to} className={className}>
        {cta.label}
      </a>
    );
  }

  return (
    <Link to={cta.to} className={className}>
      {cta.label}
    </Link>
  );
}

export default function Hero({
  eyebrow,
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  showIllustration = true,
  compact = false,
}) {
  return (
    <section className={`hero ${compact ? 'hero--compact' : ''}`}>
      <div className="hero__bg" />
      <div className="container hero__inner">
        <div className="hero__content">
          {eyebrow && (
            <p className="hero__eyebrow animate-fade-in-up">{eyebrow}</p>
          )}
          <h1 className="hero__headline animate-fade-in-up">
            {headline}
          </h1>
          {subheadline && (
            <p className="hero__subheadline animate-fade-in-up animate-delay-1">
              {subheadline}
            </p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className="hero__actions animate-fade-in-up animate-delay-2">
              <CtaButton cta={primaryCta} />
              <CtaButton cta={secondaryCta && { ...secondaryCta, variant: 'secondary' }} />
            </div>
          )}
        </div>

        {showIllustration && !compact && (
          <div className="hero__illustration animate-fade-in-up animate-delay-3">
            <div className="hero__illustration-placeholder">
              <div className="hero__illustration-circle hero__illustration-circle--1" />
              <div className="hero__illustration-circle hero__illustration-circle--2" />
              <div className="hero__illustration-circle hero__illustration-circle--3" />
              <div className="hero__illustration-icon">🌿</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
