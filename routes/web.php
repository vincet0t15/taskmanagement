<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/offices.php';
require __DIR__.'/roles.php';
require __DIR__.'/permissions.php';
require __DIR__.'/statuses.php';
require __DIR__.'/workspaces.php';
