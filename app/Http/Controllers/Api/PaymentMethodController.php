<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\JsonResponse;

class PaymentMethodController extends Controller
{
    public function index(): JsonResponse
    {
        $methods = PaymentMethod::active()->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data'    => $methods->map(fn($m) => [
                'id'          => $m->id,
                'name'        => $m->name,
                'description' => $m->description,
            ]),
        ]);
    }
}
