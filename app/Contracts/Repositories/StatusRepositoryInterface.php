<?php

namespace App\Contracts\Repositories;

use App\Models\Status;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface StatusRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<int, Status>
     */
    public function getAllPaginated(?string $search = null, int $perPage = 10): LengthAwarePaginator;

    public function findById(int $id): ?Status;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Status;

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): Status;

    public function delete(int $id): bool;

    /**
     * @return Collection<int, Status>
     */
    public function getAll(): Collection;
}
