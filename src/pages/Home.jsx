import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import EcosystemFlow from '../components/EcosystemFlow';
import WhyBloom from '../components/WhyBloom';
import Principles from '../components/Principles';
import FounderSection from '../components/FounderSection';
import SectionTitle from '../components/SectionTitle';
import { ecosystemProducts, productUrls, companyContactEmail } from '../data/ecosystem';
import { Link } from 'react-router-dom';
import './Home.css';

const gridProducts = ecosystemProducts.filter((p) => p.showInGrid !== false);

export default function Home() {
  return (
    <div className="page-enter">
      <Hero
        eyebrow="BLOOM TECHNOLOGIES"
        headline="Technology built around real family life."
        subheadline="Bloom Technologies creates intelligent tools that help families learn, plan, move, eat, and thrive together."
        primaryCta={{ label: 'Explore Bloom Family Tech →', to: productUrls.familyTech, external: true }}
        secondaryCta={{ label: 'Meet the Bloom Ecosystem', to: '/#ecosystem' }}
      />

      <section id="ecosystem" className="section section--cream">
        <div className="container">
          <SectionTitle
            label="Ecosystem"
            title="One company. One connected family platform."
            subtitle="Bloom Technologies builds the intelligence layer and the customer experience that brings family life together."
          />
          <EcosystemFlow />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle
            label="Products"
            title="The Bloom ecosystem"
            subtitle="Every product serves a distinct role — from the platform families use daily to the intelligence that connects it all."
          />

          <div className="home__products">
            {gridProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <WhyBloom />

      <Principles />

      <FounderSection />

      <section className="home__contact section">
        <div className="container container--narrow">
          <div className="home__contact-card">
            <SectionTitle
              label="Contact"
              title="Let's connect"
              subtitle="Questions about Bloom Technologies or the Bloom product ecosystem? We'd love to hear from you."
            />
            <div className="home__contact-actions">
              <a href={`mailto:${companyContactEmail}`} className="btn btn--primary">
                {companyContactEmail}
              </a>
              <Link to="/contact" className="btn btn--secondary">
                Contact Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
