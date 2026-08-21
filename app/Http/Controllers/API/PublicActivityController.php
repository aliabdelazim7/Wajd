<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

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
        try {
            $items = DB::table('visitor_events')
                ->select(['id', 'event_type', 'created_at'])
                ->whereIn('event_type', self::SAFE_EVENTS)
                ->where('created_at', '>=', now()->subHours(6))
                ->orderByDesc('created_at')
                ->limit(8)
                ->get()
                ->map(static fn (object $event): array => [
                    'id' => (int) $event->id,
                    'event_type' => (string) $event->event_type,
                    'created_at' => $event->created_at ? date(DATE_ATOM, strtotime((string) $event->created_at)) : null,
                ])
                ->values();
        } catch (Throwable $exception) {
            report($exception);
            $items = collect();
        }

        return response()->json(['data' => $items])
            ->header('Cache-Control', 'public, max-age=30, s-maxage=60, stale-while-revalidate=300');
    }
}
