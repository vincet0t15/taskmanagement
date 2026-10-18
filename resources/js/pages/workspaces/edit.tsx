import { useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import ColorPicker from '@/components/color-picker';
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
import workspaceRoutes from '@/routes/workspaces';
import type { Workspace, WorkspaceCreateRequest } from '@/types/workspace';

interface EditWorkspaceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    workspace: Workspace;
}

export function EditWorkspaceDialog({
    isOpen,
    onClose,
    workspace,
}: EditWorkspaceDialogProps) {
    const { data, setData, put, reset, errors, processing } =
        useForm<WorkspaceCreateRequest>({
            name: workspace.name,
            slug: workspace.slug,
            color: workspace.color,
            description: workspace.description,
        });

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        put(workspaceRoutes.update.url(workspace.id), {
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
            <DialogContent className="rounded-md sm:max-w-sm">
                <form onSubmit={onSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Edit Workspace</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the workspace details. Changing the color
                            updates everywhere this workspace is shown.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g. Community Programs"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            name="slug"
                            placeholder="e.g. community-programs"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                        />
                        <InputError message={errors.slug} />
                    </div>

                    <ColorPicker
                        id="color"
                        value={data.color}
                        onValueChange={(color) => setData('color', color)}
                        error={errors.color}
                        disabled={processing}
                    />

                    <div className="grid gap-2">
                        <Label htmlFor="description">
                            Description{' '}
                            <span className="text-muted-foreground">
                                (optional)
                            </span>
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="e.g. Programs serving the wider community"
                            value={data.description ?? ''}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        <InputError message={errors.description} />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Update Workspace
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
