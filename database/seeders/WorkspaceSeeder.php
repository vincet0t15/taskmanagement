<?php

namespace Database\Seeders;

use App\Models\Workspace;
use Illuminate\Database\Seeder;

class WorkspaceSeeder extends Seeder
{
    /**
     * Seed the default workspaces.
     *
     * These are the baseline containers tasks are grouped into.
     */
    public function run(): void
    {
        $workspaces = [
            ['name' => 'General', 'description' => 'Default workspace for ungrouped work.'],
            ['name' => 'Operations', 'description' => 'Day-to-day operational tasks and deliverables.'],
            ['name' => 'Projects', 'description' => 'Time-bound initiatives and programs.'],
            ['name' => 'Admin', 'description' => 'Internal administrative and compliance work.'],
        ];

        foreach ($workspaces as $workspace) {
            Workspace::updateOrCreate(
                ['name' => $workspace['name']],
                $workspace,
            );
        }
    }
}
