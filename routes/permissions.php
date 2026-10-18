<?php

use App\Http\Controllers\Administration\PermissionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('permissions', [PermissionController::class, 'index'])->middleware('permission:permissions.view')->name('permissions.index');
    Route::post('permissions', [PermissionController::class, 'store'])->middleware('permission:permissions.create')->name('permissions.store');
    Route::put('permissions/{permission}', [PermissionController::class, 'update'])->middleware('permission:permissions.edit')->name('permissions.update');
    Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->middleware('permission:permissions.delete')->name('permissions.destroy');
});
