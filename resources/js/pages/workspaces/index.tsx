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
import workspaceRoutes from '@/routes/workspaces';
import type { PaginatedDataResponse } from '@/types/pagination';
import type { Workspace } from '@/types/workspace';
import { CreateWorkspaceDialog } from './create';
import { DeleteWorkspaceDialog } from './delete';
import { EditWorkspaceDialog } from './edit';

interface IndexProps {
    workspaces: PaginatedDataResponse<Workspace>;
    filters: {
        search?: string;
    };
}

export default function Index({ workspaces, filters }: IndexProps) {
    const { data, setData } = useForm({
        search: filters.search ?? '',
    });

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [selectedWorkspace, setSelectedWorkspace] =
        useState<Workspace | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleEditClick = (workspace: Workspace) => {
        setSelectedWorkspace(workspace);
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (workspace: Workspace) => {
        setSelectedWorkspace(workspace);
        setOpenDeleteDialog(true);
    };

    const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            router.get(
                workspaceRoutes.index.url(),
                { search: data.search },
                { preserveState: true, preserveScroll: true },
            );
        }
    };

    return (
        <>
            <Head title="Workspaces" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Workspace Management"
                    description="Overview and maintenance of all workspaces."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button onClick={() => setOpenCreateDialog(true)}>
                        <PlusIcon className="h-4 w-4" />
                        Create Workspace
                    </Button>

                    <div className="relative w-full sm:w-[250px]">
                        <Label htmlFor="search" className="sr-only">
                            Search
                        </Label>
                        <Input
                            id="search"
                            placeholder="Search the workspaces..."
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
                                    Color
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Name
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Slug
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Description
                                </TableHead>
                                <TableHead className="text-right font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {workspaces.data.length > 0 ? (
                                workspaces.data.map((workspace) => (
                                    <TableRow
                                        key={workspace.id}
                                        className="text-sm hover:bg-muted/30"
                                    >
                                        <TableCell>
                                            <span
                                                className="inline-block h-4 w-8 rounded-sm border shadow-sm"
                                                style={{
                                                    backgroundColor:
                                                        workspace.color,
                                                }}
                                                title={workspace.color}
                                            />
                                        </TableCell>
                                        <TableCell className="text-sm font-medium">
                                            {workspace.name}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {workspace.slug}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {workspace.description || (
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
                                                        handleEditClick(
                                                            workspace,
                                                        )
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
                                                            workspace,
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
                                        colSpan={5}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination data={workspaces} />
            </div>

            {openCreateDialog && (
                <CreateWorkspaceDialog
                    isOpen={openCreateDialog}
                    onClose={() => setOpenCreateDialog(false)}
                />
            )}

            {openEditDialog && selectedWorkspace && (
                <EditWorkspaceDialog
                    isOpen={openEditDialog}
                    onClose={() => setOpenEditDialog(false)}
                    workspace={selectedWorkspace}
                />
            )}

            {openDeleteDialog && selectedWorkspace && (
                <DeleteWorkspaceDialog
                    isOpen={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    workspace={selectedWorkspace}
                />
            )}
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Workspaces',
            href: workspaceRoutes.index(),
        },
    ],
};
