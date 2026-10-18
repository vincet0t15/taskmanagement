export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedDataResponse<dataFromDatabase> {
    current_page: number;
    data: dataFromDatabase[];
    first_page_url?: string | null;
    from: number;
    last_page: number;
    last_page_url?: string | null;
    links: PaginationLink[];
    next_page_url?: string | null;
    path: string;
    per_page: number;
    prev_page_url?: string | null;
    to: number;
    total: number;
}
