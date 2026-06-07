<?php 

namespace App\Http\Controllers;

use App\Models\Rol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller 
{
    public function login(Request $request)
    {
        try {
            Log::info('=== INICIO LOGIN ===');
            Log::info('Request completo:', $request->all());
            Log::info('Content-Type:', [$request->header('Content-Type')]);
            Log::info('Raw input:', [$request->getContent()]);
            
            // Obtener datos del request de múltiples formas
            $correo_Empresarial = $request->input('correo_Empresarial') ?? $request->correo_Empresarial ?? null;
            $contrasena = $request->input('contrasena') ?? $request->contrasena ?? null;

            Log::info('Datos extraídos:', [
                'correo_Empresarial' => $correo_Empresarial,
                'contrasena' => $contrasena ? 'Presente' : 'Ausente'
            ]);

            // Validaciones básicas
            if (empty($correo_Empresarial) || empty($contrasena)) {
                Log::error('Datos faltantes:', [
                    'correo_vacio' => empty($correo_Empresarial),
                    'contrasena_vacia' => empty($contrasena)
                ]);
                return response()->json(['mensaje' => 'Correo y contraseña son requeridos'], 422);
            }

            // Buscar usuario
            Log::info('Buscando usuario en base de datos');
            
            $usuario = DB::table('usuarios')
                ->join('roles', 'usuarios.id_Rol', '=', 'roles.id')
                ->select('usuarios.*', 'roles.nombreRol as rol')
                ->where(function ($query) use ($correo_Empresarial){
                    $query->where('usuarios.correo_Empresarial', $correo_Empresarial)
                        ->orWhere('usuarios.correo_Personal', $correo_Empresarial);
                })
                ->first();

            Log::info('Resultado búsqueda:', ['encontrado' => $usuario ? 'Si' : 'No']);

            if (!$usuario) {
                return response()->json(['mensaje' => 'Usuario no encontrado.'], 401);
            }

            // Verificar contraseña
            Log::info('Verificando contraseña');
            
            if (!Hash::check($contrasena, $usuario->contrasena)) {
                return response()->json(['mensaje' => 'Contraseña incorrecta.'], 401);
            }

            // Verificaion del correo
            if (is_null($usuario->correo_Verificado)){
                return response()->json([
                    'mensaje' => 'Debes verificar tu correo antes de iniciar sesión.'
                ], 403);
            }

            // Crear token JWT
            Log::info('Creando token JWT');
            
            $payload = [
                'id' => $usuario->id,
                'rol' => strtolower($usuario->rol),
                'nombre' => $usuario->nombres . ' ' . $usuario->apellidos,
                'exp' => now()->addHours(3)->timestamp,
            ];

            $jwtSecret = env('JWT_SECRET');

            if (empty($jwtSecret)) {
                Log::error('JWT_SECRET no está configurado en .env');
                return response()->json(['mensaje' => 'Configuración del servidor incorrecta'], 500);
            }

            $token = JWT::encode($payload, $jwtSecret, 'HS256');

            Log::info('Login exitoso');

            return response()->json([
                'token' => $token,
                'usuario' => [
                    'id' => $usuario->id,
                    'nombres' => $usuario->nombres . ' ' . $usuario->apellidos,
                    'rol' => strtolower($usuario->rol),
                    'email' => $usuario->correo_Empresarial,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error en login:', [
                'mensaje' => $e->getMessage(),
                'archivo' => $e->getFile(),
                'linea' => $e->getLine()
            ]);
            
            return response()->json([
                'mensaje' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Funcion para cambiar la contraseña del usuario - para la recuperacion de contraseña
    public function cambiarContrasena(Request $request)
    {
        try{
            Log::info('=== CAMBIAR CONTRASEÑA  ===');

            // Trae los campos del REACT - usuario_Id del localStorage 
            $usuario_id = $request->usuario_id;
            $newPassword = $request->newPassword;
            $confirmPassword = $request->confirmPassword;

            if(!$usuario_id || !$newPassword || !$confirmPassword){
                return response()->json([
                    'mensaje'=>"Todos los campos son obligatorios"
                ], 422);
            }
            if($newPassword !== $confirmPassword){
                return response()->json([
                    'mensaje'=>"Las contraseñas no coinciden"
                ], 422);
            }

            // Busca al usuario en la DB
            $usuario = DB::table('usuarios')->where('id', $usuario_id)->first();
            // Si no llega a encontrar le usuario
            if(!$usuario){
                return response()->json([
                    'mensaje'=>"Usuario no encontrado"
                ], 404);
            }

            // Actualizamos la contraseña del usuario
            DB::table('usuarios')
                ->where('id', $usuario_id)
                ->update([
                    'contrasena'=>Hash::make($newPassword)
                ]);

            return response()->json([
                'mensaje'=>"Contraseña cambiada correctamente"
            ]);
        } catch (\Exception $e){
            return response()->json([
                'mensaje'=>"Error interno del servidor"
            ], 500);
        }
    } 
}