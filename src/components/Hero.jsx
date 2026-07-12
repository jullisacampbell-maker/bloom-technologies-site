import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero({
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
              {primaryCta && (
                <Link to={primaryCta.to} className="btn btn--primary">
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link to={secondaryCta.to} className="btn btn--secondary">
                  {secondaryCta.label}
                </Link>
              )}
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
              <p className="hero__illustration-label">Hero Illustration</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
