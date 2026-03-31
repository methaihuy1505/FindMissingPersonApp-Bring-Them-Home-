<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sighting extends Model
{
    protected $table = 'sightings';
    public $timestamps = false;

    protected $fillable = [
        'missing_person_id',
        'reported_by',
        'location',
        'description',
        'sighting_date',
    ];

    // Manh mối này thuộc về hồ sơ nào?
    public function missingPerson() {
        return $this->belongsTo(MissingPerson::class, 'missing_person_id');
    }
    // Ai là người báo manh mối này?
    public function reporter() {
        return $this->belongsTo(User::class, 'reported_by');
    }
}