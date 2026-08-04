<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Categoria extends Model
{
    use HasFactory;

    protected $table = 'categories';
    protected $fillable = ['nombre_Categoria','descripcion','activo'];
    public $timestamps = false;

    public function subcategorias()
    {
        return $this->hasMany(Subcategoria::class, 'id_Categorias');
    }
}
