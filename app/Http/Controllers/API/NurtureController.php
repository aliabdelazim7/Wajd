<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Services\LeadNurtureService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NurtureController extends Controller
{
    public function run(Request $request, LeadNurtureService $nurture): JsonResponse
    {
        $expected = (string) config('services.nurture.cron_secret');
        $provided = (string) ($request->header('X-Wajd-Cron-Secret') ?: $request->bearerToken());

        if (!$expected || !$provided || !hash_equals($expected, $provided)) {
            abort(401, 'Unauthorized automation request.');
        }

        $processed = 0;
        $sent = 0;
        Lead::query()
            ->whereIn('status', [Lead::STATUS_NEW, Lead::STATUS_CONTACTED])
            ->whereNotNull('nurture_next_at')
            ->where('nurture_next_at', '<=', now())
            ->orderBy('id')
            ->limit(50)
            ->get()
            ->each(function (Lead $lead) use ($nurture, &$processed, &$sent): void {
                $processed++;
                if ($nurture->sendDueFollowUp($lead)) {
                    $sent++;
                }
            });

        return response()->json(['data' => compact('processed', 'sent')]);
    }
}
