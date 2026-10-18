import { Head } from '@inertiajs/react';
import { Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
import roleRoutes from '@/routes/roles';
import type { Role } from '@/types';
import { CreateRoleDialog } from './create';
import { DeleteRoleDialog } from './delete';
import { EditRoleDialog } from './edit';

interface RolesIndexProps {
    roles: Role[];
    permissions: string[];
}

export const PROTECTED_ROLE = 'Super Admin';

export default function RolesIndex({ roles, permissions }: RolesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const handleEditClick = (role: Role) => {
        setSelectedRole(role);
        setIsEditOpen(true);
    };

    const handleDeleteClick = (role: Role) => {
        setSelectedRole(role);
        setIsDeleteOpen(true);
    };

    return (
        <>
            <Head title="Roles" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Role Management"
                    description="Overview and maintenance of all roles and their permissions."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Can permission="roles.create">
                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Create Role
                        </Button>
                    </Can>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold text-primary">
                                    Name
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Permissions
                                </TableHead>
                                <TableHead className="text-right font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.length > 0 ? (
                                roles.map((role) => (
                                    <TableRow
                                        key={role.id}
                                        className="text-sm hover:bg-muted/30"
                                    >
                                        <TableCell>
                                            <span className="flex items-center gap-2 text-sm font-medium">
                                                <ShieldCheck
                                                    className="size-4 shrink-0 text-muted-foreground"
                                                    aria-hidden="true"
                                                />
                                                {role.name}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {role.permissions_count}{' '}
                                                    {role.permissions_count ===
                                                    1
                                                        ? 'permission'
                                                        : 'permissions'}
                                                </Badge>
                                                {role.name ===
                                                    PROTECTED_ROLE && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        full access
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {role.name !== PROTECTED_ROLE && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Can permission="roles.edit">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                            onClick={() =>
                                                                handleEditClick(
                                                                    role,
                                                                )
                                                            }
                                                            title="Edit"
                                                            aria-label={`Edit ${role.name}`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Can>
                                                    <Can permission="roles.delete">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    role,
                                                                )
                                                            }
                                                            title="Delete"
                                                            aria-label={`Delete ${role.name}`}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </Can>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No roles found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {isCreateOpen && (
                <CreateRoleDialog
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    permissions={permissions}
                />
            )}

            {isEditOpen && selectedRole && (
                <EditRoleDialog
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    role={selectedRole}
                    permissions={permissions}
                />
            )}

            {isDeleteOpen && selectedRole && (
                <DeleteRoleDialog
                    isOpen={isDeleteOpen}
                    onClose={() => setIsDeleteOpen(false)}
                    role={selectedRole}
                />
            )}
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Roles',
            href: roleRoutes.index(),
        },
    ],
};
