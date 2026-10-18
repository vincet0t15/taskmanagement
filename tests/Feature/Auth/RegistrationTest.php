<?php

use App\Models\User;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'username' => 'testuser',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    expect(User::query()->where('username', 'testuser')->exists())->toBeTrue();
});

test('usernames are stored in lowercase', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'username' => 'TestUser',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    expect(User::query()->where('username', 'testuser')->exists())->toBeTrue();
});

test('username must be unique', function () {
    User::factory()->create(['username' => 'taken']);

    $response = $this->post(route('register.store'), [
        'name' => 'Another User',
        'username' => 'taken',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('username');
    $this->assertGuest();
});

test('username must contain only letters, numbers, dashes and underscores', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'username' => 'invalid username!',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('username');
    $this->assertGuest();
});
