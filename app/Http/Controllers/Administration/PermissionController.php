<?php

namespace App\Http\Controllers\Administration;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of permissions grouped by module.
     */
    public function index(): Response
    {
        $permissions = Permission::query()
            ->orderBy('name')
            ->get()
            ->map(fn (Permission $permission): array => [
                'id' => $permission->id,
                'name' => $permission->name,
                'guard_name' => $permission->guard_name,
            ]);

        return Inertia::render('permissions/index', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created permission.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name'],
        ]);

        Permission::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Permission created successfully.')]);

        return redirect()->back();
    }

    /**
     * Update the specified permission.
     */
    public function update(Request $request, Permission $permission): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name,'.$permission->id],
        ]);

        $permission->update([
            'name' => $validated['name'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Permission updated successfully.')]);

        return redirect()->back();
    }

    /**
     * Remove the specified permission.
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        $permission->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Permission deleted successfully.')]);

        return redirect()->back();
    }
}
