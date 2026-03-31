<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeederCustom extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('comments')->truncate();
        DB::table('reports')->truncate();
        DB::table('person_images')->truncate();
        DB::table('posts')->truncate();
        DB::table('missing_persons')->truncate();
        DB::table('locations')->truncate();
        DB::table('users')->truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // USERS
        DB::table('users')->insert([
            [
                'full_name' => 'Nguyen Van A',
                'email' => 'a@gmail.com',
                'phone' => '0900000001',
                'password_hash' => bcrypt('123456'),
                'role' => 'USER',
                'status' => 'ACTIVE',
                'created_at' => now()
            ],
            [
                'full_name' => 'Tran Thi B',
                'email' => 'b@gmail.com',
                'phone' => '0900000002',
                'password_hash' => bcrypt('123456'),
                'role' => 'ADMIN',
                'status' => 'ACTIVE',
                'created_at' => now()
            ]
        ]);

        // LOCATIONS
        DB::table('locations')->insert([
            [
                'province' => 'Ho Chi Minh',
                'district' => 'District 1',
                'ward' => 'Ben Nghe',
                'lat' => 10.7769,
                'lng' => 106.7009
            ],
            [
                'province' => 'Ha Noi',
                'district' => 'Ba Dinh',
                'ward' => 'Kim Ma',
                'lat' => 21.0333,
                'lng' => 105.8500
            ]
        ]);

        // MISSING PERSONS
        DB::table('missing_persons')->insert([
            [
                'full_name' => 'Le Van C',
                'date_of_birth' => '2000-01-01',
                'gender' => 'MALE',
                'height' => 170,
                'weight' => 65,
                'last_seen_date' => '2024-01-01',
                'location_id' => 1,
                'description' => 'Mac ao den, quan jean',
                'created_by' => 1,
                'created_at' => now()
            ],
            [
                'full_name' => 'Pham Thi D',
                'date_of_birth' => '1995-05-05',
                'gender' => 'FEMALE',
                'height' => 160,
                'weight' => 50,
                'last_seen_date' => '2024-02-01',
                'location_id' => 2,
                'description' => 'Mang tui xach mau do',
                'created_by' => 2,
                'created_at' => now()
            ]
        ]);

        // POSTS
        DB::table('posts')->insert([
            [
                'user_id' => 1,
                'missing_person_id' => 1,
                'title' => 'Tim nguoi than',
                'content' => 'Xin moi nguoi giup do',
                'reward_amount' => 5000000,
                'status' => 'APPROVED'
            ]
        ]);

        // REPORTS
        DB::table('reports')->insert([
            [
                'missing_person_id' => 1,
                'reporter_name' => 'Nguoi dan',
                'reporter_phone' => '0911111111',
                'location' => 'Cho Ben Thanh',
                'description' => 'Thay nguoi nay o day'
            ]
        ]);
    }
}