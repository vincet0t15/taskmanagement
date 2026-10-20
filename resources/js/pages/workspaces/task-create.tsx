import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
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
import type { TaskCreateRequest } from '@/types/task';
import type { Workspace } from '@/types/workspace';

interface CreateTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    workspace: Workspace;
    statuses: Status[];
    users?: Array<{ id: number; name: string; username: string }>;
}

/**
 * Preselect the same status the sample dashboard uses for new work so the
 * dialog never opens on an empty status field.
 */
function initialStatusId(statuses: Status[]): number {
    return (
        statuses.find((status) => status.name === 'To Do')?.id ??
        statuses[0]?.id ??
        0
    );
}

export function CreateTaskDialog({
    isOpen,
    onClose,
    workspace,
    statuses,
    users = [],
}: CreateTaskDialogProps) {
    const { data, setData, post, reset, errors, processing } =
        useForm<TaskCreateRequest>({
            workspace_id: workspace.id,
            name: '',
            description: '',
            status_id: initialStatusId(statuses),
            due_date: '',
            assignee_ids: [],
        });

    // Searchable options for the status CustomComboBox (values are strings).
    const statusItems = statuses.map((status) => ({
        value: String(status.id),
        label: status.name,
    }));

    // TODO: Fetch workspace tasks for parent task selector
    // const parentTaskItems = ...;

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(taskRoutes.store.url(), {
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
                <form onSubmit={onSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Create Task</DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a task to {workspace.name} with a status and
                            optional due date.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2">
                        <Label htmlFor="task-name">Name</Label>
                        <Input
                            id="task-name"
                            name="name"
                            placeholder="e.g. Encode quarterly report"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="task-description">
                            Description{' '}
                            <span className="text-muted-foreground">
                                (optional)
                            </span>
                        </Label>
                        <Textarea
                            id="task-description"
                            name="description"
                            placeholder="What needs to be done?"
                            value={data.description ?? ''}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="task-status">Status</Label>
                            <CustomComboBox
                                id="task-status"
                                items={statusItems}
                                placeholder="Select a status"
                                value={
                                    data.status_id
                                        ? String(data.status_id)
                                        : null
                                }
                                onSelect={(value) => {
                                    if (value) {
                                        setData('status_id', Number(value));
                                    }
                                }}
                            />
                            <InputError message={errors.status_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="task-due-date">
                                Due date{' '}
                                <span className="text-muted-foreground">
                                    (optional)
                                </span>
                            </Label>
                            <Input
                                id="task-due-date"
                                name="due_date"
                                type="date"
                                value={data.due_date ?? ''}
                                onChange={(e) =>
                                    setData('due_date', e.target.value)
                                }
                            />
                            <InputError message={errors.due_date} />
                        </div>
                    </div>

                    {/* Multiple assignees selector */}
                    <div className="grid gap-2">
                        <ComboboxMultipleExpandable
                            label="Assignees"
                            items={users}
                            value={users
                                .filter((u) => data.assignee_ids.includes(u.id))
                                .map((u) => u)}
                            onValueChange={(vals) => {
                                setData(
                                    'assignee_ids',
                                    vals.map((v) => v.id),
                                );
                            }}
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
                            Create Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
