<?php

namespace App\Providers;

use App\Contracts\Repositories\OfficeRepositoryInterface;
use App\Contracts\Repositories\StatusRepositoryInterface;
use App\Contracts\Repositories\WorkspaceRepositoryInterface;
use App\Repositories\OfficeRepository;
use App\Repositories\StatusRepository;
use App\Repositories\WorkspaceRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register repository bindings.
     */
    public function register(): void
    {
        $this->app->bind(OfficeRepositoryInterface::class, OfficeRepository::class);
        $this->app->bind(StatusRepositoryInterface::class, StatusRepository::class);
        $this->app->bind(WorkspaceRepositoryInterface::class, WorkspaceRepository::class);
    }
}
