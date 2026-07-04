<?php

namespace App\DTO;

class PaginationDTO
{
    public function __construct(
        public readonly int $page = 1,
        public readonly int $perPage = 15,
        public readonly ?string $search = null,
        public readonly ?string $sortBy = 'created_at',
        public readonly string $sortDirection = 'desc',
    ) {}

    public static function fromRequest(\Illuminate\Http\Request $request): self
    {
        return new self(
            page: (int) $request->query('page', 1),
            perPage: (int) $request->query('per_page', 15),
            search: $request->query('search'),
            sortBy: $request->query('sort_by', 'created_at'),
            sortDirection: $request->query('sort_direction', 'desc'),
        );
    }
}