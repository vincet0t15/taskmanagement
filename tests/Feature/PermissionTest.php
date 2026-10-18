<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    app(PermissionRegistrar::class)->forgetCachedPermissions();

    $this->admin = User::factory()->create();
    $this->admin->assignRole('Super Admin');
});

test('guests are redirected to the login page', function () {
    $this->get(route('permissions.index'))->assertRedirect(route('login'));
});

test('users without the permissions.view permission are forbidden', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('permissions.index'))
        ->assertForbidden();
});

test('authorized users can view the permissions page', function () {
    $expected = count(RolePermissionSeeder::MODULES) * count(RolePermissionSeeder::ACTIONS);

    $this->actingAs($this->admin)
        ->get(route('permissions.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('permissions/index')
            ->has('permissions', $expected)
        );
});

test('a permission can be created', function () {
    $this->actingAs($this->admin)
        ->post(route('permissions.store'), ['name' => 'reports.approve'])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(Permission::where('name', 'reports.approve')->exists())->toBeTrue();
});

test('permission name is required and unique', function () {
    $this->actingAs($this->admin)
        ->post(route('permissions.store'), [])
        ->assertSessionHasErrors('name');

    $this->actingAs($this->admin)
        ->post(route('permissions.store'), ['name' => 'roles.view'])
        ->assertSessionHasErrors('name');
});

test('a permission can be updated', function () {
    $permission = Permission::create(['name' => 'tasks.archive', 'guard_name' => 'web']);

    $this->actingAs($this->admin)
        ->put(route('permissions.update', $permission), ['name' => 'tasks.restore'])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect($permission->refresh()->name)->toBe('tasks.restore');
});

test('a permission can be deleted', function () {
    $permission = Permission::create(['name' => 'tasks.archive', 'guard_name' => 'web']);

    $this->actingAs($this->admin)
        ->delete(route('permissions.destroy', $permission))
        ->assertRedirect();

    expect(Permission::where('name', 'tasks.archive')->exists())->toBeFalse();
});
