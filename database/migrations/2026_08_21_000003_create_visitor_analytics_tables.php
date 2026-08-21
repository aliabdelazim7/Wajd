<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('visitor_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_token')->unique();
            $table->string('visitor_id')->index();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('locale', 10)->default('ar');
            $table->integer('duration_seconds')->default(0);
            $table->integer('page_count')->default(1);
            $table->integer('intent_score')->default(0);
            $table->jsonb('metadata')->nullable();
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('last_active_at')->useCurrent();
            $table->timestamps();
        });

        Schema::create('visitor_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visitor_session_id')->constrained('visitor_sessions')->onDelete('cascade');
            $table->string('event_type')->index(); // page_view, builder_interact, cta_click, form_start
            $table->string('page_path');
            $table->jsonb('properties')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitor_events');
        Schema::dropIfExists('visitor_sessions');
    }
};
