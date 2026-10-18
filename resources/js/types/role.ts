export type Role = {
    id: number;
    name: string;
    permissions: string[];
    permissions_count: number;
};

export type RoleCreateRequest = {
    name: string;
    permissions: string[];
};

export type PermissionItem = {
    id: number;
    name: string;
    guard_name: string;
};

export type PermissionCreateRequest = {
    name: string;
};
