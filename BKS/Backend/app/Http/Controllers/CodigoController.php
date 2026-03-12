<?php

namespace App\Http\Controllers;

use App\Models\Contrasena_rest;
use App\Models\Usuario;
use Illuminate\Http\Request;

class CodigoController extends Controller 
{
    public function verificarCorreo(Request $request){
        // Peticiones de los campos que necesita para validar el codigo.
        $codigo = Contrasena_rest::where('usuario_id', $request->usuario_id)
        ->where('codigo', $request->codigo)
        ->where('proposito', 'reset')
        ->where('usado', false)
        ->where('expiracion', '>', now())
        ->first();

        // Mensaje de rechazo al no tener o estar vencido el codigo 
        if(!$codigo){
            return response()->json(['mensaje' => 'Codigo invalido o vencido'], 400);
        }

        // Activar usuario
        Usuario::where('id', $request->usuario_id)
            ->update(['correo_Verificado' => now()]);

        // Marcamos si el codigo ya se uso o no
        $codigo->update(['usado' => true]);

        return response()->json(['mensaje' => 'Correo verificado correctamente']);
    }
}
