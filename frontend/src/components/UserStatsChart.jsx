export default function UserStatsChart({ plays }) {
  const points = (plays || []).map((p, i) => ({
    x: i,
    y: typeof p.score === 'number' ? p.score : 0,
    date: p.date ? new Date(p.date) : null,
  }));

  const width = 520;
  const height = 180;
  const padding = 28;

  if (points.length === 0) {
    return <div className="emptyChart">No plays yet</div>;
  }

  const maxScore = Math.max(...points.map(p => p.y), 1);
  const stepX = (width - padding * 2) / Math.max(points.length - 1, 1);

  const toX = (i) => padding + i * stepX;
  const toY = (y) => height - padding - (y / maxScore) * (height - padding * 2);

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p.y)}`).join(' ');

  return (
    <div className="chartContainer">
      <svg width={width} height={height}>
        <path d={path} fill="none" stroke="#7aa8ff" strokeWidth="2" />
        {points.map((p, i) => (
          <circle key={i} cx={toX(i)} cy={toY(p.y)} r={3} fill="#b6caff" />
        ))}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#333" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#333" />
      </svg>
    </div>
  );
}
