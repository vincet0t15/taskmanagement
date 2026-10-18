<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    app(PermissionRegistrar::class)->forgetCachedPermissions();

    $this->admin = User::factory()->create();
    $this->admin->assignRole('Super Admin');
});

test('guests are redirected to the login page', function () {
    $this->get(route('roles.index'))->assertRedirect(route('login'));
});

test('users without the roles.view permission are forbidden', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('roles.index'))
        ->assertForbidden();
});

test('authorized users can view the roles page', function () {
    $this->actingAs($this->admin)
        ->get(route('roles.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('roles/index')
            ->has('roles', 5)
            ->has('permissions')
        );
});

test('a role can be created with permissions', function () {
    $this->actingAs($this->admin)
        ->post(route('roles.store'), [
            'name' => 'Task Coordinator',
            'permissions' => ['tasks.view', 'tasks.create'],
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $role = Role::findByName('Task Coordinator');

    expect($role->permissions->pluck('name')->all())
        ->toEqualCanonicalizing(['tasks.view', 'tasks.create']);
});

test('role name is required and unique', function () {
    $this->actingAs($this->admin)
        ->post(route('roles.store'), [])
        ->assertSessionHasErrors('name');

    $this->actingAs($this->admin)
        ->post(route('roles.store'), ['name' => 'Staff'])
        ->assertSessionHasErrors('name');
});

test('a role can be updated', function () {
    $role = Role::create(['name' => 'Temp Role', 'guard_name' => 'web']);
    $role->syncPermissions(['offices.view']);

    $this->actingAs($this->admin)
        ->put(route('roles.update', $role), [
            'name' => 'Renamed Role',
            'permissions' => ['offices.view', 'offices.create'],
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $role->refresh();

    expect($role->name)->toBe('Renamed Role');
    expect($role->permissions->pluck('name')->all())
        ->toEqualCanonicalizing(['offices.view', 'offices.create']);
});

test('the Super Admin role cannot be updated', function () {
    $superAdmin = Role::findByName('Super Admin');

    $this->actingAs($this->admin)
        ->put(route('roles.update', $superAdmin), [
            'name' => 'Renamed Super Admin',
            'permissions' => [],
        ])
        ->assertRedirect();

    expect($superAdmin->refresh()->name)->toBe('Super Admin');
});

test('the Super Admin role cannot be deleted', function () {
    $superAdmin = Role::findByName('Super Admin');

    $this->actingAs($this->admin)
        ->delete(route('roles.destroy', $superAdmin))
        ->assertRedirect();

    expect(Role::findByName('Super Admin'))->not->toBeNull();
});

test('a role can be deleted', function () {
    $role = Role::create(['name' => 'Disposable', 'guard_name' => 'web']);

    $this->actingAs($this->admin)
        ->delete(route('roles.destroy', $role))
        ->assertRedirect();

    expect(Role::where('name', 'Disposable')->exists())->toBeFalse();
});
