<?php

use App\Http\Controllers\API\LeadController;
use App\Http\Controllers\API\OpenAIController;
use App\Http\Controllers\API\PortfolioController;
use App\Http\Controllers\API\UploadController;
use Illuminate\Support\Facades\Route;

// Leads endpoints
Route::post('/leads/submit', [LeadController::class, 'submit']);
Route::get('/leads', [LeadController::class, 'index']);
Route::patch('/leads/{id}/status', [LeadController::class, 'updateStatus']);

// Portfolio endpoints
Route::get('/portfolio', [PortfolioController::class, 'index']);
Route::post('/portfolio', [PortfolioController::class, 'store']);
Route::delete('/portfolio/{id}', [PortfolioController::class, 'destroy']);

// AI generation and brand scraper endpoints
Route::post('/generate/content', [OpenAIController::class, 'generateContent']);
Route::post('/brand/analyze', [OpenAIController::class, 'analyzeBrand']);

// Uploads endpoint
Route::post('/upload/image', [UploadController::class, 'uploadImage']);
