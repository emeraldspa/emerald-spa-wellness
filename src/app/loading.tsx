export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <span className="eyebrow text-ink/65">Loading</span>
    </div>
  );
}
