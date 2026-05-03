import './Loading.css';

function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <div className="loading-text">Loading game…</div>
    </div>
  );
}

export default Loading;
