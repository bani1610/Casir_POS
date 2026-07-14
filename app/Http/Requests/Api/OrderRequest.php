<?php

namespace App\Http\Requests\Api;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // ─── Order Header ──────────────────────────────────────────
            'payment_method_id' => ['nullable', 'integer', 'exists:payment_methods,id'],
            'table_number'      => ['nullable', 'string', 'max:20'],
            'notes'             => ['nullable', 'string', 'max:500'],
            'status'            => ['sometimes', 'string', 'in:' . implode(',', Order::STATUSES)],

            // ─── Items ────────────────────────────────────────────────
            'items'             => ['required', 'array', 'min:1'],
            'items.*.menu_id'   => ['required', 'integer', 'exists:menus,id'],
            'items.*.quantity'  => ['required', 'integer', 'min:1', 'max:99'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required'            => 'Minimal satu item harus dipilih.',
            'items.min'                 => 'Minimal satu item harus dipilih.',
            'items.*.menu_id.required'  => 'ID menu wajib diisi.',
            'items.*.menu_id.exists'    => 'Menu tidak ditemukan.',
            'items.*.quantity.required' => 'Jumlah item wajib diisi.',
            'items.*.quantity.min'      => 'Jumlah minimal 1.',
            'items.*.quantity.max'      => 'Jumlah maksimal 99 per item.',
            'payment_method_id.exists'  => 'Metode pembayaran tidak ditemukan.',
            'status.in'                 => 'Status tidak valid.',
        ];
    }
}
