<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subcategoria extends Model
{
    use HasFactory;

    protected $table = 'subCategories';
    protected $fillable = ['nombre_Subcategoria','descripcion','activo','id_Categorias'];
    public $timestamps = false;

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'id_Categorias');
    }

    public function productos()
    {
        return $this->hasMany(Producto::class, 'id_SubCategorias');
    }
}
