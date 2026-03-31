<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject 
{
    use HasFactory, Notifiable;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
    ];

    protected $hidden = [
        'password',
    ];



    /**
     * Lấy định danh lưu trữ trong claim của JWT (thường là khóa chính).
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Trả về mảng chứa các claim tùy chỉnh sẽ được thêm vào JWT.
     */
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role, // Thêm role vào token để FE check nhanh nếu cần
        ];
    }

    public function missingPersons()
    {
        return $this->hasMany(MissingPerson::class, 'created_by');
    }

    public function sightings()
    {
        return $this->hasMany(Sighting::class, 'reported_by');
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'user_id');
    }
}