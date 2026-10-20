export interface Task {
    id: number;
    name: string;
    assignee: string;
    status: string;
    progress: number;
    due: string | null;
    assignee_ids: number[];
}

export type TaskCreateRequest = {
    workspace_id: number;
    name: string;
    description: string | null;
    status_id: number;
    due_date: string | null;
    assignee_ids: number[];
};
