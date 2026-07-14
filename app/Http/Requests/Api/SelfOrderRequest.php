<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class SelfOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // ─── Identitas Pembeli ─────────────────────────────────────
            // device_fingerprint: hash unik dari browser/device pembeli
            'customer_identifier'  => ['required', 'string', 'max:255'],
            'table_number'         => ['nullable', 'string', 'max:20'],
            'notes'                => ['nullable', 'string', 'max:500'],
            'payment_method_id'    => ['nullable', 'integer', 'exists:payment_methods,id'],

            // ─── Items ────────────────────────────────────────────────
            'items'                => ['required', 'array', 'min:1'],
            'items.*.menu_id'      => ['required', 'integer', 'exists:menus,id'],
            'items.*.quantity'     => ['required', 'integer', 'min:1', 'max:99'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_identifier.required' => 'Identitas perangkat pembeli diperlukan.',
            'items.required'               => 'Minimal satu item harus dipilih.',
            'items.min'                    => 'Minimal satu item harus dipilih.',
            'items.*.menu_id.required'     => 'ID menu wajib diisi.',
            'items.*.menu_id.exists'       => 'Menu tidak ditemukan atau tidak tersedia.',
            'items.*.quantity.required'    => 'Jumlah item wajib diisi.',
            'items.*.quantity.min'         => 'Jumlah minimal 1.',
            'items.*.quantity.max'         => 'Jumlah maksimal 99 per item.',
        ];
    }
}
