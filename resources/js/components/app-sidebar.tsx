import { Link } from '@inertiajs/react';
import {
    Building2,
    CircleDot,
    FolderKanban,
    KeyRound,
    LayoutGrid,
    Lock,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCanAny } from '@/hooks/use-can';
import { dashboard } from '@/routes';
import accounts from '@/routes/accounts';
import offices from '@/routes/offices';
import permissions from '@/routes/permissions';
import roles from '@/routes/roles';
import statuses from '@/routes/statuses';
import workspaces from '@/routes/workspaces';
import type { NavGroup } from '@/types';

const navGroups: NavGroup[] = [
    {
        label: 'Platform',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
        ],
    },
    {
        label: 'Organization',
        items: [
            {
                title: 'Offices',
                href: offices.index(),
                icon: Building2,
                permission: 'offices.view',
            },
            {
                title: 'Employees',
                href: accounts.index(),
                icon: Users,
                permission: 'accounts.view',
            },
            {
                title: 'Statuses',
                href: statuses.index(),
                icon: CircleDot,
                permission: 'statuses.view',
            },
            {
                title: 'Workspaces',
                href: workspaces.index(),
                icon: FolderKanban,
                permission: 'workspaces.view',
            },
        ],
    },
    {
        label: 'Administration',
        items: [
            {
                title: 'Roles',
                href: roles.index(),
                icon: KeyRound,
                permission: 'roles.view',
            },
            {
                title: 'Permissions',
                href: permissions.index(),
                icon: Lock,
                permission: 'permissions.view',
            },
        ],
    },
];

export function AppSidebar() {
    const canAny = useCanAny();

    const visibleGroups = navGroups
        .map((group) => ({
            ...group,
            items: group.items.filter(
                (item) => !item.permission || canAny([item.permission]),
            ),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={visibleGroups} />
            </SidebarContent>
        </Sidebar>
    );
}
