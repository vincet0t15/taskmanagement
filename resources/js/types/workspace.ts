export interface Workspace {
    id: number;
    name: string;
    description: string | null;
}

export type WorkspaceCreateRequest = {
    name: string;
    description: string | null;
};

export type DashboardStat = {
    label: string;
    value: number;
    trend: number;
};

export type DashboardSeries = {
    name: string;
    data: number[];
};

export type DashboardReminder = {
    priority: 'low' | 'medium' | 'high';
    due: string;
    title: string;
    category: string;
};

export type DashboardTask = {
    id: number;
    name: string;
    assignee: string;
    status: string;
    progress: number;
    due: string;
};

export type DashboardHighlight = {
    label: string;
    value: string;
};

export type WorkspaceDashboard = {
    stats: DashboardStat[];
    overview: {
        labels: string[];
        series: DashboardSeries[];
    };
    monthly: {
        labels: string[];
        data: number[];
    };
    efficiency: {
        value: number;
        label: string;
    };
    highlights: DashboardHighlight[];
    reminders: DashboardReminder[];
    recent_tasks: DashboardTask[];
};
