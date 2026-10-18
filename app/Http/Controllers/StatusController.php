<?php

namespace App\Http\Controllers;

use App\Contracts\Repositories\StatusRepositoryInterface;
use App\Models\Status;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StatusController extends Controller
{
    public function __construct(
        private readonly StatusRepositoryInterface $statusRepo,
    ) {}

    /**
     * Display a listing of the statuses.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        return Inertia::render('statuses/index', [
            'statuses' => $this->statusRepo->getAllPaginated($search),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created status.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:statuses,name'],
            'slug' => ['required', 'string', 'max:255', 'unique:statuses,slug'],
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'description' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:9999'],
        ]);

        $this->statusRepo->create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Status created successfully.')]);

        return redirect()->back();
    }

    /**
     * Update the specified status.
     */
    public function update(Request $request, Status $status): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('statuses', 'name')->ignore($status->id)],
            'slug' => ['required', 'string', 'max:255', Rule::unique('statuses', 'slug')->ignore($status->id)],
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'description' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:9999'],
        ]);

        $this->statusRepo->update($status->id, $validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Status updated successfully.')]);

        return redirect()->back();
    }

    /**
     * Remove the specified status.
     */
    public function destroy(Status $status): RedirectResponse
    {
        $this->statusRepo->delete($status->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Status deleted successfully.')]);

        return redirect()->back();
    }
}
