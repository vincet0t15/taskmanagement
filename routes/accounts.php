<?php

use App\Http\Controllers\Administration\AccountController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('accounts', [AccountController::class, 'index'])->middleware('permission:accounts.view')->name('accounts.index');
    Route::post('accounts', [AccountController::class, 'store'])->middleware('permission:accounts.create')->name('accounts.store');
});
