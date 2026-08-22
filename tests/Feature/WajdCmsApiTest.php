<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\WajdCmsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class WajdCmsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_routes_require_authentication(): void
    {
        $this->getJson('/api/admin/overview')->assertUnauthorized();
    }

    public function test_admin_can_login_and_read_overview(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('AdminPassword123!'),
            'is_admin' => true,
        ]);

        $login = $this->postJson('/api/admin/login', [
            'email' => $admin->email,
            'password' => 'AdminPassword123!',
        ])->assertOk()->assertJsonPath('data.user.is_admin', true);

        $token = $login->json('data.token');
        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/admin/overview')
            ->assertOk()
            ->assertJsonStructure(['data' => ['counts', 'recent_leads', 'recent_activity']]);
    }

    public function test_public_content_and_lead_intake_are_available(): void
    {
        $this->seed(WajdCmsSeeder::class);

        $this->getJson('/api/content?locale=ar')
            ->assertOk()
            ->assertJsonPath('data.locale', 'ar')
            ->assertJsonStructure(['data' => ['settings', 'blocks', 'packages', 'addons', 'faqs', 'projects']]);

        $this->postJson('/api/leads/submit', [
            'name' => 'Test Lead',
            'email' => 'lead@example.com',
            'phone' => '+966500000000',
            'page_url' => 'https://example.com/store',
            'service' => 'performance-marketing',
            'industry' => 'ecommerce',
            'contact_preference' => 'whatsapp',
            'budget_sar' => 2000,
            'message' => 'Test submission',
            'consent' => true,
        ])->assertCreated()->assertJsonPath('data.id', 1);

        $this->assertDatabaseHas('leads', [
            'email' => 'lead@example.com',
            'page_url' => 'https://example.com/store',
        ]);
    }

    public function test_admin_can_manage_package_addon_and_project_proof(): void
    {
        $admin = User::factory()->create([
            'email' => 'catalog-admin@example.com',
            'password' => Hash::make('AdminPassword123!'),
            'is_admin' => true,
        ]);

        $login = $this->postJson('/api/admin/login', [
            'email' => $admin->email,
            'password' => 'AdminPassword123!',
        ])->assertOk();
        $token = $login->json('data.token');
        $api = $this->withHeader('Authorization', "Bearer {$token}");

        $package = $api->postJson('/api/admin/packages', [
            'slug' => 'test-hybrid',
            'category' => 'hybrid',
            'name_ar' => 'باقة هجينة',
            'name_en' => 'Hybrid Plan',
            'price_sar' => 1200,
            'price_one_time_sar' => 2500,
            'compare_at_price_sar' => 1500,
            'billing_cycle' => 'monthly',
            'cta_label_ar' => 'ابدأ الآن',
            'cta_label_en' => 'Start now',
            'features_ar' => ['ميزة عربية'],
            'features_en' => ['English feature'],
            'metadata' => ['audience' => 'startup'],
            'sort_order' => 9,
            'is_published' => true,
        ])->assertCreated()->assertJsonPath('data.category', 'hybrid');
        $packageId = $package->json('data.id');

        $addon = $api->postJson('/api/admin/addons', [
            'slug' => 'test-automation',
            'category' => 'technology',
            'name_ar' => 'أتمتة تجريبية',
            'name_en' => 'Test automation',
            'subtitle_ar' => 'وحدة اختبار',
            'subtitle_en' => 'Test module',
            'price_sar' => 700,
            'billing_cycle' => 'monthly',
            'tag_ar' => 'أتمتة',
            'tag_en' => 'Automation',
            'features_ar' => ['تنبيه عربي'],
            'features_en' => ['English alert'],
            'metadata' => ['source' => 'test'],
            'sort_order' => 9,
            'is_published' => true,
        ])->assertCreated()->assertJsonPath('data.slug', 'test-automation');
        $addonId = $addon->json('data.id');

        $project = $api->postJson('/api/admin/projects', [
            'slug' => 'test-proof',
            'name_ar' => 'مشروع إثبات',
            'name_en' => 'Proof project',
            'metric_ar' => '2x عائد',
            'metric_en' => '2x return',
            'outcome_ar' => 'نمو',
            'outcome_en' => 'Growth',
            'results' => ['ROAS' => '2x'],
            'gallery' => ['https://example.com/proof-1.webp', 'https://example.com/proof-2.webp'],
            'metadata' => ['source' => 'test'],
            'is_published' => true,
        ])->assertCreated()->assertJsonPath('data.slug', 'test-proof');

        $this->getJson('/api/content?locale=en')
            ->assertOk()
            ->assertJsonPath('data.packages.0.category', 'hybrid')
            ->assertJsonPath('data.addons.0.slug', 'test-automation')
            ->assertJsonPath('data.projects.0.metric', '2x return');

        $api->deleteJson("/api/admin/packages/{$packageId}")->assertOk();
        $api->deleteJson("/api/admin/addons/{$addonId}")->assertOk();
    }

    public function test_invalid_lead_payload_is_rejected(): void
    {
        $this->postJson('/api/leads/submit', ['email' => 'not-an-email'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email']);
    }
}
