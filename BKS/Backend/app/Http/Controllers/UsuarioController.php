<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\membership;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UsuarioController extends Controller
{
    // Listar usuarios
    public function index(Request $request)
    {
        $user = $request->attributes->get('user');

        $usuario = Usuario::with('rol', 'membresia')->find($user->id);

        if (!$usuario) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        return response()->json($usuario);
    }

    // Crear usuario
    public function store(Request $request)
    {
        //Validamos todos los campos
        $request->validate([
            'nombres' => 'required|string|max:50',
            'apellidos' => 'required|string|max:50',
            'id_Document' => 'required|integer|exists:documents,id',
            'numero_Documento' => 'nullable|string|max:100',
            'prefijo' => 'required|string|max:10',
            'numero_Celular' => 'required|string|max:100',
            'contrasena' => 'required|string|max:255',
            'correo_Empresarial' => 'nullable|string|max:100',
            'correo_Personal' => 'nullable|string|max:100',
            'imagen_Usuario' => 'nullable|string|max:255',
            'acepta_terminos' => 'required|boolean',
            'confirma_mayoria_edad' => 'required|boolean',
            'activo' => 'nullable|boolean',
        ]);
        $data = $request->all();
        // Asignamos el rol de cliente por defecto.
        $data['id_Rol'] = 4;
        // Asignamos el Plan Basico al usuario nuevo
        $membresiaGratis = membership::where('nombre', 'Plan Básico')->first();
        $data['id_Membresia'] =$membresiaGratis->id;
        // Verificamos el usuario nuevo
        $data['correo_Verificado'] = now();

        // Validamos los checks y los guardamos
        $data['fecha_aceptacion_terminos'] = $request->acepta_terminos
            ? now()
            : null;

        $data['fecha_confirmacion_edad'] = $request->confirma_mayoria_edad
            ? now()
            : null;

        //Encriptamos la contraseña
        $data['contrasena'] = Hash::make($request->contrasena);
        // Creamos al usuario nuevo
        $usuarios = Usuario::create($data);

        return response()->json([
            'message' => 'Usuario creado con éxito',
            'data' => $usuarios
        ], 201);
    }

    // Mostrar usuario
    public function show(string $id)
    {
        $usuarios = Usuario::find($id);

        if(!$usuarios){
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        return response()->json($usuarios);
    }

    // Actualizar usuario
    public function update(Request $request, string $id)
    {
        $usuario = Usuario::find($id);

        if(!$usuario){
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        $data = $request->only([
            'nombres',
            'apellidos',
            'numero_Documento',
            'prefijo',
            'numero_Celular',
            'correo_Empresarial',
            'correo_Personal',
            'departamento',
            'ciudad',
            'barrio',
            'direccion',
            'codigo_Postal',
            'indicaciones_Adicionales',
            'id_Document',
        ]);

        // Guardamos la imagen
        if ($request->hasFile('imagen_Usuario')){
            $ruta = $request->file('imagen_Usuario')
                ->store('profile_Image', 'public');

            $data['imagen_Usuario'] = $ruta;
        }

        $usuario->update($data);

        $usuario->load('rol');
        // $usuario->load(['rol', 'membresia']);

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'data' => $usuario
        ]);
    }

    // Eliminar usuario
    public function destroy(string $id)
    {
        $usuarios = Usuario::find($id);

        if(!$usuarios) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $usuarios->activo = 0;
        $usuarios->save();

        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }
}
