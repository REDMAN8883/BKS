<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        //Campos del MYSQL
        Schema::create('movements', function(Blueprint $table){
            $table->id();
            $table->enum('tipo', ['entrada', 'salida']);
            $table->integer('cantidad');
            $table->string('motivo');
            $table->timestamp('fecha')->nullable();
            $table->boolean('activo')->default(true);
            $table->unsignedBigInteger('id_Productos')->nullable();
            $table->unsignedBigInteger('id_Usuarios')->nullable();

            $table->foreign('id_Productos')->references('id')->on('products');
            $table->foreign('id_usuarios')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movements');
    }
};
