<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        //Campos del MYSQL
        Schema::create('products', function(Blueprint $table){
            $table->id();
            $table->string('imagen_Prodcuto', 255);
            $table->string('nombre_Producto', 100)->nullable();
            $table->integer('precio')->nullable();
            $table->integer('stock_Anual')->nullable();
            $table->integer('stokc_Minimo')->nullable();
            $table->enum('tipo', ['terminado', 'materia prima']);
            $table->enum('unidad', ['KG', 'LB', 'unidad']);
            $table->string('descipcion', 100);
            $table->timestamp('fecha_Creacion')->useCurrent();
            $table->timestamp('ultima_Actualizacion')->useCurrent();
            $table->boolean('activo')->default(true);
            $table->unsignedBigInteger('id_SubCategorias')->nullable();

            $table->foreign('id_SubCategorias')->references('id')->on('subCategories');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
