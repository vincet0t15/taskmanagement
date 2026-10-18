<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Every module in the tasking system, each with view/create/edit/delete
     * abilities.
     */
    public const MODULES = [
        'offices',
        'accounts',
        'roles',
        'permissions',
        'tasks',
        'task-categories',
        'statuses',
        'workspaces',
        'work-groups',
        'reports',
    ];

    public const ACTIONS = [
        'view',
        'create',
        'edit',
        'delete',
    ];

    /**
     * Seed roles and permissions.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $allPermissions = $this->createPermissions();

        // Super Admin: the break-glass role. It always holds every permission
        // and is protected from editing/deletion in the role controller.
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        $superAdmin->syncPermissions($allPermissions);

        // Administrator: the full LGU-wide administrator, equivalent to the
        // Super Admin except that it can be modified.
        $administrator = Role::firstOrCreate(['name' => 'Administrator']);
        $administrator->syncPermissions($allPermissions);

        // Office Head: runs the day-to-day work of an office. Full control of
        // the work modules, read-only on the administration modules.
        $officeHeadPermissions = [
            ...$this->permissionsFor(['tasks', 'task-categories', 'statuses', 'workspaces', 'work-groups', 'reports'], self::ACTIONS),
            ...$this->permissionsFor(['offices', 'accounts', 'roles', 'permissions'], ['view']),
        ];

        $officeHead = Role::firstOrCreate(['name' => 'Office Head']);
        $officeHead->syncPermissions($officeHeadPermissions);

        // Staff: creates and works on tasks but cannot delete them, and has
        // read-only access to everything else.
        $staffPermissions = [
            ...$this->permissionsFor(['tasks'], ['view', 'create', 'edit']),
            ...$this->permissionsFor(['offices', 'accounts', 'task-categories', 'statuses', 'workspaces', 'work-groups', 'reports'], ['view']),
        ];

        $staff = Role::firstOrCreate(['name' => 'Staff']);
        $staff->syncPermissions($staffPermissions);

        // Viewer: read-only across the board.
        $viewer = Role::firstOrCreate(['name' => 'Viewer']);
        $viewer->syncPermissions($this->permissionsFor(self::MODULES, ['view']));
    }

    /**
     * Create the module.action permissions and return their names.
     *
     * @return array<int, string>
     */
    protected function createPermissions(): array
    {
        $permissions = [];

        foreach (self::MODULES as $module) {
            foreach (self::ACTIONS as $action) {
                $permissions[] = Permission::firstOrCreate(['name' => "{$module}.{$action}"])->name;
            }
        }

        return $permissions;
    }

    /**
     * Build "module.action" names for the given modules and actions.
     *
     * @param  array<int, string>  $modules
     * @param  array<int, string>  $actions
     * @return array<int, string>
     */
    protected function permissionsFor(array $modules, array $actions): array
    {
        $permissions = [];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $permissions[] = "{$module}.{$action}";
            }
        }

        return $permissions;
    }
}
