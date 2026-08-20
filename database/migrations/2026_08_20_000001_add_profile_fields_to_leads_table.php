<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->string('company_name')->nullable()->after('name');
            $table->string('industry')->nullable()->after('service');
            $table->string('contact_preference', 32)->nullable()->after('industry');
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn(['company_name', 'industry', 'contact_preference']);
        });
    }
};
