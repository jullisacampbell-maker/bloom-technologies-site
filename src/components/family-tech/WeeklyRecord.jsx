import { getWeeklyRecords, getWeeklyTotals } from '../../services/activityStorage';
import './WeeklyRecord.css';

export default function WeeklyRecord({ moduleId, title = 'Weekly record' }) {
  const records = getWeeklyRecords(moduleId);
  const totals = getWeeklyTotals(moduleId);

  if (records.length === 0) {
    return (
      <section className="weekly-record weekly-record--empty">
        <h3>{title}</h3>
        <p>No activities logged yet this week. Complete, skip, or move activities above.</p>
      </section>
    );
  }

  return (
    <section className="weekly-record">
      <div className="weekly-record__header">
        <h3>{title}</h3>
        <div className="weekly-record__totals">
          <span>{totals.completed} completed</span>
          <span>{totals.skipped} skipped</span>
          <span>{totals.moved} moved</span>
        </div>
      </div>
      <div className="weekly-record__table-wrap">
        <table className="weekly-record__table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Child</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.title || r.id}</td>
                <td>{r.childName || '—'}</td>
                <td>{r.category || r.blockType || '—'}</td>
                <td><span className={`weekly-record__status weekly-record__status--${r.status}`}>{r.status}</span></td>
                <td>{new Date(r.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
