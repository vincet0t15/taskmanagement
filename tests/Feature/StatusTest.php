<?php

use App\Models\Status;
use App\Models\User;
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
    $this->get(route('statuses.index'))->assertRedirect(route('login'));
});

test('users without the statuses.view permission are forbidden', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('statuses.index'))
        ->assertForbidden();
});

test('authorized users can view the statuses page', function () {
    $this->actingAs($this->admin)
        ->get(route('statuses.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('statuses/index')
            ->has('statuses')
        );
});

test('a status can be created', function () {
    $this->actingAs($this->admin)
        ->post(route('statuses.store'), [
            'name' => 'In Review',
            'slug' => 'in-review',
            'color' => '#2563EB',
            'description' => 'Waiting on feedback.',
            'sort_order' => 6,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(Status::where('slug', 'in-review')->exists())->toBeTrue();
});

test('a status requires a valid hex color', function () {
    $this->actingAs($this->admin)
        ->post(route('statuses.store'), [
            'name' => 'Bad Color',
            'slug' => 'bad-color',
            'color' => 'blue',
            'sort_order' => 1,
        ])
        ->assertSessionHasErrors('color');

    expect(Status::where('slug', 'bad-color')->exists())->toBeFalse();
});

test('status name and slug are required and unique', function () {
    $this->actingAs($this->admin)
        ->post(route('statuses.store'), [])
        ->assertSessionHasErrors(['name', 'slug', 'color', 'sort_order']);

    Status::create([
        'name' => 'Duplicate',
        'slug' => 'duplicate',
        'color' => '#000000',
        'sort_order' => 1,
    ]);

    $this->actingAs($this->admin)
        ->post(route('statuses.store'), [
            'name' => 'Duplicate',
            'slug' => 'duplicate',
            'color' => '#000000',
            'sort_order' => 1,
        ])
        ->assertSessionHasErrors(['name', 'slug']);
});

test('a status can be updated', function () {
    $status = Status::create([
        'name' => 'Old Name',
        'slug' => 'old-name',
        'color' => '#000000',
        'sort_order' => 1,
    ]);

    $this->actingAs($this->admin)
        ->put(route('statuses.update', $status), [
            'name' => 'New Name',
            'slug' => 'new-name',
            'color' => '#16A34A',
            'description' => null,
            'sort_order' => 2,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $status->refresh();

    expect($status->name)->toBe('New Name');
    expect($status->slug)->toBe('new-name');
    expect($status->color)->toBe('#16A34A');
});

test('updating a status ignores its own name and slug', function () {
    $status = Status::create([
        'name' => 'Kept',
        'slug' => 'kept',
        'color' => '#000000',
        'sort_order' => 1,
    ]);

    $this->actingAs($this->admin)
        ->put(route('statuses.update', $status), [
            'name' => 'Kept Renamed',
            'slug' => 'kept-renamed',
            'color' => '#000000',
            'sort_order' => 1,
        ])
        ->assertSessionHasNoErrors();

    expect($status->refresh()->name)->toBe('Kept Renamed');
});

test('a status can be deleted', function () {
    $status = Status::create([
        'name' => 'Disposable',
        'slug' => 'disposable',
        'color' => '#000000',
        'sort_order' => 1,
    ]);

    $this->actingAs($this->admin)
        ->delete(route('statuses.destroy', $status))
        ->assertRedirect();

    expect(Status::where('slug', 'disposable')->exists())->toBeFalse();
});
