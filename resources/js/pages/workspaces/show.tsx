import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarClock,
    ChevronLeft,
} from 'lucide-react';
import { AreaChart } from '@/components/charts/area-chart';
import { BarChart } from '@/components/charts/bar-chart';
import { DonutGauge } from '@/components/charts/donut-gauge';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import workspaceRoutes from '@/routes/workspaces';
import type {
    DashboardReminder,
    Workspace,
    WorkspaceDashboard,
} from '@/types/workspace';

interface ShowProps {
    workspace: Workspace;
    dashboard: WorkspaceDashboard;
}

const PRIORITY_STYLES: Record<DashboardReminder['priority'], string> = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    high: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
};

/** Badge palette keyed by the seeded task statuses. */
const STATUS_STYLES: Record<string, string> = {
    'To Do': 'bg-muted text-muted-foreground',
    'In Progress':
        'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    'On Hold':
        'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    Completed:
        'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    Cancelled: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
};

function StatCard({
    label,
    value,
    trend,
}: {
    label: string;
    value: number;
    trend: number;
}) {
    const isUp = trend >= 0;

    return (
        <Card className="gap-2 py-4">
            <CardHeader className="pb-0">
                <CardDescription>{label}</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <div className="text-2xl font-semibold tabular-nums">
                    {value.toLocaleString()}
                </div>
                <div
                    className={`mt-1 flex items-center gap-1 text-xs ${
                        isUp
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                    }`}
                >
                    {isUp ? (
                        <ArrowUpRight className="size-3.5" />
                    ) : (
                        <ArrowDownRight className="size-3.5" />
                    )}
                    <span className="tabular-nums">
                        {Math.abs(trend).toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">
                        from last month
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Show({ workspace, dashboard }: ShowProps) {
    return (
        <>
            <Head title={`${workspace.name} Dashboard`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <Link
                        href={workspaceRoutes.index()}
                        className="mb-1 inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="size-4" />
                        Back to workspaces
                    </Link>
                    <Heading
                        title={`${workspace.name} Dashboard`}
                        description={
                            workspace.description ??
                            'Overview of activity in this workspace.'
                        }
                        variant="small"
                    />
                </div>

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {dashboard.stats.map((stat) => (
                        <StatCard
                            key={stat.label}
                            label={stat.label}
                            value={stat.value}
                            trend={stat.trend}
                        />
                    ))}
                </div>

                {/* Overview + efficiency */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Tasks Overview</CardTitle>
                            <CardDescription>
                                Daily new and completed tasks over the last 30
                                days.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AreaChart
                                labels={dashboard.overview.labels}
                                series={dashboard.overview.series}
                            />
                        </CardContent>
                    </Card>

                    <Card className="items-center">
                        <CardHeader className="items-center text-center">
                            <CardTitle>{dashboard.efficiency.label}</CardTitle>
                            <CardDescription>
                                How much work closes on time.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <DonutGauge value={dashboard.efficiency.value} />
                        </CardContent>
                    </Card>
                </div>

                {/* Monthly + highlights + reminders */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Monthly Completions</CardTitle>
                            <CardDescription>
                                Tasks closed per month, last 6 months.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarChart
                                labels={dashboard.monthly.labels}
                                data={dashboard.monthly.data}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Highlights</CardTitle>
                            <CardDescription>
                                Quick averages for this workspace.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {dashboard.highlights.map((highlight) => (
                                <div
                                    key={highlight.label}
                                    className="flex items-baseline justify-between border-b pb-2 last:border-0 last:pb-0"
                                >
                                    <span className="text-sm text-muted-foreground">
                                        {highlight.label}
                                    </span>
                                    <span className="text-lg font-semibold tabular-nums">
                                        {highlight.value}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Reminders</CardTitle>
                            <CardDescription>
                                Upcoming items in this workspace.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {dashboard.reminders.map((reminder, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3 rounded-md border p-3"
                                >
                                    <CalendarClock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={
                                                    PRIORITY_STYLES[
                                                        reminder.priority
                                                    ]
                                                }
                                                variant="secondary"
                                            >
                                                {reminder.priority}
                                            </Badge>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {reminder.category}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm">
                                            {reminder.title}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {reminder.due}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent tasks */}
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Tasks</CardTitle>
                            <CardDescription>
                                Latest tasks in this workspace.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="font-bold text-primary">
                                            Task
                                        </TableHead>
                                        <TableHead className="font-bold text-primary">
                                            Assignee
                                        </TableHead>
                                        <TableHead className="font-bold text-primary">
                                            Due Date
                                        </TableHead>
                                        <TableHead className="font-bold text-primary">
                                            Status
                                        </TableHead>
                                        <TableHead className="w-[180px] font-bold text-primary">
                                            Progress
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dashboard.recent_tasks.length > 0 ? (
                                        dashboard.recent_tasks.map((task) => (
                                            <TableRow
                                                key={task.id}
                                                className="text-sm hover:bg-muted/30"
                                            >
                                                <TableCell className="font-medium">
                                                    {task.name}
                                                </TableCell>
                                                <TableCell>
                                                    {task.assignee}
                                                </TableCell>
                                                <TableCell className="tabular-nums">
                                                    {task.due}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            STATUS_STYLES[
                                                                task.status
                                                            ]
                                                        }
                                                        variant="secondary"
                                                    >
                                                        {task.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                                            <div
                                                                className="h-full rounded-full bg-primary"
                                                                style={{
                                                                    width: `${task.progress}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="w-9 text-right text-xs text-muted-foreground tabular-nums">
                                                            {task.progress}%
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="py-3 text-center text-gray-500"
                                            >
                                                No tasks yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Show.layout = (data: { workspace: Workspace }) => ({
    breadcrumbs: [
        {
            title: 'Workspaces',
            href: workspaceRoutes.index(),
        },
        {
            title: data.workspace.name,
            href: workspaceRoutes.show.url(data.workspace.id),
        },
    ],
});
