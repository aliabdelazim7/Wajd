<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->string('nurture_stage', 40)->default('new')->after('status')->index();
            $table->timestamp('nurture_last_sent_at')->nullable()->after('nurture_stage');
            $table->timestamp('nurture_next_at')->nullable()->after('nurture_last_sent_at')->index();
            $table->string('portal_status', 30)->default('not_invited')->after('nurture_next_at')->index();
            $table->timestamp('portal_invited_at')->nullable()->after('portal_status');
        });

        Schema::create('lead_nurture_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained('leads')->cascadeOnDelete();
            $table->string('channel', 20);
            $table->string('step', 40);
            $table->string('status', 20);
            $table->string('provider_message_id')->nullable();
            $table->json('payload')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
            $table->index(['lead_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_nurture_events');

        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn([
                'nurture_stage',
                'nurture_last_sent_at',
                'nurture_next_at',
                'portal_status',
                'portal_invited_at',
            ]);
        });
    }
};
