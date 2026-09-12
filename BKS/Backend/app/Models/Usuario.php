<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model 
{
    use HasFactory;

    protected $table = 'users';
    protected $fillable = [
        'nombres',
        'apellidos',
        'numero_Documento',
        'prefijo',
        'numero_Celular',
        'contrasena',
        'correo_Empresarial',
        'correo_Personal',
        'imagen_Usuario',
        'departamento',
        'ciudad',
        'barrio',
        'direccion',
        'codigo_Postal',
        'indicaciones_Adicionales',

        'correo_Verificado',
        'acepta_terminos',
        'fecha_aceptacion_terminos',
        'confirma_mayoria_edad',
        'fecha_confirmacion_edad',
        'activo',

        'id_Document',
        'id_Rol',
        'id_Membresia',
    ];
    public $timestamps = false;

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_Rol');
    }

    public function membresia()
    {
        return $this->belongsTo(membership::class, 'id_Membresia');
    }
    
    public function movimientos()
    {
        return $this->hasMany(Movimiento::class, 'id_Usuarios');
    }
}
