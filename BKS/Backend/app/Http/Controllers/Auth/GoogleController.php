<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;
use App\Models\Rol;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    // Redirige al usuario a Google
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    // Recibe la respuesta de Google
    public function callback()
    {
        $googleUser = Socialite::driver('google')->user();

        // Busca el usuario por alguno de los dos correos
        $usuario = Usuario::where('correo_Empresarial', $googleUser->email)
            ->orWhere('correo_personal', $googleUser->email)
            ->first();

        // Por si no exite lo crea 
        if(!$usuario){

            $rol = Rol::where('nombreRol', 'cliente')->first();

            $usuario = Usuario::create([
                'nombres' => $googleUser->user['given_name'] ?? $googleUser->name,
                'apellidos' => $googleUser->user['family_name'] ?? '',
                'correo_Empresarial' => $googleUser->email,
                'correo_Verificado' => now(),
                'imagen_Usuario' => $googleUser->avatar,
                'contrasena' => Hash::make(Str::random(20)),
                'activo' => 1,
                'id_Rol' => $rol->id,
            ]);
        }

        $rol = Rol::find($usuario->id_Rol);

        $nombreRol = $rol?->nombreRol ?? 'cliente';

        // Generamos el JWT 
        $payload = [
            'id' => $usuario->id,
            'rol' => strtolower($nombreRol),
            'nombre' => $usuario->nombres.' '.$usuario->apellidos,
            'exp' => now()->addHours(8)->timestamp,
        ];

        // TOKEN
        $token = JWT::encode($payload, env('JWT_SECRET'), 'HS256');

        $usuarioData = [
            'id' => $usuario->id,
            'nombres' => $usuario->nombres.' '.$usuario->apellidos,
            'rol' => strtolower($nombreRol),
            'email' => $usuario->correo_Empresarial ?? $usuario->correo_Personal,
        ];

        // Redireccion al Front
        return redirect("http://localhost:5173/google-success"
            .'?token='.urlencode($token)
            .'&usuario='.urlencode(json_encode($usuarioData)));
    }
}