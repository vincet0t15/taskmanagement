import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState, type FormEventHandler } from 'react';
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
import type { WorkspaceCreateRequest } from '@/types/workspace';

interface CreateWorkspaceDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s-]+/g, '-')
        .replace(/^-|-$/g, '');

export function CreateWorkspaceDialog({
    isOpen,
    onClose,
}: CreateWorkspaceDialogProps) {
    const { data, setData, post, reset, errors, processing } =
        useForm<WorkspaceCreateRequest>({
            name: '',
            slug: '',
            color: '#2563EB',
            description: '',
        });

    // Tracks whether the user has edited the slug by hand. If they have not,
    // it keeps following the name so they only think of one field.
    const slugEdited = useRef(false);
    const [slugTouched, setSlugTouched] = useState(false);

    useEffect(() => {
        if (!slugEdited.current) {
            setData('slug', slugify(data.name));
        }
    }, [data.name, setData]);

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(workspaceRoutes.store.url(), {
            onSuccess: () => {
                onClose();
                reset();
                slugEdited.current = false;
                setSlugTouched(false);
            },
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
            reset();
            slugEdited.current = false;
            setSlugTouched(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="rounded-md sm:max-w-sm">
                <form onSubmit={onSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Create Workspace</DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a new workspace to group related tasks, such as
                            Operations or Projects. The color is used wherever
                            the workspace is displayed.
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
                            onChange={(e) => {
                                slugEdited.current = true;
                                setSlugTouched(true);
                                setData('slug', e.target.value);
                            }}
                        />
                        <InputError message={errors.slug} />
                        {!slugTouched && data.name && (
                            <p className="text-xs text-muted-foreground">
                                Generated from the name. You can still edit it.
                            </p>
                        )}
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
                            Create Workspace
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
