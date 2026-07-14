<?php

namespace App\Http\Requests\Api;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                'in:' . implode(',', Order::STATUSES),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status wajib diisi.',
            'status.in'       => 'Status tidak valid. Pilihan: pending, processing, done, cancelled.',
        ];
    }
}
