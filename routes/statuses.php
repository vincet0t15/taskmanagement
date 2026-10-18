<?php

use App\Http\Controllers\StatusController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('statuses', [StatusController::class, 'index'])->middleware('permission:statuses.view')->name('statuses.index');
    Route::post('statuses', [StatusController::class, 'store'])->middleware('permission:statuses.create')->name('statuses.store');
    Route::put('statuses/{status}', [StatusController::class, 'update'])->middleware('permission:statuses.edit')->name('statuses.update');
    Route::delete('statuses/{status}', [StatusController::class, 'destroy'])->middleware('permission:statuses.delete')->name('statuses.destroy');
});
