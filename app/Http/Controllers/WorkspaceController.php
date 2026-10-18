<?php

namespace App\Http\Controllers;

use App\Contracts\Repositories\WorkspaceRepositoryInterface;
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
        ]);
    }

    /**
     * Display the tasks view for the specified workspace (styled after Project Detail).
     */
    public function tasks(Workspace $workspace): Response
    {
        return Inertia::render('workspaces/tasks', [
            'workspace' => $workspace,
            'dashboard' => $this->dashboardData->for($workspace),
        ]);
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
