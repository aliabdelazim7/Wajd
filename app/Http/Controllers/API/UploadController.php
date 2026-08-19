<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MediaAsset;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function __construct(private readonly AuditService $audit)
    {
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $data = $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp,gif,svg', 'max:10240'],
            'alt_text' => ['nullable', 'string', 'max:255'],
        ]);

        try {
            $file = $data['image'];
            $diskName = config('filesystems.default', 'public');
            $path = $file->store('wajd/media/' . now()->format('Y/m'), $diskName);
            $disk = Storage::disk($diskName);
            $url = method_exists($disk, 'url') ? $disk->url($path) : asset('storage/' . $path);

            $asset = MediaAsset::create([
                'disk' => $diskName,
                'path' => $path,
                'url' => $url,
                'filename' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'alt_text' => $data['alt_text'] ?? null,
                'created_by' => $request->user()->id,
            ]);

            $this->audit->record($request, 'upload', 'media_asset', $asset->id, ['filename' => $asset->filename]);

            return response()->json(['data' => $asset, 'message' => 'تم رفع الصورة.'], 201);
        } catch (\Throwable $exception) {
            Log::error('Image upload failed', ['exception' => $exception::class, 'message' => $exception->getMessage()]);

            return response()->json(['message' => 'تعذر رفع الصورة حالياً.'], 500);
        }
    }

    public function index(): JsonResponse
    {
        return response()->json(['data' => MediaAsset::query()->latest()->paginate(30)]);
    }

    public function destroy(Request $request, MediaAsset $asset): JsonResponse
    {
        Storage::disk($asset->disk)->delete($asset->path);
        $asset->delete();
        $this->audit->record($request, 'delete', 'media_asset', $asset->id);

        return response()->json(['message' => 'تم حذف الصورة.']);
    }
}
