<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Campos del MYSQL

        Schema::create('categories', function(Blueprint $table){
            $table->id();
            $table->string('nombre_Categoria', 50)->nullable();
            $table->string('descripcion', 100)->nullable();
            $table->boolean('activo')->default('true');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
