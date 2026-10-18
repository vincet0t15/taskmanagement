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
import statusRoutes from '@/routes/statuses';
import type { Status, StatusCreateRequest } from '@/types/status';

interface EditStatusDialogProps {
    isOpen: boolean;
    onClose: () => void;
    status: Status;
}

export function EditStatusDialog({
    isOpen,
    onClose,
    status,
}: EditStatusDialogProps) {
    const { data, setData, put, reset, errors, processing } =
        useForm<StatusCreateRequest>({
            name: status.name,
            slug: status.slug,
            color: status.color,
            description: status.description,
            sort_order: status.sort_order,
        });

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        put(statusRoutes.update.url(status.id), {
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
                        <DialogTitle>Edit Status</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the status details. Changing the color
                            updates everywhere this status is shown.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g. In Review"
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
                            placeholder="e.g. in-review"
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
                            placeholder="e.g. Waiting on a reviewer's feedback"
                            value={data.description ?? ''}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="sort_order">Sort Order</Label>
                        <Input
                            id="sort_order"
                            name="sort_order"
                            type="number"
                            min={0}
                            max={9999}
                            value={data.sort_order}
                            onChange={(e) =>
                                setData('sort_order', Number(e.target.value))
                            }
                        />
                        <InputError message={errors.sort_order} />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Update Status
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
