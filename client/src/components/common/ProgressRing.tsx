type ProgressRingProps = {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  bg?: string;
};

export function ProgressRing({ value, size = 80, stroke = 6, color = "#2563EB", bg = "#E2E8F0" }: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke={bg} strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }} />
    </svg>
  );
}
