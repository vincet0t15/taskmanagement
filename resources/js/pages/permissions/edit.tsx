import { useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
import permissionRoutes from '@/routes/permissions';
import type { PermissionCreateRequest, PermissionItem } from '@/types';

interface EditPermissionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    permission: PermissionItem;
}

export function EditPermissionDialog({
    isOpen,
    onClose,
    permission,
}: EditPermissionDialogProps) {
    const { data, setData, put, reset, errors, processing } =
        useForm<PermissionCreateRequest>({
            name: permission.name,
        });

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        put(permissionRoutes.update.url(permission.id), {
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
            <DialogContent className="rounded-md sm:max-w-md">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Permission</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the permission name.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2 py-4">
                        <Label htmlFor="permission-name">Name</Label>
                        <Input
                            id="permission-name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
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
                            Update Permission
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
