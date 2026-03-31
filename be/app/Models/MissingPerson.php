<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class MissingPerson extends Model
{
    protected $table = 'missing_persons';

    protected $fillable = [
        'full_name',
        'date_of_birth',
        'gender',
        'height',
        'weight',
        'last_seen_date',
        'location_id',
        'description',
        'status',
        'created_by'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function location() {
        return $this->belongsTo(Location::class);
    }

    public function images() {
        return $this->hasMany(PersonImage::class);
    }

    public function reports() {
        return $this->hasMany(Report::class);
    }
}