import './ProductCard.css';

export default function ProductCard({ product, detailed = false }) {
  const badgeClass = product.statusType === 'coming-soon'
    ? 'badge badge--coming-soon'
    : 'badge badge--founder';

  return (
    <article className={`product-card ${detailed ? 'product-card--detailed' : ''}`}>
      <div className="product-card__header">
        <span className="product-card__icon">{product.icon}</span>
        <span className={badgeClass}>{product.status}</span>
      </div>

      <h3 className="product-card__name">{product.name}</h3>
      <p className="product-card__tagline">{product.tagline}</p>

      {detailed ? (
        <>
          <p className="product-card__description">{product.description}</p>
          <div className="product-card__features">
            <h4 className="product-card__features-title">Key Features</h4>
            <ul className="product-card__features-list">
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="product-card__roadmap">
            <h4 className="product-card__roadmap-title">Roadmap</h4>
            <ul className="product-card__roadmap-list">
              {product.roadmap.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="product-card__screenshot">
            <div className="product-card__screenshot-placeholder">
              <span>{product.icon}</span>
              <p>Screenshot Placeholder</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="product-card__description">{product.shortDescription}</p>
          {/* TODO: Link to individual product marketing pages */}
          <button className="product-card__cta btn btn--secondary btn--small">
            Learn More
          </button>
        </>
      )}
    </article>
  );
}
