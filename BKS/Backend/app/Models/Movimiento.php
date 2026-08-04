<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movimiento extends Model
{
    use HasFactory;

    protected $table = 'movements';
    protected $fillable = [
        'tipo',
        'cantidad',
        'motivo',
        'fecha',
        'activo',
        'id_Productos',
        'id_Usuarios',
    ];
    public $timestamps = false;

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_Productos');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_Usuarios');
    }
}
