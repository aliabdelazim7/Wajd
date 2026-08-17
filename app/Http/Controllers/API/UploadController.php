<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UploadController extends Controller
{
    // POST /api/upload/image
    public function uploadImage(Request $request)
    {
        if (!$request->hasFile('image')) {
            return response()->json(['error' => 'لم يتم رفع أي صورة'], 400);
        }

        $request->validate([
            'image' => 'required|image|mimes:jpeg,jpg,png,webp,gif|max:5120',
        ]);

        try {
            $file = $request->file('image');
            $filename = 'portfolio_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            // Move file to public/uploads directory
            $file->move(public_path('uploads'), $filename);
            
            $url = '/uploads/' . $filename;
            
            return response()->json([
                'url' => $url
            ]);
        } catch (\Exception $e) {
            Log::error('Image upload failed: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ أثناء رفع الصورة'], 500);
        }
    }
}
