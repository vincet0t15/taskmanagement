import { useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { CustomComboBox } from '@/components/CustomComboBox';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
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
import accountRoutes from '@/routes/accounts';
import type { EmployeeCreateRequest } from '@/types/employee';
import type { Office } from '@/types/office';

/** Sentinel for the combobox "no office / no role" options. */
const NONE = 'none';

interface CreateEmployeeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    offices: Office[];
    roles: string[];
}

export function CreateEmployeeDialog({
    isOpen,
    onClose,
    offices,
    roles,
}: CreateEmployeeDialogProps) {
    const { data, setData, post, reset, errors, processing } =
        useForm<EmployeeCreateRequest>({
            name: '',
            username: '',
            password: '',
            password_confirmation: '',
            office_id: null,
            role: null,
        });

    // Searchable options for the CustomComboBox fields (values are strings).
    const officeItems = [
        { value: NONE, label: 'No office' },
        ...offices.map((office) => ({
            value: String(office.id),
            label: office.name,
        })),
    ];

    const roleItems = [
        { value: NONE, label: 'No role' },
        ...roles.map((role) => ({ value: role, label: role })),
    ];

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(accountRoutes.store.url(), {
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
            <DialogContent className="rounded-md sm:max-w-lg">
                <form onSubmit={onSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Create Employee</DialogTitle>
                        <DialogDescription className="text-xs">
                            Register an employee and their login credentials.
                            They can use the username and password to sign in.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-3">
                            <p className="text-xs font-medium text-muted-foreground">
                                Employee details
                            </p>

                            <div className="grid gap-2">
                                <Label htmlFor="employee-name">Name</Label>
                                <Input
                                    id="employee-name"
                                    name="name"
                                    placeholder="e.g. Juan Dela Cruz"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="employee-office">
                                        Office{' '}
                                        <span className="text-muted-foreground">
                                            (optional)
                                        </span>
                                    </Label>
                                    <CustomComboBox
                                        id="employee-office"
                                        items={officeItems}
                                        placeholder="Select an office"
                                        showClear
                                        value={
                                            data.office_id
                                                ? String(data.office_id)
                                                : null
                                        }
                                        onSelect={(value) =>
                                            setData(
                                                'office_id',
                                                value && value !== NONE
                                                    ? Number(value)
                                                    : null,
                                            )
                                        }
                                    />
                                    <InputError message={errors.office_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="employee-role">
                                        Role{' '}
                                        <span className="text-muted-foreground">
                                            (optional)
                                        </span>
                                    </Label>
                                    <CustomComboBox
                                        id="employee-role"
                                        items={roleItems}
                                        placeholder="Select a role"
                                        showClear
                                        value={data.role}
                                        onSelect={(value) =>
                                            setData(
                                                'role',
                                                value && value !== NONE
                                                    ? value
                                                    : null,
                                            )
                                        }
                                    />
                                    <InputError message={errors.role} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <p className="text-xs font-medium text-muted-foreground">
                                Login credentials
                            </p>

                            <div className="grid gap-2">
                                <Label htmlFor="employee-username">
                                    Username
                                </Label>
                                <Input
                                    id="employee-username"
                                    name="username"
                                    autoComplete="off"
                                    placeholder="e.g. jdelacruz"
                                    value={data.username}
                                    onChange={(e) =>
                                        setData('username', e.target.value)
                                    }
                                />
                                <InputError message={errors.username} />
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="employee-password">
                                        Password
                                    </Label>
                                    <PasswordInput
                                        id="employee-password"
                                        name="password"
                                        autoComplete="new-password"
                                        placeholder="Password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="employee-password-confirmation">
                                        Confirm password
                                    </Label>
                                    <PasswordInput
                                        id="employee-password-confirmation"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        placeholder="Confirm password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Create Employee
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
