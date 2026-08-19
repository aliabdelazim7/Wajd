<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'page_url' => $this->input('page_url', $this->input('pageUrl')),
            'locale' => $this->input('locale', app()->getLocale()),
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'page_url' => ['nullable', 'url', 'max:2048'],
            'service' => ['nullable', 'string', 'max:160'],
            'budget_sar' => ['nullable', 'integer', 'min:0', 'max:100000000'],
            'message' => ['nullable', 'string', 'max:5000'],
            'locale' => ['nullable', 'string', 'in:ar,en'],
            'source' => ['nullable', 'string', 'max:80'],
            'consent' => ['nullable', 'boolean'],
            'website' => ['nullable', 'string', 'max:0'],
        ];
    }
}
