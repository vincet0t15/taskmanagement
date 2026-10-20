<?php

namespace App\Contracts\Repositories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

interface TaskRepositoryInterface
{
    /**
     * @return Collection<int, Task>
     */
    public function getByWorkspace(int $workspaceId): Collection;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Task;

    public function findById(int $id): ?Task;

    public function delete(int $id): bool;
}
