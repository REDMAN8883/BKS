<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\FacebookController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-basic', function() {
    return response()->json(['mensaje' => 'Test básico funciona']);
});

// Google
Route::get('/auth/google', [GoogleController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

// Facebook
Route::get('/auth/facebook', [FacebookController::class, 'redirect']);
Route::get('/auth/facebook/callback', [FacebookController::class, 'callback']);