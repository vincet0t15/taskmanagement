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
import type { PermissionCreateRequest } from '@/types';

interface CreatePermissionDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreatePermissionDialog({
    isOpen,
    onClose,
}: CreatePermissionDialogProps) {
    const { data, setData, post, reset, errors, processing } =
        useForm<PermissionCreateRequest>({
            name: '',
        });

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(permissionRoutes.store.url(), {
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
                        <DialogTitle>Create Permission</DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a new permission using the{' '}
                            <code className="font-mono text-xs text-foreground">
                                module.action
                            </code>{' '}
                            format (e.g. reports.view).
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2 py-4">
                        <Label htmlFor="permission-name">Name</Label>
                        <Input
                            id="permission-name"
                            name="name"
                            placeholder="e.g. reports.view"
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
                            Create Permission
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
