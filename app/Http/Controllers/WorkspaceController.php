<?php

namespace App\Http\Controllers;

use App\Contracts\Repositories\StatusRepositoryInterface;
use App\Contracts\Repositories\TaskRepositoryInterface;
use App\Contracts\Repositories\WorkspaceRepositoryInterface;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use App\Services\WorkspaceDashboardSampleData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceController extends Controller
{
    public function __construct(
        private readonly WorkspaceRepositoryInterface $workspaceRepo,
        private readonly WorkspaceDashboardSampleData $dashboardData,
        private readonly TaskRepositoryInterface $taskRepo,
        private readonly StatusRepositoryInterface $statusRepo,
    ) {}

    /**
     * Display a listing of the workspaces.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        return Inertia::render('workspaces/index', [
            'workspaces' => $this->workspaceRepo->getAllPaginated($search),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display the tasks view for the specified workspace (styled after Project Detail).
     */
    public function show(Workspace $workspace): Response
    {
        return Inertia::render('workspaces/tasks', [
            'workspace' => $workspace,
            'dashboard' => $this->dashboardData->for($workspace),
            'tasks' => $this->taskRepo->getByWorkspace($workspace->id)
                ->map(fn (Task $task): array => $this->presentTask($task))
                ->values()
                ->all(),
            'statuses' => $this->statusRepo->getAll(),
            'users' => User::select('id', 'name', 'username')->get(),
        ]);
    }

    /**
     * Display the tasks view for the specified workspace (styled after Project Detail).
     */
    public function tasks(Workspace $workspace): Response
    {
        return $this->show($workspace);
    }

    /**
     * Shape a task for the tasks view, matching the sample dashboard task
     * payload so the frontend only ever deals with one task shape.
     *
     * @return array{id: int, name: string, assignee: string, status: string, progress: int, due: string|null}
     */
    private function presentTask(Task $task): array
    {
        return [
            'id' => $task->id,
            'name' => $task->name,
            // Null-safe access without `?->`: the belongs-to relations can be
            // null (status or assignee deleted), and `??` guards the access.
            'assignee' => $task->assignee->name ?? 'Unassigned',
            'status' => $task->status->name ?? 'To Do',
            'progress' => $task->progress,
            'due' => $task->due_date?->format('d/m/Y'),
            'assignee_ids' => $task->assignees->pluck('id')->toArray(),
        ];
    }

    /**
     * Store a newly created workspace.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:workspaces,name'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $this->workspaceRepo->create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Workspace created successfully.')]);

        return redirect()->back();
    }

    /**
     * Update the specified workspace.
     */
    public function update(Request $request, Workspace $workspace): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('workspaces', 'name')->ignore($workspace->id)],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $this->workspaceRepo->update($workspace->id, $validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Workspace updated successfully.')]);

        return redirect()->back();
    }

    /**
     * Remove the specified workspace.
     */
    public function destroy(Workspace $workspace): RedirectResponse
    {
        $this->workspaceRepo->delete($workspace->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Workspace deleted successfully.')]);

        return redirect()->back();
    }
}
