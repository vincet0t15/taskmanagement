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
import workspaceRoutes from '@/routes/workspaces';
import type { Workspace } from '@/types/workspace';

interface DeleteWorkspaceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    workspace: Workspace;
}

export function DeleteWorkspaceDialog({
    isOpen,
    onClose,
    workspace,
}: DeleteWorkspaceDialogProps) {
    const { delete: destroy, processing } = useForm();

    const onSubmit = () => {
        destroy(workspaceRoutes.destroy.url(workspace.id), {
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
                        delete the workspace{' '}
                        <span className="font-bold">{workspace.name}</span> from
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
                        {processing ? 'Deleting...' : 'Delete Workspace'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
