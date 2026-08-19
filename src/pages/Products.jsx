import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import EcosystemFlow from '../components/EcosystemFlow';
import SectionTitle from '../components/SectionTitle';
import { ecosystemProducts } from '../data/ecosystem';
import './Products.css';

const gridProducts = ecosystemProducts.filter((p) => p.showInGrid !== false);

export default function Products() {
  return (
    <div className="page-enter">
      <Hero
        eyebrow="PRODUCTS"
        headline="The Bloom ecosystem"
        subheadline="Bloom Technologies builds the platform, intelligence layer, and modules that help real families coordinate learning, meals, movement, and daily life."
        compact
        showIllustration={false}
      />

      <section className="section section--cream">
        <div className="container">
          <SectionTitle
            label="Architecture"
            title="How the ecosystem fits together"
            subtitle="Bloom OS powers the customer experience — it is technology infrastructure, not a competing consumer brand."
          />
          <EcosystemFlow />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="products__list">
            {gridProducts.map((product, index) => (
              <div
                key={product.id}
                className={`products__item ${index % 2 === 1 ? 'products__item--reverse' : ''}`}
              >
                <ProductCard product={product} detailed />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
