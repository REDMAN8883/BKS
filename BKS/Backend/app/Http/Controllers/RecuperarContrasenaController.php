<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Log;

// Importaciones para el MAIL
use Illuminate\Support\Facades\Mail;
use App\Mail\CodigoRecuperacionMail;

class RecuperarContrasenaController extends Controller
{
    public function RecuperarContrasena(Request $request)
    {
        // Validar correo del usuario.
        $request->validate([
            'correo' => 'required|email'
        ]);
        
        // Busca el correo del usuario.
        $usuario = Usuario::where('correo_Empresarial', $request->correo)
            ->orWhere('correo_Personal', $request->correo)
            ->first();

        if(!$usuario){
            return response()->json([
                'message' => 'Si el correo existe se enviar un codigo'
            ]);
        }
        
        if ($usuario) {
            // Eliminar codigos ya expirados
            DB::table('Contrasena_reset')
                ->where('expiracion', '<', now())
                ->delete();

            // Codigo activo
            $codigoActivo = DB::table('Contrasena_reset')
                ->where('usuario_id', $usuario->id)
                ->where('usado', 0)
                ->where('expiracion', '>', now())
                ->first();

            if ($codigoActivo) {
                return response()->json([
                    'message' => 'Ya tienes un codigo activo. Revisa tu correo'
                ]);
            }

            // Crea el codigo
            $codigo = random_int(100000, 999999);

            // Inserta el codigo en la BD
            DB::table('Contrasena_reset')->insert([
                'usuario_id' => $usuario->id,
                'codigo' => $codigo,
                'expiracion' => now()->addMinutes(5),
                'usado' => false,
                'creado' => now(),
                'proposito' => 'reset'
            ]);
        }

        if($usuario->correo_Empresarial){
            $correoDestino = $usuario->correo_Empresarial;
        } else if ($usuario->correo_Personal) {
            $correoDestino = $usuario->correo_Personal;
        } else {
            return response()->json([
                'error' => 'El usuario no tiene ningun correo registrado'
            ]);
        }

        MAIL::to($correoDestino)
            ->send(new CodigoRecuperacionMail($codigo));

        // Despues de guardar el codigo - guardamos el ID del usuario que lo pidio
        return response()->json([
            'mensaje'=> 'Codigo enviado correctamente.',
            'usuario_id' => $usuario->id
        ]);

        // Mensaje por si el usuario no existe.
        if(!$usuario){
            return response()->json([
                'message'=>'usuario no encontrado'
            ], 422);
        }
    }
}
