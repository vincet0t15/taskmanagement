interface DonutGaugeProps {
    value: number;
    label?: string;
    color?: string;
    size?: number;
    thickness?: number;
}

/**
 * A circular gauge that fills proportionally to `value` (0-100). Built from a
 * single stroked circle whose dash offset hides the unfilled portion, so it
 * needs no chart library.
 */
export function DonutGauge({
    value,
    label,
    color = '#2563EB',
    size = 160,
    thickness = 12,
}: DonutGaugeProps) {
    const clamped = Math.min(100, Math.max(0, value));
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const filled = (clamped / 100) * circumference;

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="-rotate-90"
                aria-hidden="true"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={thickness}
                    className="text-muted"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={thickness}
                    strokeLinecap="round"
                    strokeDasharray={`${filled} ${circumference - filled}`}
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold tabular-nums">
                    {clamped}%
                </span>
                {label && (
                    <span className="text-xs text-muted-foreground">
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
}
