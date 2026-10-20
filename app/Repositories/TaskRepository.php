<?php

namespace App\Repositories;

use App\Contracts\Repositories\TaskRepositoryInterface;
use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

class TaskRepository implements TaskRepositoryInterface
{
    public function __construct(protected Task $model) {}

    /**
     * Tasks for a workspace, newest first, with the relations the tasks view
     * needs so the list does not fall into N+1 queries.
     *
     * @return Collection<int, Task>
     */
    public function getByWorkspace(int $workspaceId): Collection
    {
        return $this->model->query()
            ->with(['status', 'assignee', 'assignees'])
            ->where('workspace_id', $workspaceId)
            ->orderByDesc('id')
            ->get();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Task
    {
        return $this->model->create($data);
    }

    public function findById(int $id): ?Task
    {
        return $this->model->find($id);
    }

    public function delete(int $id): bool
    {
        return (bool) $this->model->destroy($id);
    }
}
