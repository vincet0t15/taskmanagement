export interface Office {
    id: number;
    name: string;
    code: string;
}

export type OfficeCreateRequest = {
    name: string;
    code: string;
};
