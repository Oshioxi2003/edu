export default function Skeleton({ className = '', variant = 'rect' }) {
  const variants = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div className={`skeleton ${variants[variant]} ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="w-full h-48" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
      <Skeleton className="w-full h-2" />
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}

