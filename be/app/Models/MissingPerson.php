<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MissingPerson extends Model
{
    protected $table = 'missing_persons';
    public $timestamps = false; 
    protected $fillable = [
        'full_name',
        'gender',
        'birth_date',
        'last_seen_date',
        'last_seen_location',
        'description',
        'status',
        'created_by',
    ];

    // Quan hệ: Một hồ sơ có nhiều hình ảnh
    public function images() {
        return $this->hasMany(Image::class, 'missing_person_id');
    }

    // Quan hệ: Một hồ sơ có nhiều manh mối (sightings)
    public function sightings() {
        return $this->hasMany(Sighting::class, 'missing_person_id');
    }
    
    // Quan hệ: Hồ sơ này được tạo bởi User nào?
    public function creator() {
        return $this->belongsTo(User::class, 'created_by');
    }

    
}