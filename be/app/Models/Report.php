<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    protected $table = 'reports';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'missing_person_id',
        'report_message',
    ];

    //Quan hệ: Ai là người gửi báo cáo này?
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    //Quan hệ: Báo cáo này dành cho hồ sơ người mất tích nào?
    public function missingPerson()
    {
        return $this->belongsTo(MissingPerson::class, 'missing_person_id');
    }
}