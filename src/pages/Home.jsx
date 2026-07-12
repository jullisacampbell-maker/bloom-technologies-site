import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Mission from '../components/Mission';
import FounderSection from '../components/FounderSection';
import WaitlistForm from '../components/WaitlistForm';
import SocialLinks from '../components/SocialLinks';
import SectionTitle from '../components/SectionTitle';
import { products } from '../data/products';
import './Home.css';

export default function Home() {
  return (
    <div className="page-enter">
      <Hero
        headline="Technology designed to help families flourish."
        subheadline="Bloom Technologies is building thoughtful AI-powered software that helps families organize, learn, and grow together."
        primaryCta={{ label: 'Become a Founding Family', to: '/#founding-family' }}
        secondaryCta={{ label: 'Explore Our Products', to: '/products' }}
      />

      <section className="section">
        <div className="container">
          <SectionTitle
            label="Our Ecosystem"
            title="Products built for family life"
            subtitle="Three thoughtful products, one shared vision — helping families organize, learn, and flourish together."
          />

          <div className="home__products">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Mission />

      <FounderSection />

      <WaitlistForm />

      <section className="home__social section section--cream">
        <div className="container" style={{ textAlign: 'center' }}>
          <SectionTitle
            label="Connect"
            title="Follow our journey"
            subtitle="Stay connected as we build the future of family technology."
          />
          <SocialLinks />
        </div>
      </section>
    </div>
  );
}
