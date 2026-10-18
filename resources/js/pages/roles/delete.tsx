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
import roleRoutes from '@/routes/roles';
import type { Role } from '@/types';

interface DeleteRoleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    role: Role;
}

export function DeleteRoleDialog({
    isOpen,
    onClose,
    role,
}: DeleteRoleDialogProps) {
    const { delete: destroy, processing } = useForm();

    const onSubmit = () => {
        destroy(roleRoutes.destroy.url(role.id), {
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
                        delete the role{' '}
                        <span className="font-bold">{role.name}</span> and
                        remove it from every user assigned to it.
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
                        {processing ? 'Deleting...' : 'Delete Role'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
