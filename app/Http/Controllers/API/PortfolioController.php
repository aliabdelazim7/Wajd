<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PortfolioController extends Controller
{
    // GET /api/portfolio
    public function index()
    {
        try {
            $items = Portfolio::orderBy('id', 'desc')->get();
            return response()->json($items);
        } catch (\Exception $e) {
            Log::error('Failed to fetch portfolio items: ' . $e->getMessage());
            return response()->json(['error' => 'خطأ في جلب البيانات'], 500);
        }
    }

    // POST /api/portfolio
    public function store(Request $request)
    {
        // Support both old Express schema structure and standard schema structure
        $validated = $request->validate([
            'name' => 'nullable|string',
            'client' => 'nullable|string',
            'category' => 'nullable|string',
            'tag' => 'nullable|string',
            'challenge' => 'nullable|string',
            'strategy' => 'nullable|string',
            'results_json' => 'nullable|array',
            'metrics' => 'nullable|array',
            'image_url' => 'nullable|string',
            'screenshot_url' => 'nullable|string',
            'thumbnail_url' => 'nullable|string',
            'alt_text' => 'nullable|string',
        ]);

        try {
            // Map values dynamically
            $name = $request->input('name') ?? $request->input('client') ?? 'مشروع جديد';
            $category = $request->input('category') ?? $request->input('tag') ?? 'تسويق';
            $imageUrl = $request->input('image_url') ?? $request->input('screenshot_url') ?? '';
            
            // Format results_json
            $resultsJson = [];
            if ($request->has('results_json')) {
                $resultsJson = $request->input('results_json');
            } elseif ($request->has('metrics')) {
                // Map metrics array [{label: "X", value: 2.6, suffix: "x"}] to key-value object
                foreach ($request->input('metrics') as $m) {
                    if (!empty($m['label'])) {
                        $val = ($m['prefix'] ?? '') . ($m['value'] ?? '') . ($m['suffix'] ?? '');
                        $resultsJson[$m['label']] = $val;
                    }
                }
            }

            $portfolio = Portfolio::create([
                'name' => $name,
                'slug' => Str::slug($name) . '-' . time(),
                'category' => $category,
                'challenge' => $request->input('challenge') ?? 'تحديات في إعلانات الأداء وإدارة الميزانية الإعلانية بشكل فعال.',
                'strategy' => $request->input('strategy') ?? 'إعادة هيكلة العروض والحملات وبناء مسار شراء مخصص.',
                'results_json' => $resultsJson,
                'image_url' => $imageUrl,
                'thumbnail_url' => $imageUrl,
                'alt_text' => $name,
            ]);

            return response()->json($portfolio, 201);

        } catch (\Exception $e) {
            Log::error('Failed to save portfolio item: ' . $e->getMessage());
            return response()->json(['error' => 'خطأ في الحفظ والتخزين'], 500);
        }
    }

    // DELETE /api/portfolio/{id}
    public function destroy($id)
    {
        try {
            $portfolio = Portfolio::findOrFail($id);
            $portfolio->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Failed to delete portfolio item: ' . $e->getMessage());
            return response()->json(['error' => 'خطأ في الحذف'], 500);
        }
    }
}
