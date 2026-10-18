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
import statusRoutes from '@/routes/statuses';
import type { Status } from '@/types/status';

interface DeleteStatusDialogProps {
    isOpen: boolean;
    onClose: () => void;
    status: Status;
}

export function DeleteStatusDialog({
    isOpen,
    onClose,
    status,
}: DeleteStatusDialogProps) {
    const { delete: destroy, processing } = useForm();

    const onSubmit = () => {
        destroy(statusRoutes.destroy.url(status.id), {
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
                        delete the status{' '}
                        <span className="font-bold">{status.name}</span> from
                        our servers.
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
                        {processing ? 'Deleting...' : 'Delete Status'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
