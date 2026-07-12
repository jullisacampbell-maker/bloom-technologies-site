import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import './Products.css';

export default function Products() {
  return (
    <div className="page-enter">
      <Hero
        headline="Our Products"
        subheadline="Thoughtful AI-powered software designed around the rhythms of real family life."
        compact
        showIllustration={false}
      />

      <section className="section">
        <div className="container">
          <div className="products__list">
            {products.map((product, index) => (
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
