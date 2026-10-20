<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

foreach (User::all() as $u) {
    echo $u->username.' -> '.(Hash::check('password', $u->password) ? 'password OK' : 'password NO').PHP_EOL;
}
