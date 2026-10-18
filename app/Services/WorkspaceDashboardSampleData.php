<?php

namespace App\Services;

use App\Models\Workspace;
use Illuminate\Support\Carbon;

/**
 * Produces deterministic, per-workspace sample data for the workspace
 * dashboard.
 *
 * Seeding Faker with the workspace id keeps every workspace's numbers stable
 * across requests while still differing from one workspace to the next, so the
 * dashboard never flickers between loads during development.
 *
 * This is placeholder data until real task metrics exist. When the tasks
 * module lands, swap the call sites for live aggregates and keep the returned
 * shape so the frontend does not change.
 */
class WorkspaceDashboardSampleData
{
    /**
     * Build the full dashboard payload for the given workspace.
     *
     * @return array<string, mixed>
     */
    public function for(Workspace $workspace): array
    {
        $faker = \Faker\Factory::create();
        $faker->seed($workspace->id);

        $totalTasks = $faker->numberBetween(80, 240);
        $completed = $faker->numberBetween((int) floor($totalTasks * 0.45), (int) floor($totalTasks * 0.72));
        $inProgress = $faker->numberBetween(10, 45);
        $overdue = $faker->numberBetween(0, 14);

        $months = collect(range(5, 0))
            ->map(fn (int $i): string => Carbon::now()->subMonthsNoOverflow($i)->format('M'))
            ->values()
            ->all();

        $days = collect(range(29, 0))
            ->map(fn (int $i): string => Carbon::now()->subDays($i)->format('j'))
            ->values()
            ->all();

        return [
            'stats' => [
                $this->stat('Total Tasks', $totalTasks, $faker->randomFloat(1, -8, 24)),
                $this->stat('In Progress', $inProgress, $faker->randomFloat(1, -12, 18)),
                $this->stat('Completed', $completed, $faker->randomFloat(1, -6, 30)),
                $this->stat('Overdue', $overdue, $faker->randomFloat(1, -25, 8)),
            ],
            // Daily throughput over the last 30 days, two series so the area
            // chart can overlap them the way the reference dashboard does.
            'overview' => [
                'labels' => $days,
                'series' => [
                    ['name' => 'New Tasks', 'data' => $this->series($faker->numberBetween(3, 14), 30)],
                    ['name' => 'Completed', 'data' => $this->series($faker->numberBetween(2, 12), 30)],
                ],
            ],
            // Monthly completions for the bar chart.
            'monthly' => [
                'labels' => $months,
                'data' => $this->series($faker->numberBetween(8, 30), 6),
            ],
            // Single percentage for the donut gauge.
            'efficiency' => [
                'value' => $faker->numberBetween(58, 94),
                'label' => 'Task Efficiency',
            ],
            'highlights' => [
                ['label' => 'Avg. Tasks / Member', 'value' => $faker->randomFloat(1, 6, 18).''],
                ['label' => 'On-time Delivery', 'value' => $faker->numberBetween(72, 98).'%'],
                ['label' => 'Team Members', 'value' => (string) $faker->numberBetween(4, 16)],
            ],
            'reminders' => $this->reminders($faker),
            'recent_tasks' => $this->recentTasks($faker),
        ];
    }

    /**
     * @return array{label: string, value: int, trend: float}
     */
    private function stat(string $label, int $value, float $trend): array
    {
        return [
            'label' => $label,
            'value' => $value,
            'trend' => round($trend, 1),
        ];
    }

    /**
     * A run of non-negative integers with a little day-to-day jitter so the
     * charts look organic rather than a flat line.
     *
     * @return array<int, int>
     */
    private function series(int $base, int $length): array
    {
        $data = [];

        for ($i = 0; $i < $length; $i++) {
            $jitter = (int) round($base * (mt_rand(-35, 35) / 100));
            $data[] = max(0, $base + $jitter);
        }

        return $data;
    }

    /**
     * @return array<int, array{priority: string, due: string, title: string, category: string}>
     */
    private function reminders(\Faker\Generator $faker): array
    {
        $priorities = ['low', 'medium', 'high'];
        $categories = ['Meeting', 'Review', 'Deployment', 'Compliance', 'Planning'];

        $titles = [
            'Finalize the weekly status report.',
            'Review the pending change requests.',
            'Meet with the team to scope the next sprint.',
            'Follow up on overdue assignments.',
            'Prepare the monthly accomplishments summary.',
        ];

        $slots = ['Today, 12:30', 'Today, 16:30', 'Tomorrow, 10:00', 'Tomorrow, 14:00', 'Friday, 09:00'];

        $reminders = [];

        foreach (array_slice($titles, 0, 3) as $index => $title) {
            $reminders[] = [
                'priority' => $faker->randomElement($priorities),
                'due' => $slots[$index],
                'title' => $title,
                'category' => $faker->randomElement($categories),
            ];
        }

        return $reminders;
    }

    /**
     * @return array<int, array{id: int, name: string, assignee: string, status: string, progress: int, due: string}>
     */
    private function recentTasks(\Faker\Generator $faker): array
    {
        // Mirrors the seeded statuses so the sample data lines up with the
        // statuses module.
        $statuses = ['To Do', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

        $names = [
            'Encode quarterly report',
            'Repair request consolidation',
            'Asset inventory check',
            'Draft procurement schedule',
            'Update the citizen feedback tracker',
            'Reconcile travel order records',
        ];

        $tasks = [];

        foreach (array_slice($names, 0, 6) as $index => $name) {
            $status = $faker->randomElement($statuses);

            $tasks[] = [
                'id' => $index + 1,
                'name' => $name,
                'assignee' => $faker->name(),
                'status' => $status,
                'progress' => $status === 'Completed' ? 100 : $faker->numberBetween(5, 95),
                'due' => Carbon::now()->addDays($faker->numberBetween(-5, 20))->format('d/m/Y'),
            ];
        }

        return $tasks;
    }
}
