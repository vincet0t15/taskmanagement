import { useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import type { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import roleRoutes from '@/routes/roles';
import type { Role, RoleCreateRequest } from '@/types';
import { groupPermissions } from './create';

interface EditRoleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    role: Role;
    permissions: string[];
}

export function EditRoleDialog({
    isOpen,
    onClose,
    role,
    permissions,
}: EditRoleDialogProps) {
    const { data, setData, put, reset, errors, processing } =
        useForm<RoleCreateRequest>({
            name: role.name,
            permissions: role.permissions,
        });

    const grouped = useMemo(() => groupPermissions(permissions), [permissions]);

    const togglePermission = (permission: string) => {
        const current = data.permissions;

        setData(
            'permissions',
            current.includes(permission)
                ? current.filter((item) => item !== permission)
                : [...current, permission],
        );
    };

    const toggleGroup = (module: string) => {
        const modulePermissions = grouped[module];
        const current = data.permissions;
        const allSelected =
            modulePermissions.length > 0 &&
            modulePermissions.every((permission) =>
                current.includes(permission),
            );

        setData(
            'permissions',
            allSelected
                ? current.filter(
                      (permission) => !modulePermissions.includes(permission),
                  )
                : [...new Set([...current, ...modulePermissions])],
        );
    };

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        put(roleRoutes.update.url(role.id), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
            reset();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="rounded-md sm:max-w-lg">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the role name and its permissions.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="role-name">Name</Label>
                            <Input
                                id="role-name"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Permissions</Label>
                            <div className="max-h-64 overflow-y-auto rounded-md border p-3">
                                <div className="flex flex-col gap-3">
                                    {Object.entries(grouped).map(
                                        ([module, perms]) => (
                                            <div
                                                key={module}
                                                className="flex flex-col gap-1.5"
                                            >
                                                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                                                    <Checkbox
                                                        checked={
                                                            data.permissions
                                                                .length > 0 &&
                                                            perms.every((p) =>
                                                                data.permissions.includes(
                                                                    p,
                                                                ),
                                                            )
                                                        }
                                                        onCheckedChange={() =>
                                                            toggleGroup(module)
                                                        }
                                                    />
                                                    <span className="capitalize">
                                                        {module.replace(
                                                            /-/g,
                                                            ' ',
                                                        )}
                                                    </span>
                                                </label>
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 pl-6">
                                                    {perms.map((permission) => (
                                                        <label
                                                            key={permission}
                                                            className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"
                                                        >
                                                            <Checkbox
                                                                checked={data.permissions.includes(
                                                                    permission,
                                                                )}
                                                                onCheckedChange={() =>
                                                                    togglePermission(
                                                                        permission,
                                                                    )
                                                                }
                                                            />
                                                            {permission
                                                                .split('.')
                                                                .slice(1)
                                                                .join('.') ||
                                                                permission}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                            <InputError message={errors.permissions} />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Update Role
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
