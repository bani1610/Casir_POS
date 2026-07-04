<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — Casir POS
|--------------------------------------------------------------------------
|
| Semua request web diarahkan ke SPA (app.blade.php).
| React Router yang menangani routing di sisi client.
|
*/

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
