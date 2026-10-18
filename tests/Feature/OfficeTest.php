<?php

use App\Models\Office;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('offices.index'))->assertRedirect(route('login'));
});

test('authenticated users can view the offices page', function () {
    Office::factory()->create(['name' => 'Office of the Mayor', 'code' => 'MO']);

    $this->actingAs(User::factory()->create())
        ->get(route('offices.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('offices/index')
            ->has('offices.data', 1)
            ->where('offices.data.0.name', 'Office of the Mayor')
        );
});

test('offices can be searched', function () {
    Office::factory()->create(['name' => 'Office of the Municipal Mayor', 'code' => 'MO']);
    Office::factory()->create(['name' => 'Municipal Treasury Office', 'code' => 'MTO']);

    $this->actingAs(User::factory()->create())
        ->get(route('offices.index', ['search' => 'Treasury']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('offices/index')
            ->has('offices.data', 1)
            ->where('offices.data.0.code', 'MTO')
        );
});

test('an office can be created', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('offices.store'), [
            'name' => 'Office of the Municipal Mayor',
            'code' => 'MO',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(Office::where('code', 'MO')->exists())->toBeTrue();
});

test('office name and code must be unique', function () {
    Office::factory()->create(['name' => 'Treasury', 'code' => 'MTO']);

    $this->actingAs(User::factory()->create())
        ->post(route('offices.store'), [
            'name' => 'Treasury',
            'code' => 'MTO',
        ])
        ->assertSessionHasErrors(['name', 'code']);

    expect(Office::count())->toBe(1);
});

test('office name and code are required', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('offices.store'), [])
        ->assertSessionHasErrors(['name', 'code']);
});

test('an office can be updated', function () {
    $office = Office::factory()->create(['name' => 'Old Name', 'code' => 'OLD']);

    $this->actingAs(User::factory()->create())
        ->put(route('offices.update', $office), [
            'name' => 'New Name',
            'code' => 'NEW',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $office->refresh();

    expect($office->name)->toBe('New Name');
    expect($office->code)->toBe('NEW');
});

test('an office can be deleted', function () {
    $office = Office::factory()->create();

    $this->actingAs(User::factory()->create())
        ->delete(route('offices.destroy', $office))
        ->assertRedirect();

    expect(Office::find($office->id))->toBeNull();
});
