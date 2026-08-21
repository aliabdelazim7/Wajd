<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('portfolio_projects', function (Blueprint $table) {
            $table->json('results_ar')->nullable()->after('results');
            $table->json('results_en')->nullable()->after('results_ar');
        });

        $localizedResults = [
            'al-owaid' => [
                'ar' => ['عائد شراء 2.62x', '1,137 عملية شراء', '8,274 إضافة إلى السلة', 'إنفاق إعلاني $28,268.79'],
                'en' => ['2.62x purchase ROAS', '1,137 purchases', '8,274 adds to cart', '$28,268.79 ad spend'],
            ],
            'barner' => [
                'ar' => ['متوسط عائد شراء 2.10x', '40 عملية شراء', '146 إضافة إلى السلة', 'قيمة شراء $3,223.72'],
                'en' => ['2.10x average purchase ROAS', '40 purchases', '146 adds to cart', '$3,223.72 purchase conversion value'],
            ],
            'toyo' => [
                'ar' => ['إجمالي مبيعات KWD 2,567.558', '130 طلباً', '251 منتجاً مباعاً', 'متوسط قيمة الطلب KWD 19.320'],
                'en' => ['KWD 2,567.558 total sales', '130 orders', '251 products sold', 'KWD 19.320 average order value'],
            ],
            'qanatir' => [
                'ar' => ['عائد شراء 2.54x', '22 عملية شراء', 'قيمة شراء $1,249.74', '175 بدءاً للدفع'],
                'en' => ['2.54x purchase ROAS', '22 purchases', '$1,249.74 purchase value', '175 checkouts started'],
            ],
            'jassar' => [
                'ar' => ['3,228 طلباً', '137,893 زيارة', '3,177 عميلاً', 'إجمالي مبيعات 626,170.85'],
                'en' => ['3,228 orders', '137,893 sessions', '3,177 customers', '626,170.85 total sales'],
            ],
            'flash' => [
                'ar' => ['عائد شراء 2.34x', '242 عملية شراء', 'قيمة شراء $15,260.71', '524 بدءاً للدفع'],
                'en' => ['2.34x purchase ROAS', '242 purchases', '$15,260.71 purchase value', '524 checkouts started'],
            ],
            'kamalz' => [
                'ar' => ['عائد شراء 1.89x', '39 عملية شراء', 'قيمة شراء $2,823.10', '173 بدءاً للدفع'],
                'en' => ['1.89x purchase ROAS', '39 purchases', '$2,823.10 purchase value', '173 checkouts started'],
            ],
            'manabet' => [
                'ar' => ['إجمالي مبيعات KWD 753.76', '66 طلباً', '2,340 زيارة', '60 عميلاً'],
                'en' => ['KWD 753.76 total sales', '66 orders', '2,340 visits', '60 customers'],
            ],
        ];

        foreach ($localizedResults as $slug => $results) {
            DB::table('portfolio_projects')->where('slug', $slug)->update([
                'results_ar' => json_encode($results['ar'], JSON_UNESCAPED_UNICODE),
                'results_en' => json_encode($results['en'], JSON_UNESCAPED_UNICODE),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('portfolio_projects', function (Blueprint $table) {
            $table->dropColumn(['results_ar', 'results_en']);
        });
    }
};
