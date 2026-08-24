<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Storefront\CartController;
use App\Http\Controllers\Storefront\CollectionController;
use App\Http\Controllers\Storefront\HomeController;
use App\Http\Controllers\Storefront\ProductController;
use App\Http\Controllers\Storefront\SearchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products/{handle}', [ProductController::class, 'show'])->name('products.show');
Route::get('/collections/{handle}', [CollectionController::class, 'show'])->name('collections.show');
Route::get('/cart', [CartController::class, 'show'])->name('cart.show');
Route::get('/search', [SearchController::class, 'show'])->name('search.show');
Route::get('/search/predictive', [SearchController::class, 'predictive'])->name('search.predictive');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
