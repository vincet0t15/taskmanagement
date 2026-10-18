import { useForm } from '@inertiajs/react';
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
import permissionRoutes from '@/routes/permissions';
import type { PermissionItem } from '@/types';

interface DeletePermissionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    permission: PermissionItem;
}

export function DeletePermissionDialog({
    isOpen,
    onClose,
    permission,
}: DeletePermissionDialogProps) {
    const { delete: destroy, processing } = useForm();

    const onSubmit = () => {
        destroy(permissionRoutes.destroy.url(permission.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="rounded-md">
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the permission{' '}
                        <span className="font-bold">{permission.name}</span>{' '}
                        from every role that uses it.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={processing}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={onSubmit}
                        disabled={processing}
                    >
                        {processing ? 'Deleting...' : 'Delete Permission'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
