import { Head, router, useForm } from '@inertiajs/react';
import { PlusIcon, Search } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { Can } from '@/components/can';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import accountRoutes from '@/routes/accounts';
import type { Employee } from '@/types/employee';
import type { Office } from '@/types/office';
import type { PaginatedDataResponse } from '@/types/pagination';
import { CreateEmployeeDialog } from './create';

interface IndexProps {
    accounts: PaginatedDataResponse<Employee>;
    offices: Office[];
    roles: string[];
    filters: {
        search?: string;
    };
}

export default function Index({
    accounts,
    offices,
    roles,
    filters,
}: IndexProps) {
    const { data, setData } = useForm({
        search: filters.search ?? '',
    });

    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            router.get(
                accountRoutes.index.url(),
                { search: data.search },
                { preserveState: true, preserveScroll: true },
            );
        }
    };

    return (
        <>
            <Head title="Employees" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Employee Management"
                    description="Employee accounts, their offices and login credentials."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Can permission="accounts.create">
                        <Button onClick={() => setOpenCreateDialog(true)}>
                            <PlusIcon className="h-4 w-4" />
                            Create Employee
                        </Button>
                    </Can>

                    <div className="relative w-full sm:w-[250px]">
                        <Label htmlFor="search" className="sr-only">
                            Search
                        </Label>
                        <Input
                            id="search"
                            placeholder="Search name or username..."
                            className="w-full pl-8"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                        />
                        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold text-primary">
                                    Name
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Username
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Office
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Role
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Created
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts.data.length > 0 ? (
                                accounts.data.map((employee) => (
                                    <TableRow
                                        key={employee.id}
                                        className="text-sm hover:bg-muted/30"
                                    >
                                        <TableCell className="text-sm font-medium">
                                            {employee.name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {employee.username}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {employee.office ?? (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <div className="flex flex-wrap gap-1">
                                                {employee.roles.length > 0 ? (
                                                    employee.roles.map(
                                                        (role) => (
                                                            <Badge
                                                                key={role}
                                                                variant="secondary"
                                                            >
                                                                {role}
                                                            </Badge>
                                                        ),
                                                    )
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {employee.created_at ?? (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination data={accounts} />
            </div>

            {openCreateDialog && (
                <CreateEmployeeDialog
                    isOpen={openCreateDialog}
                    onClose={() => setOpenCreateDialog(false)}
                    offices={offices}
                    roles={roles}
                />
            )}
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Employees',
            href: accountRoutes.index(),
        },
    ],
};
