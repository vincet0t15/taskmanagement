<?php

use App\Models\Status;
use App\Models\Task;
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

    $this->workspace = Workspace::factory()->create();
    $this->status = Status::factory()->create();
});

test('guests are redirected to the login page', function () {
    $this->post(route('tasks.store'), [])->assertRedirect(route('login'));
});

test('users without the tasks.create permission are forbidden', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('tasks.store'), [])
        ->assertForbidden();
});

test('a task can be created for a workspace', function () {
    $this->actingAs($this->admin)
        ->post(route('tasks.store'), [
            'workspace_id' => $this->workspace->id,
            'name' => 'Encode quarterly report',
            'description' => 'Consolidate the quarterly submissions.',
            'status_id' => $this->status->id,
            'due_date' => '2026-11-30',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $task = Task::where('name', 'Encode quarterly report')->first();

    expect($task)->not->toBeNull()
        ->and($task->workspace_id)->toBe($this->workspace->id)
        ->and($task->status_id)->toBe($this->status->id)
        ->and($task->due_date->toDateString())->toBe('2026-11-30')
        ->and($task->progress)->toBe(0);
});

test('the workspace, name and status are required', function () {
    $this->actingAs($this->admin)
        ->post(route('tasks.store'), [])
        ->assertSessionHasErrors(['workspace_id', 'name', 'status_id']);
});

test('the workspace and status must exist', function () {
    $this->actingAs($this->admin)
        ->post(route('tasks.store'), [
            'workspace_id' => 999999,
            'name' => 'Ghost task',
            'status_id' => 999999,
        ])
        ->assertSessionHasErrors(['workspace_id', 'status_id']);
});

test('tasks survive the deletion of the status they used', function () {
    $task = Task::create([
        'workspace_id' => $this->workspace->id,
        'status_id' => $this->status->id,
        'name' => 'Deferred task',
    ]);

    $this->status->delete();

    expect($task->refresh()->status_id)->toBeNull();

    $this->actingAs($this->admin)
        ->get(route('workspaces.show', $this->workspace))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('tasks.0.status', 'To Do')
            ->where('tasks.0.assignee', 'Unassigned')
        );
});

test('the workspace tasks view lists the created tasks', function () {
    $task = Task::create([
        'workspace_id' => $this->workspace->id,
        'status_id' => $this->status->id,
        'name' => 'Repair request consolidation',
    ]);

    $this->actingAs($this->admin)
        ->get(route('workspaces.show', $this->workspace))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('workspaces/tasks')
            ->has('tasks', 1)
            ->where('tasks.0.id', $task->id)
            ->where('tasks.0.name', 'Repair request consolidation')
            ->where('tasks.0.status', $this->status->name)
            ->where('tasks.0.assignee', 'Unassigned')
            ->where('tasks.0.due', null)
            ->has('statuses')
        );
});
