export default function Page() {
  return (
    <section className="panel">
      <h2>Panel title</h2>
      <p className="panel-sub">Panel subtitle in muted text.</p>
      <div className="actions">
        <button type="button" className="primary">
          <span className="btn-content">Primary action</span>
        </button>
        <button type="button" className="secondary">
          Secondary action
        </button>
      </div>
    </section>
  );
}
