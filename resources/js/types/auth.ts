export type User = {
    id: number;
    name: string;
    username: string;
    avatar?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
    roles: string[];
    permissions: string[];
};

export type SharedData = {
    name: string;
    auth: Auth;
    flash?: {
        type?: 'success' | 'info' | 'warning' | 'error';
        message?: string;
    };
    sidebarOpen: boolean;
    [key: string]: unknown;
};
