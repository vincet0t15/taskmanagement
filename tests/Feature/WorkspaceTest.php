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
            'slug' => 'community-programs',
            'color' => '#2563EB',
            'description' => 'Programs serving the wider community.',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(Workspace::where('slug', 'community-programs')->exists())->toBeTrue();
});

test('a workspace requires a valid hex color', function () {
    $this->actingAs($this->admin)
        ->post(route('workspaces.store'), [
            'name' => 'Bad Color',
            'slug' => 'bad-color',
            'color' => 'blue',
        ])
        ->assertSessionHasErrors('color');

    expect(Workspace::where('slug', 'bad-color')->exists())->toBeFalse();
});

test('workspace name and slug are required and unique', function () {
    $this->actingAs($this->admin)
        ->post(route('workspaces.store'), [])
        ->assertSessionHasErrors(['name', 'slug', 'color']);

    Workspace::create([
        'name' => 'Duplicate',
        'slug' => 'duplicate',
        'color' => '#000000',
    ]);

    $this->actingAs($this->admin)
        ->post(route('workspaces.store'), [
            'name' => 'Duplicate',
            'slug' => 'duplicate',
            'color' => '#000000',
        ])
        ->assertSessionHasErrors(['name', 'slug']);
});

test('a workspace can be updated', function () {
    $workspace = Workspace::create([
        'name' => 'Old Name',
        'slug' => 'old-name',
        'color' => '#000000',
    ]);

    $this->actingAs($this->admin)
        ->put(route('workspaces.update', $workspace), [
            'name' => 'New Name',
            'slug' => 'new-name',
            'color' => '#16A34A',
            'description' => null,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $workspace->refresh();

    expect($workspace->name)->toBe('New Name');
    expect($workspace->slug)->toBe('new-name');
    expect($workspace->color)->toBe('#16A34A');
});

test('updating a workspace ignores its own name and slug', function () {
    $workspace = Workspace::create([
        'name' => 'Kept',
        'slug' => 'kept',
        'color' => '#000000',
    ]);

    $this->actingAs($this->admin)
        ->put(route('workspaces.update', $workspace), [
            'name' => 'Kept Renamed',
            'slug' => 'kept-renamed',
            'color' => '#000000',
            'description' => null,
        ])
        ->assertSessionHasNoErrors();

    expect($workspace->refresh()->name)->toBe('Kept Renamed');
});

test('a workspace can be deleted', function () {
    $workspace = Workspace::create([
        'name' => 'Disposable',
        'slug' => 'disposable',
        'color' => '#000000',
    ]);

    $this->actingAs($this->admin)
        ->delete(route('workspaces.destroy', $workspace))
        ->assertRedirect();

    expect(Workspace::where('slug', 'disposable')->exists())->toBeFalse();
});
