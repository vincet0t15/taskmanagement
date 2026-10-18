<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Create the default administrator account and grant it the
     * Super Admin role.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'System Administrator',
                'password' => 'password',
            ],
        );

        $admin->syncRoles(['Super Admin']);
    }
}
