import { Link } from 'react-router-dom';
import { footerLinks, primaryProductCta } from '../data/navigation';
import { companyContactEmail } from '../data/ecosystem';
import { ownershipCopyright, ownershipMarks } from '../data/ownershipNotice';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-icon">🌿</span>
              <span>Bloom Technologies</span>
            </Link>
            <p className="footer__tagline">
              Family technology built for real life.
            </p>
            <a href={`mailto:${companyContactEmail}`} className="footer__email">
              {companyContactEmail}
            </a>
          </div>

          <nav className="footer__nav" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link key={link.path} to={link.path} className="footer__nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="footer__cta-block">
            <p className="footer__cta-label">Customer platform</p>
            <a
              href={primaryProductCta.href}
              className="btn btn--ghost btn--small"
              target="_blank"
              rel="noopener noreferrer"
            >
              {primaryProductCta.label} →
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__ownership">
            <p className="footer__copyright">{ownershipCopyright}</p>
            <p className="footer__marks">{ownershipMarks}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
