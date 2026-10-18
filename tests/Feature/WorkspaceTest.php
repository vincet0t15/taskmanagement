<?php

use App\Models\User;
use App\Models\Workspace;
use Database\Seeders\RolePermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\PermissionRegistrar;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    app(PermissionRegistrar::class)->forgetCachedPermissions();

    $this->admin = User::factory()->create();
    $this->admin->assignRole('Super Admin');
});

test('guests are redirected to the login page', function () {
    $this->get(route('workspaces.index'))->assertRedirect(route('login'));
});

test('users without the workspaces.view permission are forbidden', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('workspaces.index'))
        ->assertForbidden();
});

test('authorized users can view the workspaces page', function () {
    $this->actingAs($this->admin)
        ->get(route('workspaces.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('workspaces/index')
            ->has('workspaces')
        );
});

test('a workspace can be created', function () {
    $this->actingAs($this->admin)
        ->post(route('workspaces.store'), [
            'name' => 'Community Programs',
            'description' => 'Programs serving the wider community.',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(Workspace::where('name', 'Community Programs')->exists())->toBeTrue();
});

test('workspace name is required and unique', function () {
    $this->actingAs($this->admin)
        ->post(route('workspaces.store'), [])
        ->assertSessionHasErrors(['name']);

    Workspace::create([
        'name' => 'Duplicate',
    ]);

    $this->actingAs($this->admin)
        ->post(route('workspaces.store'), [
            'name' => 'Duplicate',
        ])
        ->assertSessionHasErrors(['name']);
});

test('a workspace can be updated', function () {
    $workspace = Workspace::create([
        'name' => 'Old Name',
    ]);

    $this->actingAs($this->admin)
        ->put(route('workspaces.update', $workspace), [
            'name' => 'New Name',
            'description' => null,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $workspace->refresh();

    expect($workspace->name)->toBe('New Name');
});

test('updating a workspace ignores its own name', function () {
    $workspace = Workspace::create([
        'name' => 'Kept',
    ]);

    $this->actingAs($this->admin)
        ->put(route('workspaces.update', $workspace), [
            'name' => 'Kept',
            'description' => null,
        ])
        ->assertSessionHasNoErrors();

    expect($workspace->refresh()->name)->toBe('Kept');
});

test('a workspace can be deleted', function () {
    $workspace = Workspace::create([
        'name' => 'Disposable',
    ]);

    $this->actingAs($this->admin)
        ->delete(route('workspaces.destroy', $workspace))
        ->assertRedirect();

    expect(Workspace::where('name', 'Disposable')->exists())->toBeFalse();
});

test('authorized users can view a workspace dashboard', function () {
    $workspace = Workspace::create([
        'name' => 'Dashboard Host',
    ]);

    $this->actingAs($this->admin)
        ->get(route('workspaces.show', $workspace))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('workspaces/tasks')
            ->where('workspace.id', $workspace->id)
            ->has('dashboard.stats', 4)
            ->has('dashboard.overview.series', 2)
            ->has('dashboard.monthly.data', 6)
            ->has('dashboard.reminders')
            ->has('dashboard.recent_tasks')
        );
});

test('the dashboard sample data is deterministic per workspace', function () {
    $workspace = Workspace::create([
        'name' => 'Stable Data',
    ]);

    $this->actingAs($this->admin)
        ->get(route('workspaces.show', $workspace))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('workspaces/tasks')
            ->has('dashboard')
        );
});

test('the dashboard sample data differs between workspaces', function () {
    $alpha = Workspace::create(['name' => 'Alpha']);
    $beta = Workspace::create(['name' => 'Beta']);

    $this->actingAs($this->admin)
        ->get(route('workspaces.show', $alpha))
        ->assertOk();

    $this->actingAs($this->admin)
        ->get(route('workspaces.show', $beta))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('workspaces/tasks')
            ->has('dashboard')
        );
});

test('guests are redirected away from a workspace dashboard', function () {
    $workspace = Workspace::create([
        'name' => 'Guest Blocked',
    ]);

    $this->get(route('workspaces.show', $workspace))
        ->assertRedirect(route('login'));
});
