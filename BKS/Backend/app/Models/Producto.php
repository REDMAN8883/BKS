<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'products';
    protected $fillable = [
        'imagen_Producto',
        'nombre_Producto',
        'precio',
        'stock_Actual',
        'stock_Minimo',
        'tipo',
        'unidad',
        'descripcion',
        'fecha_Creacion',
        'ultima_Actualizacion',
        'activo',
        'id_SubCategorias',
    ];
    public $timestamps = false;

    public function recetas()
    {
        return $this->hasMany(Receta::class, 'id_Productos');
    }

    public function movimientos()
    {
        return $this->hasMany(Movimiento::class, 'id_Productos');
    }
}
