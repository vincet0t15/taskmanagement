import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowRight, PencilIcon, PlusIcon, Search, Trash2 } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

                    <Button onClick={() => setOpenCreateDialog(true)}>
                        <PlusIcon className="h-4 w-4" />
                        Create Workspace
                    </Button>
                </div>

                {workspaces.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
                        {workspaces.data.map((workspace) => (
                            <div
                                key={workspace.id}
                                className="group/card flex flex-col gap-1 overflow-hidden rounded-xl bg-muted/40 text-sm text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-2 px-4 py-3">
                                    <div className="flex min-w-0 flex-col gap-1">
                                        <Link
                                            href={workspaceRoutes.show.url(
                                                workspace.id,
                                            )}
                                            className="truncate text-sm leading-snug font-semibold underline-offset-4 hover:underline"
                                            title="Open workspace tasks"
                                        >
                                            {workspace.name}
                                        </Link>
                                        <p className="text-muted-foreground truncate text-sm">
                                            {workspace.description ??
                                                'No description'}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                            onClick={() =>
                                                handleEditClick(workspace)
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
                                                handleDeleteClick(workspace)
                                            }
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col justify-end gap-4 rounded-lg bg-card p-4 shadow-xs ring-1 ring-foreground/5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm">
                                            Tasks
                                        </span>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="h-8"
                                        >
                                            <Link
                                                href={workspaceRoutes.show.url(
                                                    workspace.id,
                                                )}
                                                title="Open workspace tasks"
                                            >
                                                View
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed py-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            No data available.
                        </p>
                        <Button
                            variant="link"
                            onClick={() => setOpenCreateDialog(true)}
                        >
                            Create your first workspace
                        </Button>
                    </div>
                )}

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
