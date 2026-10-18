<?php

namespace App\Http\Controllers\Administration;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * The role that must never be renamed, re-permissioned or deleted.
     */
    public const PROTECTED_ROLE = 'Super Admin';

    /**
     * Display a listing of roles and available permissions.
     */
    public function index(): Response
    {
        $roles = Role::with('permissions')
            ->orderBy('id')
            ->get()
            ->map(fn (Role $role): array => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->all(),
                'permissions_count' => $role->permissions->count(),
            ]);

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'permissions' => Permission::query()->orderBy('name')->pluck('name'),
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($validated['permissions'] ?? []);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role created successfully.')]);

        return redirect()->back();
    }

    /**
     * Update the specified role.
     */
    public function update(Request $request, Role $role): RedirectResponse
    {
        if ($role->name === self::PROTECTED_ROLE) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('The :role role cannot be modified.', ['role' => self::PROTECTED_ROLE])]);

            return redirect()->back();
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name,'.$role->id],
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $role->update([
            'name' => $validated['name'],
        ]);

        $role->syncPermissions($validated['permissions'] ?? []);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role updated successfully.')]);

        return redirect()->back();
    }

    /**
     * Remove the specified role.
     */
    public function destroy(Role $role): RedirectResponse
    {
        if ($role->name === self::PROTECTED_ROLE) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('The :role role cannot be deleted.', ['role' => self::PROTECTED_ROLE])]);

            return redirect()->back();
        }

        $role->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role deleted successfully.')]);

        return redirect()->back();
    }
}
