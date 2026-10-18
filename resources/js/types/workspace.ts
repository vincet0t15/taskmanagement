export interface Workspace {
    id: number;
    name: string;
    slug: string;
    color: string;
    description: string | null;
}

export type WorkspaceCreateRequest = {
    name: string;
    slug: string;
    color: string;
    description: string | null;
};
