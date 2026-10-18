<?php

use App\Http\Controllers\OfficeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('offices', [OfficeController::class, 'index'])->name('offices.index');
    Route::post('offices', [OfficeController::class, 'store'])->name('offices.store');
    Route::put('offices/{office}', [OfficeController::class, 'update'])->name('offices.update');
    Route::delete('offices/{office}', [OfficeController::class, 'destroy'])->name('offices.destroy');
});
