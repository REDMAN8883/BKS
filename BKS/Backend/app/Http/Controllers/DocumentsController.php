<?php

namespace App\Http\Controllers;

use App\Models\Document;
// use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Mostrar todos los tipos de documento.
     */
    public function index()
    {
        return response()->json(Document::all(), 200);
    }

    /**
     * Mostrar un tipo de documento por ID.
     */
    public function show($id)
    {
        $document = Document::findOrFail($id);

        return response()->json($document, 200);
    }
}