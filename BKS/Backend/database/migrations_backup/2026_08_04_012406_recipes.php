<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        //Campos de MYSQL

        Schema::create('recipes', function(Blueprint $table){
            $table->id();
            $table->string('imagen_Receta', 255);
            $table->string('nombre_Receta', 50)->nullable();
            // QUITAR ALGUNO DE LOS DOS
            $table->string('descripcion', 100);
            $table->enum('dificultad', ['Baja', 'Media', 'Alta']);
            $table->string('porciones', 50);
            $table->string('notas_Adicionales', 100);
            $table->string('ingredientes', 100);
            $table->string('pasos_Preparacion', 100);
            $table->time('tiempo_Preparacion');
            $table->boolean('activo')->default(true);
            $table->unsignedBigInteger('id_Productos')->nullable();

            $table->foreign('id_Productos')->references('id')->on('products');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
