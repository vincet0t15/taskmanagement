<?php

namespace App\Contracts\Repositories;

use App\Models\Office;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface OfficeRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<int, Office>
     */
    public function getAllPaginated(?string $search = null, int $perPage = 10): LengthAwarePaginator;

    public function findById(int $id): ?Office;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Office;

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): Office;

    public function delete(int $id): bool;

    /**
     * @return Collection<int, Office>
     */
    public function getAll(): Collection;
}
