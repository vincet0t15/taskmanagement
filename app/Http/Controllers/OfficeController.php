<?php

namespace App\Http\Controllers;

use App\Contracts\Repositories\OfficeRepositoryInterface;
use App\Models\Office;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfficeController extends Controller
{
    public function __construct(
        private readonly OfficeRepositoryInterface $officeRepo,
    ) {}

    /**
     * Display a listing of the offices.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        return Inertia::render('offices/index', [
            'offices' => $this->officeRepo->getAllPaginated($search),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created office.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:offices,name'],
            'code' => ['required', 'string', 'max:255', 'unique:offices,code'],
        ]);

        $this->officeRepo->create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Office created successfully.')]);

        return redirect()->back();
    }

    /**
     * Update the specified office.
     */
    public function update(Request $request, Office $office): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:offices,name,'.$office->id],
            'code' => ['required', 'string', 'max:255', 'unique:offices,code,'.$office->id],
        ]);

        $this->officeRepo->update($office->id, $validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Office updated successfully.')]);

        return redirect()->back();
    }

    /**
     * Remove the specified office.
     */
    public function destroy(Office $office): RedirectResponse
    {
        $this->officeRepo->delete($office->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Office deleted successfully.')]);

        return redirect()->back();
    }
}
