export interface Employee {
    id: number;
    name: string;
    username: string;
    office: string | null;
    roles: string[];
    created_at: string | null;
}

export type EmployeeCreateRequest = {
    name: string;
    username: string;
    password: string;
    password_confirmation: string;
    office_id: number | null;
    role: string | null;
};
