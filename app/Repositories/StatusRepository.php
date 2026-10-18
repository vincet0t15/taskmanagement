<?php

namespace App\Repositories;

use App\Contracts\Repositories\StatusRepositoryInterface;
use App\Models\Status;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class StatusRepository implements StatusRepositoryInterface
{
    public function __construct(protected Status $model) {}

    /**
     * @return LengthAwarePaginator<int, Status>
     */
    public function getAllPaginated(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model->query()
            ->when($search, function ($query, string $search): void {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findById(int $id): ?Status
    {
        return $this->model->find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Status
    {
        return $this->model->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): Status
    {
        $status = $this->model->findOrFail($id);
        $status->update($data);

        return $status;
    }

    public function delete(int $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * @return Collection<int, Status>
     */
    public function getAll(): Collection
    {
        return $this->model->query()->orderBy('sort_order')->orderBy('name')->get();
    }
}
