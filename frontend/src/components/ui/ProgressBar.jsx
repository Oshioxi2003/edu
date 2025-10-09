export default function ProgressBar({ 
  progress = 0, 
  showLabel = true, 
  size = 'md',
  className = '' 
}) {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Tiến độ</span>
          <span className="text-sm font-semibold text-primary">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`progress-bar ${sizes[size]}`}>
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

