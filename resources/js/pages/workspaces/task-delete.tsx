import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
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
import taskRoutes from '@/routes/tasks';
import type { Task } from '@/types/task';

interface DeleteTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
}

export function DeleteTaskDialog({ isOpen, onClose, task }: DeleteTaskDialogProps) {
    const { delete: destroy, processing } = useForm();

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!task) return;
        destroy(taskRoutes.destroy.url(task.id), {
            onSuccess: () => onClose(),
        });
    };

    if (!task) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="rounded-md sm:max-w-md">
                <form onSubmit={onSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Delete Task</DialogTitle>
                        <DialogDescription className="text-xs">
                            Are you sure you want to delete "{task?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="destructive" disabled={processing}>
                            Delete Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
