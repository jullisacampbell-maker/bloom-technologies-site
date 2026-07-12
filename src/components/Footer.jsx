import { Link } from 'react-router-dom';
import { navLinks } from '../data/navigation';
import SocialLinks from './SocialLinks';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
              Thoughtful AI-powered software for families.
            </p>
          </div>

          <nav className="footer__nav">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="footer__nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="footer__social">
            <SocialLinks />
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Bloom Technologies. All rights reserved.
          </p>
          <div className="footer__legal">
            {/* TODO: Create Privacy Policy page */}
            <a href="#" className="footer__legal-link">Privacy Policy</a>
            {/* TODO: Create Terms page */}
            <a href="#" className="footer__legal-link">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
