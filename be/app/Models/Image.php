<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Image extends Model
{
    protected $table = 'images';
    public $timestamps = false;

    protected $fillable = [
        'missing_person_id',
        'image_url',
    ];

    // Ảnh này thuộc về hồ sơ người mất tích nào?
    public function missingPerson() {
        return $this->belongsTo(MissingPerson::class, 'missing_person_id');
    }
}