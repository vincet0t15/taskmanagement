import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useEffect } from 'react';
import { CustomComboBox } from '@/components/CustomComboBox';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { ComboboxMultipleExpandable } from '@/components/ui/combobox-multiple-expandable';
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
import { Textarea } from '@/components/ui/textarea';
import taskRoutes from '@/routes/tasks';
import type { Status } from '@/types/status';
import type { Task } from '@/types/task';
import type { Workspace } from '@/types/workspace';

interface EditTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    workspace: Workspace;
    task: Task | null;
    statuses: Status[];
    users?: Array<{ id: number; name: string; username: string }>;
}

function toDateInputValue(due: string | null): string {
    if (!due) return '';
    const parts = due.split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return due;
}

export function EditTaskDialog({
    isOpen,
    onClose,
    workspace,
    task,
    statuses,
    users = [],
}: EditTaskDialogProps) {
    const { data, setData, put, reset, errors, processing } = useForm({
        workspace_id: workspace.id,
        name: '',
        description: '',
        status_id: 0,
        due_date: '',
        assignee_ids: [] as number[],
    });

    useEffect(() => {
        if (task) {
            setData({
                workspace_id: workspace.id,
                name: task.name,
                description: task.description ?? '',
                status_id: statuses.find((s) => s.name === task.status)?.id ?? 0,
                due_date: toDateInputValue(task.due),
                assignee_ids: task.assignee_ids ?? [],
            });
        }
    }, [task, statuses, workspace.id]);

    const statusItems = statuses.map((status) => ({
        value: String(status.id),
        label: status.name,
    }));

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!task) return;

        put(taskRoutes.update.url(task.id), {
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

    if (!task) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="rounded-md sm:max-w-md">
                <form onSubmit={onSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update task details for {workspace.name}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2">
                        <Label htmlFor="task-name">Name</Label>
                        <Input
                            id="task-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="task-description">Description (optional)</Label>
                        <Textarea
                            id="task-description"
                            value={data.description ?? ''}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <CustomComboBox
                                items={statusItems}
                                placeholder="Select a status"
                                value={data.status_id ? String(data.status_id) : null}
                                onSelect={(value) => {
                                    if (value) setData('status_id', Number(value));
                                }}
                            />
                            <InputError message={errors.status_id} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Due date (optional)</Label>
                            <Input
                                type="date"
                                value={data.due_date ?? ''}
                                onChange={(e) => setData('due_date', e.target.value)}
                            />
                            <InputError message={errors.due_date} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <ComboboxMultipleExpandable
                            label="Assignees"
                            items={users}
                            value={users.filter((u) => data.assignee_ids.includes(u.id))}
                            onValueChange={(vals) => setData('assignee_ids', vals.map((v) => v.id))}
                            getLabel={(user) => user.name}
                            getValue={(user) => user.id}
                            maxVisible={2}
                            placeholder="Search assignees..."
                        />
                        <InputError message={errors.assignee_ids} />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Update Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
