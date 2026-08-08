<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        //Campos del MYSQL
        Schema::create('contrasena_reset', function (Blueprint $table){
            $table->id();
            $table->unsignedBigInteger('usuario_id')->nullable();
            $table->string('codigo', 6)->nullable();
            $table->timestamp('creado')->useCurrent();
            $table->dateTime('expiracion')->nullable();
            $table->boolean('usado')->default(false);
            $table->enum('proposito', ['reset', 'verificacion'])->default('reset')->nullable();

            $table->foreign('usuario_id')->constrained('usuarios')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contrasena_reset');
    }
};
