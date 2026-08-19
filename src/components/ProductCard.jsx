import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCta({ product }) {
  if (!product.href) {
    return (
      <button type="button" className="product-card__cta btn btn--secondary btn--small" disabled>
        {product.cta || 'Learn More'}
      </button>
    );
  }

  if (product.external) {
    return (
      <a
        href={product.href}
        className="product-card__cta btn btn--secondary btn--small"
        target="_blank"
        rel="noopener noreferrer"
      >
        {product.cta || 'Learn More →'}
      </a>
    );
  }

  return (
    <Link to={product.href} className="product-card__cta btn btn--secondary btn--small">
      {product.cta || 'Learn More →'}
    </Link>
  );
}

export default function ProductCard({ product, detailed = false }) {
  const isComingSoon = product.status === 'coming-soon';
  const badgeClass = isComingSoon ? 'badge badge--coming-soon' : 'badge badge--live';
  const badgeLabel = isComingSoon ? 'Coming Soon' : 'Available';

  return (
    <article className={`product-card ${detailed ? 'product-card--detailed' : ''}`}>
      <div className="product-card__header">
        <span className="product-card__icon">{product.icon}</span>
        <span className={badgeClass}>{badgeLabel}</span>
      </div>

      <h3 className="product-card__name">{product.name}</h3>
      <p className="product-card__tagline">{product.tagline}</p>

      {detailed ? (
        <>
          <p className="product-card__description">{product.description}</p>
          {product.highlights && (
            <div className="product-card__features">
              <h4 className="product-card__features-title">Includes</h4>
              <ul className="product-card__features-list">
                {product.highlights.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          <ProductCta product={product} />
        </>
      ) : (
        <>
          <p className="product-card__description">{product.description}</p>
          <ProductCta product={product} />
        </>
      )}
    </article>
  );
}
