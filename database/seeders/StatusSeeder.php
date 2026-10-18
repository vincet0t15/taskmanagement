<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    /**
     * Seed the default task statuses.
     *
     * These are the baseline workflow states every task moves through.
     */
    public function run(): void
    {
        $statuses = [
            ['name' => 'To Do', 'color' => '#64748B', 'sort_order' => 1, 'description' => 'Not yet started.'],
            ['name' => 'In Progress', 'color' => '#2563EB', 'sort_order' => 2, 'description' => 'Currently being worked on.'],
            ['name' => 'On Hold', 'color' => '#D97706', 'sort_order' => 3, 'description' => 'Paused pending a dependency or decision.'],
            ['name' => 'Completed', 'color' => '#16A34A', 'sort_order' => 4, 'description' => 'Finished and verified.'],
            ['name' => 'Cancelled', 'color' => '#DC2626', 'sort_order' => 5, 'description' => 'No longer being pursued.'],
        ];

        foreach ($statuses as $status) {
            Status::updateOrCreate(
                ['name' => $status['name']],
                $status,
            );
        }
    }
}
