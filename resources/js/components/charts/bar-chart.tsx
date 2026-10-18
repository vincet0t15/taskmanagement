interface BarChartProps {
    labels: string[];
    data: number[];
    color?: string;
}

/**
 * A simple SVG bar chart. Bars are drawn in a flat viewBox that stretches to
 * the container, with rounded tops and the value sitting above each bar.
 */
export function BarChart({ labels, data, color = '#2563EB' }: BarChartProps) {
    const width = 100;
    const height = 100;
    const max = Math.max(1, ...data);

    const slot = width / Math.max(1, data.length);
    // Leave a small gap between bars so they do not touch when stretched.
    const barWidth = slot * 0.55;
    const offset = (slot - barWidth) / 2;

    return (
        <div>
            <div className="h-[180px] w-full">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="none"
                    className="h-full w-full"
                    aria-hidden="true"
                >
                    {[0, 25, 50, 75, 100].map((y) => (
                        <line
                            key={y}
                            x1="0"
                            x2={width}
                            y1={y}
                            y2={y}
                            stroke="currentColor"
                            strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                            className="text-border"
                            strokeDasharray="3 3"
                        />
                    ))}

                    {data.map((value, index) => {
                        const barHeight = (value / max) * (height - 4);
                        const x = index * slot + offset;

                        return (
                            <rect
                                key={index}
                                x={x}
                                y={height - barHeight}
                                width={barWidth}
                                height={barHeight}
                                rx="1.5"
                                fill={color}
                                opacity="0.85"
                            />
                        );
                    })}
                </svg>
            </div>

            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                {labels.map((label, index) => (
                    <span key={`${label}-${index}`}>{label}</span>
                ))}
            </div>
        </div>
    );
}
