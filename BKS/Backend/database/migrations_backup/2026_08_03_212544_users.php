<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Campos de la MYSQL
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nombres', 50)->nullable();
            $table->string('apellidos', 50)->nullable();
            $table->unsignedBigInteger('id_Document')->nullable();
            $table->string('numero_Documento', 100)->nullable();
            $table->string('numero_Celular', 100)->nullable();
            $table->string('pais', 70)->nullable();
            $table->string('ciudad', 200)->nullable();
            $table->string('contrasena', 255)->nullable();
            $table->string('correo_Empresarial', 100)->nullable();
            $table->string('correo_Personal', 100)->nullable();
            $table->string('imagen_Usuario', 255)->nullable();
            $table->timestamp('correo_Verificado')->nullable();
            $table->boolean('activo')->default(true);
            $table->unsignedBigInteger('id_Rol')->nullable();

            $table->foreign('id_Rol')->references('id')->on('roles');
            $table->foreign('id_Document')->references('id')->on('documents');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
