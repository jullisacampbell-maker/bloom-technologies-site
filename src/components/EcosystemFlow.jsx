import { ecosystemFlow } from '../data/ecosystem';
import './EcosystemFlow.css';

export default function EcosystemFlow() {
  return (
    <div className="ecosystem-flow" aria-label="Bloom product ecosystem">
      {ecosystemFlow.map((step, index) => (
        <div key={step.label} className="ecosystem-flow__step">
          {index > 0 && (
            <div className="ecosystem-flow__connector" aria-hidden="true">
              <span className="ecosystem-flow__line" />
              <span className="ecosystem-flow__arrow">↓</span>
            </div>
          )}
          <div className={`ecosystem-flow__node ecosystem-flow__node--${step.tier}`}>
            {step.label}
          </div>
        </div>
      ))}
    </div>
  );
}
