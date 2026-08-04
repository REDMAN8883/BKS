<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        //Campos del MYSQL
        Schema::create('subCategories', function(Blueprint $table){
            $table->id();
            $table->string('nombre_Subcategoria', 50)->nullable();
            $table->string('descripcion', 100);
            $table->boolean('activo')->default(true);
            $table->unsignedBigInteger('id_Categorias');

            $table->foreign('id_Categorias')->references('id')->on('categories');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
