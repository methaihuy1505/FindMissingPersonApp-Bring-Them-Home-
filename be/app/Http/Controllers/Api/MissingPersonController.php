<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MissingPerson;
use Illuminate\Http\Request;

class MissingPersonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return MissingPerson::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $data = $request->validate([
            'fullname' => 'require',
            'create_by' => 'required|exists:user,id'
        ]);
        return MissingPerson::created($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        return MissingPerson::with(['user','images','reports'])->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $person =   MissingPerson::findOrFail($id);
        $person->updated($request->all());
        return $person;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        MissingPerson::destroy($id);
        return ['message'=>'deleted'];
    }
}
