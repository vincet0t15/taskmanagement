<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::post('tasks', [TaskController::class, 'store'])->middleware('permission:tasks.create')->name('tasks.store');
});
