import type { DashboardSeries } from '@/types/workspace';

/**
 * Convert a run of values into a smooth SVG path using a uniform Catmull-Rom
 * spline, so the area chart flows instead of looking like a jagged polyline.
 *
 * Coordinates live in the given width/height space; the caller supplies the
 * max so every series shares one scale.
 */
function buildSmoothPath(
    values: number[],
    width: number,
    height: number,
    max: number,
): string {
    if (values.length === 0) {
        return '';
    }

    const safeMax = max > 0 ? max : 1;
    const step = values.length > 1 ? width / (values.length - 1) : 0;

    const points = values.map(
        (value, index) =>
            [index * step, height - (value / safeMax) * height] as const,
    );

    if (points.length === 1) {
        return `M 0,${points[0][1]} L ${width},${points[0][1]}`;
    }

    let path = `M ${points[0][0]},${points[0][1]}`;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] ?? points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] ?? p2;

        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;

        path += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
    }

    return path;
}

/** One accent per series so the overlapping areas stay distinguishable. */
const SERIES_COLORS = ['#2563EB', '#16A34A'];

interface AreaChartProps {
    labels: string[];
    series: DashboardSeries[];
    height?: number;
}

export function AreaChart({ labels, series, height = 220 }: AreaChartProps) {
    // Flat viewBox + preserveAspectRatio="none" lets the SVG stretch to any
    // container width; non-scaling-stroke keeps the line weight even despite
    // the horizontal stretch.
    const width = 100;
    const chartHeight = 100;

    const max = Math.max(1, ...series.flatMap((s) => s.data));

    // Show a handful of labels rather than one per point, which would crowd a
    // 30-day series on narrow screens.
    const labelStride = Math.max(1, Math.ceil(labels.length / 8));

    return (
        <div>
            <div className="relative" style={{ height }}>
                <svg
                    viewBox={`0 0 ${width} ${chartHeight}`}
                    preserveAspectRatio="none"
                    className="h-full w-full"
                    aria-hidden="true"
                >
                    {/* Horizontal gridlines */}
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

                    {series.map((s, index) => {
                        const color =
                            SERIES_COLORS[index % SERIES_COLORS.length];
                        const linePath = buildSmoothPath(
                            s.data,
                            width,
                            chartHeight,
                            max,
                        );
                        const areaPath = linePath
                            ? `${linePath} L ${width},${chartHeight} L 0,${chartHeight} Z`
                            : '';

                        return (
                            <g key={s.name}>
                                <defs>
                                    <linearGradient
                                        id={`area-fill-${index}`}
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor={color}
                                            stopOpacity="0.25"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor={color}
                                            stopOpacity="0"
                                        />
                                    </linearGradient>
                                </defs>
                                <path
                                    d={areaPath}
                                    fill={`url(#area-fill-${index})`}
                                />
                                <path
                                    d={linePath}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="2"
                                    vectorEffect="non-scaling-stroke"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                {labels
                    .map((label, index) => ({ label, index }))
                    .filter(({ index }) => index % labelStride === 0)
                    .map(({ label, index }) => (
                        <span key={`${label}-${index}`}>{label}</span>
                    ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs">
                {series.map((s, index) => (
                    <span
                        key={s.name}
                        className="flex items-center gap-1.5 text-muted-foreground"
                    >
                        <span
                            className="size-2.5 rounded-full"
                            style={{
                                backgroundColor:
                                    SERIES_COLORS[index % SERIES_COLORS.length],
                            }}
                        />
                        {s.name}
                    </span>
                ))}
            </div>
        </div>
    );
}
