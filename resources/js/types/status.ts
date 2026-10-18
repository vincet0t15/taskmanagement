export interface Status {
    id: number;
    name: string;
    color: string;
    description: string | null;
    sort_order: number;
}

export type StatusCreateRequest = {
    name: string;
    color: string;
    description: string | null;
    sort_order: number;
};
