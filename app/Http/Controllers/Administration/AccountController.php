<?php

namespace App\Http\Controllers\Administration;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Contracts\Repositories\OfficeRepositoryInterface;
use App\Contracts\Repositories\UserRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class AccountController extends Controller
{
    use PasswordValidationRules;
    use ProfileValidationRules;

    public function __construct(
        private readonly UserRepositoryInterface $userRepo,
        private readonly OfficeRepositoryInterface $officeRepo,
    ) {}

    /**
     * Display the employees (account holders) with their credentials summary.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        return Inertia::render('accounts/index', [
            'accounts' => $this->userRepo->getAllPaginated($search)
                ->through(fn (User $user): array => $this->presentEmployee($user)),
            'filters' => [
                'search' => $search,
            ],
            'offices' => $this->officeRepo->getAll(),
            'roles' => Role::query()->orderBy('name')->pluck('name'),
        ]);
    }

    /**
     * Register an employee account with its login credentials.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => $this->nameRules(),
            'username' => $this->usernameRules(),
            'password' => $this->passwordRules(),
            'office_id' => ['nullable', 'integer', Rule::exists('offices', 'id')],
            'role' => ['nullable', 'string', Rule::exists('roles', 'name')],
        ]);

        $user = $this->userRepo->create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => $validated['password'],
            'office_id' => $validated['office_id'] ?? null,
        ]);

        if (! empty($validated['role'])) {
            $user->syncRoles([$validated['role']]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Employee created successfully.')]);

        return redirect()->back();
    }

    /**
     * Shape a user for the employees list.
     *
     * @return array{id: int, name: string, username: string, office: string|null, roles: array<int, string>, created_at: string|null}
     */
    private function presentEmployee(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'office' => $user->office?->name,
            'roles' => $user->roles->pluck('name')->all(),
            'created_at' => $user->created_at?->format('M j, Y'),
        ];
    }
}
