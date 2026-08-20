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
            ->assertJsonStructure(['data' => ['settings', 'blocks', 'packages', 'faqs', 'projects']]);

        $this->postJson('/api/leads/submit', [
            'name' => 'Test Lead',
            'email' => 'lead@example.com',
            'phone' => '+966500000000',
            'service' => 'performance-marketing',
            'industry' => 'ecommerce',
            'contact_preference' => 'whatsapp',
            'budget_sar' => 2000,
            'message' => 'Test submission',
            'consent' => true,
        ])->assertCreated()->assertJsonPath('data.id', 1);
    }

    public function test_invalid_lead_payload_is_rejected(): void
    {
        $this->postJson('/api/leads/submit', ['email' => 'not-an-email'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email']);
    }
}
