import { Head, router, useForm } from '@inertiajs/react';
import { PencilIcon, PlusIcon, Search, Trash2 } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import officeRoutes from '@/routes/offices';
import type { Office } from '@/types/office';
import type { PaginatedDataResponse } from '@/types/pagination';
import { CreateOfficeDialog } from './create';
import { DeleteOfficeDialog } from './delete';
import { EditOfficeDialog } from './edit';

interface IndexProps {
    offices: PaginatedDataResponse<Office>;
    filters: {
        search?: string;
    };
}

export default function Index({ offices, filters }: IndexProps) {
    const { data, setData } = useForm({
        search: filters.search ?? '',
    });

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleEditClick = (office: Office) => {
        setSelectedOffice(office);
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (office: Office) => {
        setSelectedOffice(office);
        setOpenDeleteDialog(true);
    };

    const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            router.get(
                officeRoutes.index.url(),
                { search: data.search },
                { preserveState: true, preserveScroll: true },
            );
        }
    };

    return (
        <>
            <Head title="Offices" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Office Management"
                    description="Overview and maintenance of all office entries."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button onClick={() => setOpenCreateDialog(true)}>
                        <PlusIcon className="h-4 w-4" />
                        Create Office
                    </Button>

                    <div className="relative w-full sm:w-[250px]">
                        <Label htmlFor="search" className="sr-only">
                            Search
                        </Label>
                        <Input
                            id="search"
                            placeholder="Search the offices..."
                            className="w-full pl-8"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                        />
                        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold text-primary">
                                    Name
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Code
                                </TableHead>
                                <TableHead className="text-right font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {offices.data.length > 0 ? (
                                offices.data.map((office) => (
                                    <TableRow
                                        key={office.id}
                                        className="text-sm hover:bg-muted/30"
                                    >
                                        <TableCell className="text-sm">
                                            {office.name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {office.code || (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                    onClick={() =>
                                                        handleEditClick(office)
                                                    }
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            office,
                                                        )
                                                    }
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination data={offices} />
            </div>

            {openCreateDialog && (
                <CreateOfficeDialog
                    isOpen={openCreateDialog}
                    onClose={() => setOpenCreateDialog(false)}
                />
            )}

            {openEditDialog && selectedOffice && (
                <EditOfficeDialog
                    isOpen={openEditDialog}
                    onClose={() => setOpenEditDialog(false)}
                    office={selectedOffice}
                />
            )}

            {openDeleteDialog && selectedOffice && (
                <DeleteOfficeDialog
                    isOpen={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    office={selectedOffice}
                />
            )}
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Offices',
            href: officeRoutes.index(),
        },
    ],
};
