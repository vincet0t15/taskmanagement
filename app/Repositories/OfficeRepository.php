<?php

namespace App\Repositories;

use App\Contracts\Repositories\OfficeRepositoryInterface;
use App\Models\Office;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class OfficeRepository implements OfficeRepositoryInterface
{
    public function __construct(protected Office $model) {}

    /**
     * @return LengthAwarePaginator<int, Office>
     */
    public function getAllPaginated(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model->query()
            ->when($search, function ($query, string $search): void {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findById(int $id): ?Office
    {
        return $this->model->find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Office
    {
        return $this->model->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): Office
    {
        $office = $this->model->findOrFail($id);
        $office->update($data);

        return $office;
    }

    public function delete(int $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * @return Collection<int, Office>
     */
    public function getAll(): Collection
    {
        return $this->model->query()->orderBy('name')->get();
    }
}
