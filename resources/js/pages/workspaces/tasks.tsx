import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    ChevronLeft,
    FileText,
    ListTodo,
    Plus,
    Share2,
} from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import workspaceRoutes from '@/routes/workspaces';
import type { Status } from '@/types/status';
import type { Task } from '@/types/task';
import type { Workspace, WorkspaceDashboard } from '@/types/workspace';
import { CreateTaskDialog } from './task-create';

interface TasksProps {
    workspace: Workspace;
    dashboard: WorkspaceDashboard;
    tasks: Task[];
    statuses: Status[];
}

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
    icon,
}: {
    label: string;
    value: number | string;
    trend?: number;
    icon?: React.ReactNode;
}) {
    const isUp = trend !== undefined && trend >= 0;

    return (
        <Card className="gap-2 py-4">
            <CardHeader className="pb-0">
                <CardDescription className="flex items-center gap-2">
                    {icon}
                    {label}
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <div className="text-2xl font-semibold tabular-nums">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                {trend !== undefined && (
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
                )}
            </CardContent>
        </Card>
    );
}

export default function Tasks({
    workspace,
    dashboard,
    tasks,
    statuses,
}: TasksProps) {
    const [openCreateTask, setOpenCreateTask] = useState(false);

    const totalTasks =
        dashboard.stats.find((s) => s.label === 'Total Tasks')?.value ?? 0;
    const completed =
        dashboard.stats.find((s) => s.label === 'Completed')?.value ?? 0;
    const inProgress =
        dashboard.stats.find((s) => s.label === 'In Progress')?.value ?? 0;
    const overdue =
        dashboard.stats.find((s) => s.label === 'Overdue')?.value ?? 0;
    const progress =
        totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

    return (
        <>
            <Head title={`${workspace.name} - Tasks`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <Link
                        href={workspaceRoutes.index()}
                        className="mb-1 inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="size-4" />
                        Back to workspaces
                    </Link>
                </div>

                {/* Header matching Project Detail */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="space-y-1">
                        <Heading
                            title={workspace.name}
                            description={
                                workspace.description ??
                                'Workspace tasks and activities'
                            }
                            variant="small"
                        />
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span>On track</span>
                            <span>·</span>
                            <span>23 days to deadline</span>
                            <span>·</span>
                            <span>Started Jan 8, 2026</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Share2 className="mr-2 size-4" />
                            Share
                        </Button>
                        <Button variant="outline" size="sm">
                            <Plus className="mr-2 size-4" />
                            Add note
                        </Button>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Total Tasks"
                        value={totalTasks}
                        trend={
                            dashboard.stats.find(
                                (s) => s.label === 'Total Tasks',
                            )?.trend
                        }
                        icon={<FileText className="size-4" />}
                    />
                    <StatCard
                        label="In Progress"
                        value={inProgress}
                        trend={
                            dashboard.stats.find(
                                (s) => s.label === 'In Progress',
                            )?.trend
                        }
                    />
                    <StatCard
                        label="Completed"
                        value={completed}
                        trend={
                            dashboard.stats.find((s) => s.label === 'Completed')
                                ?.trend
                        }
                    />
                    <StatCard
                        label="Overdue"
                        value={overdue}
                        trend={
                            dashboard.stats.find((s) => s.label === 'Overdue')
                                ?.trend
                        }
                        icon={<Calendar className="size-4" />}
                    />
                </div>

                {/* Project progress summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Project progress · {completed} of {totalTasks} tasks
                            done
                        </CardTitle>
                        <CardDescription className="tabular-nums">
                            {progress}%
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs: Overview/Tasks/Files/Brief/Timeline/Activity */}
                <Tabs defaultValue="tasks" className="space-y-4">
                    <TabsList className="justify-start overflow-x-auto">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        <TabsTrigger value="files">Files</TabsTrigger>
                        <TabsTrigger value="brief">Brief</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>About this workspace</CardTitle>
                                <CardDescription>
                                    {workspace.description ||
                                        'No description provided.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Total Tasks
                                        </span>
                                        <span className="tabular-nums">
                                            {totalTasks}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Completed
                                        </span>
                                        <span className="tabular-nums">
                                            {completed}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            In Progress
                                        </span>
                                        <span className="tabular-nums">
                                            {inProgress}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Overdue
                                        </span>
                                        <span className="tabular-nums">
                                            {overdue}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Workspace
                                        </span>
                                        <span className="font-medium">
                                            {workspace.name}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tasks" className="space-y-4">
                        <Card>
                            <CardHeader className="flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Tasks</CardTitle>
                                    <CardDescription>
                                        {tasks.length} of {totalTasks} ·{' '}
                                        {completed} done
                                    </CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => setOpenCreateTask(true)}
                                >
                                    <Plus className="mr-2 size-4" />
                                    New Task
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {tasks.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-10 text-center">
                                        <ListTodo className="size-8 text-muted-foreground" />
                                        <p className="text-sm font-medium">
                                            No tasks yet
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Create the first task for{' '}
                                            {workspace.name}.
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setOpenCreateTask(true)
                                            }
                                        >
                                            <Plus className="mr-2 size-4" />
                                            New Task
                                        </Button>
                                    </div>
                                ) : (
                                    tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex flex-col justify-between gap-2 rounded-md border p-3 sm:flex-row sm:items-center"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">
                                                        {task.name}
                                                    </p>
                                                    
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {task.due
                                                        ? `Due ${task.due}`
                                                        : 'No due date'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-[120px] overflow-hidden rounded-full bg-muted">
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
                                                {/* Show multiple assignees */}
                                                {task.assignees?.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {task.assignees.map((user, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-0.5 text-xs rounded bg-primary/20 text-primary"
                                                            >
                                                                {user.name ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : ''}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <Avatar className="size-6">
                                                        <AvatarImage />
                                                        <AvatarFallback className="text-xs">
                                                            {task.assignee
                                                                .split(' ')
                                                                .map((n) => n[0])
                                                                .join('')
                                                                .slice(0, 2)
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="files">
                        <Card>
                            <CardHeader>
                                <CardTitle>Files</CardTitle>
                                <CardDescription>
                                    Attachments for this workspace
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                                    <FileText className="size-10 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        No files uploaded yet
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="brief">
                        <Card>
                            <CardHeader>
                                <CardTitle>Brief</CardTitle>
                                <CardDescription>
                                    Project brief and objectives
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {workspace.description ||
                                        'No brief available for this workspace.'}
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Team and Project Info */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex-row items-center justify-between">
                            <div>
                                <CardTitle>Team</CardTitle>
                                <CardDescription>
                                    Members assigned
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                Add
                            </Button>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                            {dashboard.recent_tasks.slice(0, 4).map((task) => (
                                <div
                                    key={task.assignee}
                                    className="flex items-center gap-2 rounded-md border p-2"
                                >
                                    <Avatar className="size-8">
                                        <AvatarImage />
                                        <AvatarFallback>
                                            {task.assignee
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium">
                                            {task.assignee}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {task.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Project Info</CardTitle>
                            <CardDescription>Workspace details</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Workspace
                                </span>
                                <span className="font-medium">
                                    {workspace.name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Industry
                                </span>
                                <span className="text-muted-foreground">
                                    Government
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Started
                                </span>
                                <span className="text-muted-foreground">
                                    Jan 8, 2026
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Deadline
                                </span>
                                <span className="text-muted-foreground">
                                    Feb 28, 2026
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Type
                                </span>
                                <span className="text-muted-foreground">
                                    Tasking
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {openCreateTask && (
                <CreateTaskDialog
                    isOpen={openCreateTask}
                    onClose={() => setOpenCreateTask(false)}
                    workspace={workspace}
                    statuses={statuses}
                />
            )}
        </>
    );
}

Tasks.layout = (data: { workspace: Workspace }) => ({
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
