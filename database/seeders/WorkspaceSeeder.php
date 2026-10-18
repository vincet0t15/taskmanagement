<?php

namespace Database\Seeders;

use App\Models\Workspace;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

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
            ['name' => 'General', 'color' => '#64748B', 'description' => 'Default workspace for ungrouped work.'],
            ['name' => 'Operations', 'color' => '#2563EB', 'description' => 'Day-to-day operational tasks and deliverables.'],
            ['name' => 'Projects', 'color' => '#16A34A', 'description' => 'Time-bound initiatives and programs.'],
            ['name' => 'Admin', 'color' => '#D97706', 'description' => 'Internal administrative and compliance work.'],
        ];

        foreach ($workspaces as $workspace) {
            Workspace::updateOrCreate(
                ['slug' => Str::slug($workspace['name'])],
                $workspace,
            );
        }
    }
}
