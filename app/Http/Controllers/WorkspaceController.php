<?php

namespace App\Http\Controllers;

use App\Contracts\Repositories\WorkspaceRepositoryInterface;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceController extends Controller
{
    public function __construct(
        private readonly WorkspaceRepositoryInterface $workspaceRepo,
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
     * Store a newly created workspace.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:workspaces,name'],
            'slug' => ['required', 'string', 'max:255', 'unique:workspaces,slug'],
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
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
            'slug' => ['required', 'string', 'max:255', Rule::unique('workspaces', 'slug')->ignore($workspace->id)],
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
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
