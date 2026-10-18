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
import officeRoutes from '@/routes/offices';
import type { Office } from '@/types/office';

interface DeleteOfficeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    office: Office;
}

export function DeleteOfficeDialog({
    isOpen,
    onClose,
    office,
}: DeleteOfficeDialogProps) {
    const { delete: destroy, processing } = useForm();

    const onSubmit = () => {
        destroy(officeRoutes.destroy.url(office.id), {
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
                        delete the office{' '}
                        <span className="font-bold">{office.name}</span> from
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
                        {processing ? 'Deleting...' : 'Delete Office'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
