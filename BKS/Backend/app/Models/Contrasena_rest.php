<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contrasena_rest extends Model 
{
    use HasFactory;

    protected $table = 'contrasena_reset';
    protected $fillable = [
        'usuario_id',
        'codigo',
        'expiracion',
        'usado',
        'creado',
        'proposito'
    ];
    public $timestamps = false;

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_Rol');
    }
    
    public function movimientos()
    {
        return $this->hasMany(Movimiento::class, 'id_Usuarios');
    }
}
