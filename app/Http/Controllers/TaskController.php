<?php

namespace App\Http\Controllers;

use App\Contracts\Repositories\TaskRepositoryInterface;
use App\Models\User;
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
            // Required on the way in even though the column is nullable: the
            // column only accepts null so deleting a status keeps its tasks.
            'status_id' => ['required', 'integer', Rule::exists('statuses', 'id')],
            'due_date' => ['nullable', 'date'],
            // Optional: array of user IDs for multiple assignees
            'assignee_ids' => ['nullable', 'array'],
        ]);

        $task = $this->taskRepo->create(array_merge($validated, [
            'assignee_id' => $validated['assignee_ids'] ?? null,
        ]));

        // Handle multiple assignees via pivot table
        if (!empty($validated['assignee_ids'])) {
            $task->assignees()->sync($validated['assignee_ids']);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task created successfully.')]);

        return redirect()->back();
    }
}
