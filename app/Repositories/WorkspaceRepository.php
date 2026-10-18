<?php

namespace App\Repositories;

use App\Contracts\Repositories\WorkspaceRepositoryInterface;
use App\Models\Workspace;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class WorkspaceRepository implements WorkspaceRepositoryInterface
{
    public function __construct(protected Workspace $model) {}

    /**
     * @return LengthAwarePaginator<int, Workspace>
     */
    public function getAllPaginated(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model->query()
            ->when($search, function ($query, string $search): void {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findById(int $id): ?Workspace
    {
        return $this->model->find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Workspace
    {
        return $this->model->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): Workspace
    {
        $workspace = $this->model->findOrFail($id);
        $workspace->update($data);

        return $workspace;
    }

    public function delete(int $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * @return Collection<int, Workspace>
     */
    public function getAll(): Collection
    {
        return $this->model->query()->orderBy('name')->get();
    }
}
