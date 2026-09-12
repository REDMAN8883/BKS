<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\SubcategoriaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\RecetaController;
use App\Http\Controllers\MovimientoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecuperarContrasenaController;
use App\Http\Controllers\CodigoController;
use App\Http\Controllers\DocumentsController;
use App\Http\Controllers\MembershipController;


// Ruta del login
Route::post('/login', [AuthController::class, 'login']);    
Route::put('/register', [AuthController::class, 'register']);
Route::post('/usuarios', [UsuarioController::class, 'store']);
// Ruta de recuperacion, verificar y cambiar contraseña
Route::post('codeSending', [RecuperarContrasenaController::class, 'verifyEmail']);
Route::post('/confirmCode', [CodigoController::class, 'existingCode']);
Route::put('/passwordChange', [AuthController::class, 'passwordChange']);
// Ruta de documentos (llamado)
Route::get('/documents', [DocumentsController::class, 'index']);
// Barrios
Route::get('/barrios', [UsuarioController::class, 'barrios']);

// Rutas protegidas para el Admin
Route::middleware(['auth.jwt','role:admin'])->group(function (){
    // Ruta de Categorias
    Route::apiResource('categorias', CategoriaController::class);
    // Ruta de subcategorias
    Route::apiResource('subcategorias', SubcategoriaController::class);
    // Ruta de Movimientos
    Route::apiResource('movimientos', MovimientoController::class);

});

// Rutas protegidas para el Cliente
Route::middleware(['auth.jwt','role:admin,cliente'])->group(function (){
    // Ruta de Productos
    Route::apiResource('productos', ProductoController::class);
    // Ruta de Recetas
    Route::apiResource('recetas', RecetaController::class);
    // Ruta de membresias
    Route::get('/membresias', [MembershipController::class, 'index']);
});

Route::middleware(['auth.jwt'])->group(function (){
    // Ruta de Usuarios
    Route::apiResource('usuarios', UsuarioController::class)
        ->except(['store']);
});
