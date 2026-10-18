import { useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
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
import officeRoutes from '@/routes/offices';
import type { OfficeCreateRequest } from '@/types/office';

interface CreateOfficeDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateOfficeDialog({
    isOpen,
    onClose,
}: CreateOfficeDialogProps) {
    const { data, setData, post, reset, errors, processing } =
        useForm<OfficeCreateRequest>({
            name: '',
            code: '',
        });

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(officeRoutes.store.url(), {
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
                        <DialogTitle>Create Office</DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a new office by providing the required details.
                            This will be included in the system records.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g. Office of the Municipal Mayor"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            name="code"
                            placeholder="e.g. MO"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                        />
                        <InputError message={errors.code} />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Create Office
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
