import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    CircleDot,
    FolderGit2,
    FolderKanban,
    KeyRound,
    LayoutGrid,
    Lock,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCanAny } from '@/hooks/use-can';
import { dashboard } from '@/routes';
import offices from '@/routes/offices';
import permissions from '@/routes/permissions';
import roles from '@/routes/roles';
import statuses from '@/routes/statuses';
import workspaces from '@/routes/workspaces';
import type { NavGroup, NavItem } from '@/types';

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

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
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

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
