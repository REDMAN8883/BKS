<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Campos de la MYSQL
        Schema::create('documents', function (Blueprint $table){
            $table->id();
            $table->enum('document', ['Cedula de ciudadania', 'Tarjeta de indentidad', 'Cedula de extranjeria', 'otro'])->nullable();
            $table->enum('abreviatura',['CC', 'TI', 'CE', 'Otro'])->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
