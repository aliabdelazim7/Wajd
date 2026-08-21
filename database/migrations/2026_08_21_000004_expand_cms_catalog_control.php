<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->string('category', 40)->default('marketing')->after('slug');
            $table->unsignedInteger('price_one_time_sar')->nullable()->after('price_sar');
            $table->unsignedInteger('compare_at_price_sar')->nullable()->after('price_one_time_sar');
            $table->string('cta_label_ar')->nullable()->after('billing_cycle');
            $table->string('cta_label_en')->nullable()->after('cta_label_ar');
            $table->json('metadata')->nullable()->after('features_en');
            $table->index(['category', 'is_published', 'sort_order']);
        });

        Schema::create('package_addons', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('category', 40)->default('technology');
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('subtitle_ar')->nullable();
            $table->string('subtitle_en')->nullable();
            $table->unsignedInteger('price_sar');
            $table->string('billing_cycle', 30)->default('one_time');
            $table->string('tag_ar')->nullable();
            $table->string('tag_en')->nullable();
            $table->json('features_ar')->nullable();
            $table->json('features_en')->nullable();
            $table->json('metadata')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
            $table->index(['category', 'is_published', 'sort_order']);
        });

        Schema::table('portfolio_projects', function (Blueprint $table) {
            $table->string('metric_ar')->nullable()->after('strategy_en');
            $table->string('metric_en')->nullable()->after('metric_ar');
            $table->string('outcome_ar')->nullable()->after('metric_en');
            $table->string('outcome_en')->nullable()->after('outcome_ar');
            $table->text('evidence_note_ar')->nullable()->after('outcome_en');
            $table->text('evidence_note_en')->nullable()->after('evidence_note_ar');
            $table->string('period_ar')->nullable()->after('evidence_note_en');
            $table->string('period_en')->nullable()->after('period_ar');
            $table->json('gallery')->nullable()->after('thumbnail_url');
            $table->json('metadata')->nullable()->after('gallery');
        });
    }

    public function down(): void
    {
        Schema::table('portfolio_projects', function (Blueprint $table) {
            $table->dropColumn([
                'metric_ar', 'metric_en', 'outcome_ar', 'outcome_en',
                'evidence_note_ar', 'evidence_note_en', 'period_ar', 'period_en',
                'gallery', 'metadata',
            ]);
        });

        Schema::dropIfExists('package_addons');

        Schema::table('packages', function (Blueprint $table) {
            $table->dropIndex(['category', 'is_published', 'sort_order']);
            $table->dropColumn([
                'category', 'price_one_time_sar', 'compare_at_price_sar',
                'cta_label_ar', 'cta_label_en', 'metadata',
            ]);
        });
    }
};
