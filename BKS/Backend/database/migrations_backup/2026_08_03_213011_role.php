<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        // Campos de la MYSQL
        Schema::create('roles', function (Blueprint $table){
            $table->id();
            $table->enum('rol', ['admin', 'moderador', 'empleado', 'cliente']) ->nullable();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
