import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Can } from '@/components/can';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import permissionRoutes from '@/routes/permissions';
import type { PermissionItem } from '@/types';
import { CreatePermissionDialog } from './create';
import { DeletePermissionDialog } from './delete';
import { EditPermissionDialog } from './edit';

interface PermissionsIndexProps {
    permissions: PermissionItem[];
}

export default function PermissionsIndex({
    permissions,
}: PermissionsIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] =
        useState<PermissionItem | null>(null);

    const grouped = useMemo(() => {
        return permissions.reduce<Record<string, PermissionItem[]>>(
            (groups, permission) => {
                const [module] = permission.name.split('.');

                groups[module] = groups[module] ?? [];
                groups[module].push(permission);

                return groups;
            },
            {},
        );
    }, [permissions]);

    const handleEditClick = (permission: PermissionItem) => {
        setSelectedPermission(permission);
        setIsEditOpen(true);
    };

    const handleDeleteClick = (permission: PermissionItem) => {
        setSelectedPermission(permission);
        setIsDeleteOpen(true);
    };

    const modules = Object.entries(grouped);

    return (
        <>
            <Head title="Permissions" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Permission Management"
                    description="Overview and maintenance of all permissions grouped by module."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Can permission="permissions.create">
                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Create Permission
                        </Button>
                    </Can>
                </div>

                {modules.length > 0 ? (
                    modules.map(([module, perms]) => (
                        <div
                            key={module}
                            className="w-full overflow-hidden rounded-sm border shadow-sm"
                        >
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="font-bold text-primary capitalize">
                                            {module.replace(/-/g, ' ')}
                                        </TableHead>
                                        <TableHead className="text-right font-bold text-primary">
                                            Action
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {perms.map((permission) => (
                                        <TableRow
                                            key={permission.id}
                                            className="text-sm hover:bg-muted/30"
                                        >
                                            <TableCell>
                                                <span className="flex items-center gap-2 text-sm">
                                                    {permission.name}
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {permission.name
                                                            .split('.')
                                                            .slice(1)
                                                            .join('.') || 'all'}
                                                    </Badge>
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Can permission="permissions.edit">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                            onClick={() =>
                                                                handleEditClick(
                                                                    permission,
                                                                )
                                                            }
                                                            title="Edit"
                                                            aria-label={`Edit ${permission.name}`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Can>
                                                    <Can permission="permissions.delete">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    permission,
                                                                )
                                                            }
                                                            title="Delete"
                                                            aria-label={`Delete ${permission.name}`}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </Can>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ))
                ) : (
                    <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="py-3 text-center text-gray-500">
                                        No permissions found.
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {isCreateOpen && (
                <CreatePermissionDialog
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                />
            )}

            {isEditOpen && selectedPermission && (
                <EditPermissionDialog
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    permission={selectedPermission}
                />
            )}

            {isDeleteOpen && selectedPermission && (
                <DeletePermissionDialog
                    isOpen={isDeleteOpen}
                    onClose={() => setIsDeleteOpen(false)}
                    permission={selectedPermission}
                />
            )}
        </>
    );
}

PermissionsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Permissions',
            href: permissionRoutes.index(),
        },
    ],
};
