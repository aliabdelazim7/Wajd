<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class MakeWajdAdmin extends Command
{
    protected $signature = 'wajd:make-admin
                            {email : Admin email address}
                            {--name= : Admin display name}
                            {--password= : Password; omit to enter it securely}';

    protected $description = 'Create or promote a Wajd CMS admin account';

    public function handle(): int
    {
        $email = strtolower(trim((string) $this->argument('email')));
        $name = (string) ($this->option('name') ?: 'Wajd Admin');
        $password = (string) ($this->option('password') ?: $this->secret('Password (minimum 12 characters)'));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Please provide a valid email address.');
            return self::FAILURE;
        }

        if (strlen($password) < 12) {
            $this->error('The admin password must be at least 12 characters.');
            return self::FAILURE;
        }

        $user = User::updateOrCreate(
            ['email' => $email],
            ['name' => $name, 'password' => Hash::make($password), 'is_admin' => true]
        );

        $this->info("Admin access enabled for {$user->email}.");
        return self::SUCCESS;
    }
}
