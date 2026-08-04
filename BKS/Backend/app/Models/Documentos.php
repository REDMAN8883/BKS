<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $table = 'documents';

    protected $fillable = [
        'nombre',
        'abreviatura'
    ];

    public $timestamps = false;

    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'id_Document');
    }
}