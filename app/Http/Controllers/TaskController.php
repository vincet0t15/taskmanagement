<?php

namespace App\Http\Controllers;

use App\Contracts\Repositories\TaskRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function __construct(
        private readonly TaskRepositoryInterface $taskRepo,
    ) {}

    /**
     * Store a newly created task for a workspace.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'workspace_id' => ['required', 'integer', Rule::exists('workspaces', 'id')],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'status_id' => ['required', 'integer', Rule::exists('statuses', 'id')],
            'due_date' => ['nullable', 'date'],
            'assignee_ids' => ['nullable', 'array'],
            'assignee_ids.*' => ['integer', Rule::exists('users', 'id')],
        ]);

        $assigneeIds = $validated['assignee_ids'] ?? [];

        $taskData = $validated;
        unset($taskData['assignee_ids']);

        // Use first assignee as primary assignee if exists
        $taskData['assignee_id'] = !empty($assigneeIds) ? $assigneeIds[0] : null;

        $task = $this->taskRepo->create($taskData);

        $task->assignees()->sync($assigneeIds);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task created successfully.')]);

        return redirect()->back();
    }
}
