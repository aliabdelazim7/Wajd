<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\VisitorEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicActivityController extends Controller
{
    private const SAFE_EVENTS = [
        'lead_submitted',
        'demo_request_clicked',
        'roi_plan_requested',
        'portal_request_clicked',
    ];

    public function recent(Request $request): JsonResponse
    {
        $items = VisitorEvent::query()
            ->whereIn('event_type', self::SAFE_EVENTS)
            ->where('created_at', '>=', now()->subHours(6))
            ->latest('created_at')
            ->limit(8)
            ->get(['id', 'event_type', 'created_at'])
            ->map(fn (VisitorEvent $event) => [
                'id' => $event->id,
                'event_type' => $event->event_type,
                'created_at' => $event->created_at?->toIso8601String(),
            ])
            ->values();

        return response()->json(['data' => $items])
            ->header('Cache-Control', 'public, max-age=30, s-maxage=60, stale-while-revalidate=300');
    }
}
