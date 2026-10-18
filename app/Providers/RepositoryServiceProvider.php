<?php

namespace App\Providers;

use App\Contracts\Repositories\OfficeRepositoryInterface;
use App\Repositories\OfficeRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register repository bindings.
     */
    public function register(): void
    {
        $this->app->bind(OfficeRepositoryInterface::class, OfficeRepository::class);
    }
}
