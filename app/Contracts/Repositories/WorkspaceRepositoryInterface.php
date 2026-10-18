<?php

namespace App\Contracts\Repositories;

use App\Models\Workspace;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface WorkspaceRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<int, Workspace>
     */
    public function getAllPaginated(?string $search = null, int $perPage = 10): LengthAwarePaginator;

    public function findById(int $id): ?Workspace;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Workspace;

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): Workspace;

    public function delete(int $id): bool;

    /**
     * @return Collection<int, Workspace>
     */
    public function getAll(): Collection;
}
