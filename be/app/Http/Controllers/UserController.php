<?php 
namespace App\Http\Controllers;
use App\Models\User;
class UserController extends Controller
{
    public function getAllUser(){
        $users = User::all();
        return response()->json($users);
    }
}
?>