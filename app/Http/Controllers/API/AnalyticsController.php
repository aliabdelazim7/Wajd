<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\VisitorEvent;
use App\Models\VisitorSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AnalyticsController extends Controller
{
    private const EVENT_TYPES = [
        'page_view',
        'scroll_depth',
        'cta_clicked',
        'builder_started',
        'builder_base_selected',
        'builder_addon_toggled',
        'builder_continue_clicked',
        'contact_form_viewed',
        'contact_form_started',
        'lead_submit_clicked',
        'lead_submit_attempted',
        'lead_submitted',
        'engagement_heartbeat',
        'session_pause',
        'session_resume',
        'session_end',
        'demo_tab_switched',
        'demo_walkthrough_clicked',
        'demo_live_preview_clicked',
        'demo_request_clicked',
        'roi_calculator_used',
        'roi_plan_requested',
        'video_testimonial_played',
        'testimonial_cta_clicked',
        'case_study_opened_from_proof',
        'portal_preview_tab_clicked',
        'portal_message_clicked',
        'portal_request_clicked',
        'insight_opened',
        'insight_clicked',
        'insights_cta_clicked',
    ];

    private const SCORE_WEIGHTS = [
        'page_view' => 1,
        'scroll_depth' => 2,
        'cta_clicked' => 6,
        'builder_started' => 3,
        'builder_base_selected' => 5,
        'builder_addon_toggled' => 8,
        'builder_continue_clicked' => 20,
        'contact_form_viewed' => 10,
        'contact_form_started' => 12,
        'lead_submit_clicked' => 18,
        'lead_submit_attempted' => 25,
        'lead_submitted' => 100,
        'engagement_heartbeat' => 2,
        'session_pause' => 0,
        'session_resume' => 1,
        'session_end' => 0,
        'demo_tab_switched' => 4,
        'demo_walkthrough_clicked' => 8,
        'demo_live_preview_clicked' => 12,
        'demo_request_clicked' => 25,
        'roi_calculator_used' => 10,
        'roi_plan_requested' => 24,
        'video_testimonial_played' => 8,
        'testimonial_cta_clicked' => 12,
        'case_study_opened_from_proof' => 6,
        'portal_preview_tab_clicked' => 3,
        'portal_message_clicked' => 8,
        'portal_request_clicked' => 14,
        'insight_opened' => 4,
        'insight_clicked' => 3,
        'insights_cta_clicked' => 10,
    ];

    private const PROPERTY_KEYS = [
        'path', 'locale', 'title', 'device_type', 'viewport_width', 'referrer',
        'depth', 'label', 'location', 'target', 'duration_seconds', 'scroll_depth',
        'plan_id', 'plan_name', 'price', 'addon_id', 'addon_name', 'action',
        'base_plan_id', 'billing_type', 'addon_ids', 'monthly_total', 'one_time_total',
        'service', 'industry', 'budget_sar', 'contact_preference', 'has_builder_selection',
        'source', 'demo_id', 'average_order_value', 'margin_percent', 'scenario', 'target_roas', 'projected_revenue', 'has_roi_snapshot', 'video_id', 'project_id', 'article_id',
    ];

    public function collect(Request $request): JsonResponse
    {
        $data = $request->validate([
            'events' => ['required', 'array', 'min:1', 'max:40'],
            'events.*.session_token' => ['required', 'string', 'max:100', 'regex:/^[A-Za-z0-9_-]+$/'],
            'events.*.visitor_id' => ['required', 'string', 'max:100', 'regex:/^[A-Za-z0-9_-]+$/'],
            'events.*.event_type' => ['required', 'string', Rule::in(self::EVENT_TYPES)],
            'events.*.page_path' => ['required', 'string', 'max:240', 'starts_with:/'],
            'events.*.locale' => ['nullable', 'string', Rule::in(['ar', 'en'])],
            'events.*.properties' => ['nullable', 'array', 'max:30'],
            'events.*.metadata' => ['nullable', 'array', 'max:10'],
        ]);

        $accepted = 0;

        DB::transaction(function () use ($data, $request, &$accepted) {
            foreach ($data['events'] as $event) {
                $session = VisitorSession::query()->where('session_token', $event['session_token'])->first();
                $isNew = !$session;

                if ($isNew) {
                    $session = new VisitorSession([
                        'session_token' => $event['session_token'],
                        'visitor_id' => $event['visitor_id'],
                        'locale' => $event['locale'] ?? 'ar',
                        'duration_seconds' => 0,
                        'page_count' => $event['event_type'] === 'page_view' ? 1 : 0,
                        'intent_score' => 0,
                        'metadata' => $this->sanitizeMetadata($event['metadata'] ?? []),
                        'started_at' => now(),
                        'last_active_at' => now(),
                    ]);
                } else {
                    $session->locale = $event['locale'] ?? $session->locale;
                    $session->last_active_at = now();
                    if ($event['event_type'] === 'page_view') {
                        $session->page_count = (int) $session->page_count + 1;
                    }
                    if (!empty($event['metadata'])) {
                        $session->metadata = array_merge($session->metadata ?? [], $this->sanitizeMetadata($event['metadata']));
                    }
                }

                $session->duration_seconds = min(
                    7200,
                    max((int) $session->duration_seconds, max(0, now()->diffInSeconds($session->started_at ?? now())))
                );
                $session->intent_score = min(
                    100,
                    max(0, (int) $session->intent_score + $this->scoreFor($event['event_type'], $event['properties'] ?? []))
                );
                $session->save();

                VisitorEvent::create([
                    'visitor_session_id' => $session->id,
                    'event_type' => $event['event_type'],
                    'page_path' => $event['page_path'],
                    'properties' => $this->sanitizeProperties($event['properties'] ?? []),
                    'created_at' => now(),
                ]);
                $accepted++;
            }
        });

        return response()->json(['data' => ['accepted' => $accepted]]);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'days' => ['nullable', 'integer', 'min:1', 'max:90'],
        ]);
        $days = (int) ($filters['days'] ?? 30);
        $since = now()->subDays($days);

        $sessionsQuery = VisitorSession::query()->where('started_at', '>=', $since);
        $sessions = (clone $sessionsQuery)->count();
        $uniqueVisitors = (clone $sessionsQuery)->distinct('visitor_id')->count('visitor_id');
        $averageDuration = (int) round((float) ((clone $sessionsQuery)->avg('duration_seconds') ?? 0));
        $engagedSessions = (clone $sessionsQuery)->where(function ($query) {
            $query->where('duration_seconds', '>=', 30)->orWhere('intent_score', '>=', 20);
        })->count();
        $highIntentSessions = (clone $sessionsQuery)->where('intent_score', '>=', 50)->count();
        $leads = Lead::query()->where('created_at', '>=', $since)->count();

        $trend = VisitorSession::query()
            ->where('started_at', '>=', $since)
            ->selectRaw('DATE(started_at) as date, COUNT(*) as sessions, COUNT(DISTINCT visitor_id) as visitors, AVG(duration_seconds) as avg_duration, AVG(intent_score) as avg_intent')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'sessions' => (int) $row->sessions,
                'visitors' => (int) $row->visitors,
                'avg_duration' => (int) round((float) $row->avg_duration),
                'avg_intent' => (int) round((float) $row->avg_intent),
            ]);

        $topPages = VisitorEvent::query()
            ->where('event_type', 'page_view')
            ->where('created_at', '>=', $since)
            ->select('page_path')
            ->selectRaw('COUNT(*) as views')
            ->groupBy('page_path')
            ->orderByDesc('views')
            ->limit(8)
            ->get()
            ->map(fn ($row) => ['path' => $row->page_path, 'views' => (int) $row->views]);

        $topEvents = VisitorEvent::query()
            ->where('created_at', '>=', $since)
            ->select('event_type')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('event_type')
            ->orderByDesc('total')
            ->limit(12)
            ->get()
            ->map(fn ($row) => ['event_type' => $row->event_type, 'total' => (int) $row->total]);

        $builderSignals = VisitorEvent::query()
            ->whereIn('event_type', ['builder_base_selected', 'builder_addon_toggled', 'builder_continue_clicked'])
            ->where('created_at', '>=', $since)
            ->select('event_type')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('event_type')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row) => ['event_type' => $row->event_type, 'total' => (int) $row->total]);

        $topAddons = VisitorEvent::query()
            ->where('event_type', 'builder_addon_toggled')
            ->where('created_at', '>=', $since)
            ->whereRaw("properties->>'action' = 'added'")
            ->selectRaw("properties->>'addon_id' as id, properties->>'addon_name' as name, COUNT(*) as selections")
            ->groupByRaw("properties->>'addon_id', properties->>'addon_name'")
            ->orderByDesc('selections')
            ->limit(8)
            ->get()
            ->map(fn ($row) => ['id' => $row->id, 'name' => $row->name, 'selections' => (int) $row->selections]);

        $deviceBreakdown = VisitorEvent::query()
            ->where('created_at', '>=', $since)
            ->whereNotNull('properties->device_type')
            ->selectRaw("properties->>'device_type' as device, COUNT(DISTINCT visitor_session_id) as sessions")
            ->groupByRaw("properties->>'device_type'")
            ->orderByDesc('sessions')
            ->get()
            ->map(fn ($row) => ['device' => $row->device, 'sessions' => (int) $row->sessions]);

        $intentBreakdown = VisitorSession::query()
            ->where('started_at', '>=', $since)
            ->selectRaw("CASE WHEN intent_score >= 50 THEN 'high' WHEN intent_score >= 20 THEN 'medium' ELSE 'low' END as bucket, COUNT(*) as sessions")
            ->groupBy('bucket')
            ->get()
            ->map(fn ($row) => ['bucket' => $row->bucket, 'sessions' => (int) $row->sessions]);

        $liveActivity = VisitorEvent::query()
            ->with('session:id,locale,intent_score')
            ->latest('created_at')
            ->limit(20)
            ->get(['id', 'visitor_session_id', 'event_type', 'page_path', 'properties', 'created_at'])
            ->map(fn ($event) => [
                'id' => $event->id,
                'event_type' => $event->event_type,
                'page_path' => $event->page_path,
                'properties' => $event->properties ?? [],
                'created_at' => $event->created_at,
                'locale' => $event->session?->locale,
                'intent_score' => $event->session?->intent_score ?? 0,
            ]);

        return response()->json([
            'data' => [
                'period_days' => $days,
                'summary' => [
                    'sessions' => $sessions,
                    'unique_visitors' => $uniqueVisitors,
                    'average_duration' => $averageDuration,
                    'engaged_sessions' => $engagedSessions,
                    'high_intent_sessions' => $highIntentSessions,
                    'leads' => $leads,
                    'engagement_rate' => $sessions ? round(($engagedSessions / $sessions) * 100, 1) : 0,
                    'lead_conversion_rate' => $sessions ? round(($leads / $sessions) * 100, 1) : 0,
                ],
                'trend' => $trend,
                'top_pages' => $topPages,
                'top_events' => $topEvents,
                'builder_signals' => $builderSignals,
                'top_addons' => $topAddons,
                'device_breakdown' => $deviceBreakdown,
                'intent_breakdown' => $intentBreakdown,
                'live_activity' => $liveActivity,
            ],
        ]);
    }

    private function scoreFor(string $eventType, array $properties): int
    {
        $score = self::SCORE_WEIGHTS[$eventType] ?? 0;
        if ($eventType === 'scroll_depth') {
            $score = min(8, max(1, (int) (($properties['depth'] ?? 0) / 25)));
        }
        if ($eventType === 'builder_addon_toggled' && ($properties['action'] ?? null) !== 'added') {
            return 0;
        }
        return $score;
    }

    private function sanitizeProperties(array $properties): array
    {
        $safe = [];
        foreach (self::PROPERTY_KEYS as $key) {
            if (array_key_exists($key, $properties)) {
                $safe[$key] = $this->sanitizeValue($properties[$key]);
            }
        }
        return $safe;
    }

    private function sanitizeMetadata(array $metadata): array
    {
        return [
            'landing_page' => isset($metadata['landing_page']) ? $this->sanitizeValue($metadata['landing_page']) : null,
            'campaign' => isset($metadata['campaign']) && is_array($metadata['campaign']) ? $this->sanitizeValue($metadata['campaign']) : [],
        ];
    }

    private function sanitizeValue(mixed $value): mixed
    {
        if (is_array($value)) {
            $result = [];
            foreach (array_slice($value, 0, 30, true) as $key => $item) {
                $result[(string) $key] = $this->sanitizeValue($item);
            }
            return $result;
        }
        if (is_bool($value) || is_int($value) || is_float($value) || is_null($value)) {
            return $value;
        }
        return mb_substr((string) $value, 0, 240);
    }
}
