<?php

use App\Models\Office;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\PermissionRegistrar;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    app(PermissionRegistrar::class)->forgetCachedPermissions();

    $this->admin = User::factory()->create();
    $this->admin->assignRole('Super Admin');
});

test('guests are redirected to the login page', function () {
    $this->get(route('accounts.index'))->assertRedirect(route('login'));
});

test('users without the accounts.view permission are forbidden', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('accounts.index'))
        ->assertForbidden();
});

test('users without the accounts.create permission are forbidden', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('accounts.store'), [])
        ->assertForbidden();
});

test('authorized users can view the employees page', function () {
    $this->actingAs($this->admin)
        ->get(route('accounts.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('accounts/index')
            ->has('accounts')
            ->has('offices')
            ->has('roles')
        );
});

test('an employee can be registered with credentials, office and role', function () {
    $office = Office::create([
        'name' => 'Information Technology Office',
        'code' => 'ITO',
    ]);

    $this->actingAs($this->admin)
        ->post(route('accounts.store'), [
            'name' => 'Juan Dela Cruz',
            'username' => 'jdelacruz',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
            'office_id' => $office->id,
            'role' => 'Staff',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $user = User::where('username', 'jdelacruz')->first();

    expect($user)->not->toBeNull()
        ->and($user->name)->toBe('Juan Dela Cruz')
        ->and($user->office_id)->toBe($office->id)
        ->and(Hash::check('secret-password', $user->password))->toBeTrue()
        ->and($user->hasRole('Staff'))->toBeTrue();
});

test('the employees page lists the registered employee', function () {
    $office = Office::create([
        'name' => 'Engineering Office',
        'code' => 'EO',
    ]);

    $this->actingAs($this->admin)
        ->post(route('accounts.store'), [
            'name' => 'Maria Santos',
            'username' => 'msantos',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
            'office_id' => $office->id,
            'role' => 'Office Head',
        ]);

    $this->actingAs($this->admin)
        ->get(route('accounts.index', ['search' => 'msantos']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('accounts/index')
            ->has('accounts.data', 1)
            ->where('accounts.data.0.username', 'msantos')
            ->where('accounts.data.0.office', 'Engineering Office')
            ->where('accounts.data.0.roles', ['Office Head'])
        );
});

test('an employee without an office or role is accepted', function () {
    $this->actingAs($this->admin)
        ->post(route('accounts.store'), [
            'name' => 'Unassigned Staff',
            'username' => 'ustaff',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
        ])
        ->assertSessionHasNoErrors();

    $user = User::where('username', 'ustaff')->first();

    expect($user->office_id)->toBeNull()
        ->and($user->roles)->toBeEmpty();
});

test('the username is required, unique and the password must be confirmed', function () {
    $this->actingAs($this->admin)
        ->post(route('accounts.store'), [])
        ->assertSessionHasErrors(['name', 'username', 'password']);

    User::factory()->create([
        'username' => 'taken',
    ]);

    $this->actingAs($this->admin)
        ->post(route('accounts.store'), [
            'name' => 'Duplicate',
            'username' => 'taken',
            'password' => 'secret-password',
            'password_confirmation' => 'different-password',
        ])
        ->assertSessionHasErrors(['username', 'password']);
});

test('the office and role must exist', function () {
    $this->actingAs($this->admin)
        ->post(route('accounts.store'), [
            'name' => 'Ghost',
            'username' => 'ghost',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
            'office_id' => 999999,
            'role' => 'Nonexistent Role',
        ])
        ->assertSessionHasErrors(['office_id', 'role']);
});

test('the registered credentials work on the login screen', function () {
    $this->actingAs($this->admin)
        ->post(route('accounts.store'), [
            'name' => 'Anna Reyes',
            'username' => 'areyes',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
        ])
        ->assertSessionHasNoErrors();

    $this->post(route('logout'));
    $this->post(route('login.store'), [
        'username' => 'areyes',
        'password' => 'secret-password',
    ]);

    $this->assertAuthenticatedAs(User::where('username', 'areyes')->firstOrFail());
});
