<?php

namespace App\Contracts\Repositories;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    /**
     * The concrete paginator is typed (instead of its contract) so callers can
     * use through() to reshape the rows for the view.
     *
     * @return LengthAwarePaginator<int, User>
     */
    public function getAllPaginated(?string $search = null, int $perPage = 10): LengthAwarePaginator;

    public function findById(int $id): ?User;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): User;
}
