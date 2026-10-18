<?php

use App\Http\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('workspaces', [WorkspaceController::class, 'index'])->middleware('permission:workspaces.view')->name('workspaces.index');
    Route::get('workspaces/{workspace}', [WorkspaceController::class, 'show'])->middleware('permission:workspaces.view')->name('workspaces.show');
    Route::post('workspaces', [WorkspaceController::class, 'store'])->middleware('permission:workspaces.create')->name('workspaces.store');
    Route::put('workspaces/{workspace}', [WorkspaceController::class, 'update'])->middleware('permission:workspaces.edit')->name('workspaces.update');
    Route::delete('workspaces/{workspace}', [WorkspaceController::class, 'destroy'])->middleware('permission:workspaces.delete')->name('workspaces.destroy');
});
