import { blogTopics } from '../data/products';
import './Blog.css';

export default function Blog() {
  return (
    <div className="page-enter">
      <section className="blog section">
        <div className="container container--narrow">
          <div className="blog__card">
            <span className="blog__icon">📖</span>
            <h1 className="blog__title">Bloom Journal</h1>
            <p className="blog__status">Coming Soon</p>
            <p className="blog__description">
              We&apos;re preparing a space to share our journey — stories about
              family life, technology, and building Bloom from the ground up.
            </p>

            <div className="blog__topics">
              <h2 className="blog__topics-title">Future articles about</h2>
              <div className="blog__topics-list">
                {blogTopics.map((topic) => (
                  <span key={topic} className="blog__topic">{topic}</span>
                ))}
              </div>
            </div>

            {/* TODO: Integrate CMS for blog content */}
            {/* TODO: Build blog engine with article pages */}
          </div>
        </div>
      </section>
    </div>
  );
}
