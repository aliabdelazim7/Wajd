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
            'company_name' => ['nullable', 'string', 'max:160'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'phone' => ['required', 'string', 'min:7', 'max:40'],
            'page_url' => ['nullable', 'url', 'max:2048'],
            'service' => ['required', 'string', 'max:160'],
            'industry' => ['required', 'string', 'max:120'],
            'contact_preference' => ['required', 'string', 'in:phone,whatsapp,email'],
            'budget_sar' => ['required', 'integer', 'min:0', 'max:100000000'],
            'package_selection' => ['nullable', 'array'],
            'package_selection.basePlan' => ['nullable', 'array'],
            'package_selection.basePlan.id' => ['nullable', 'string', 'max:80'],
            'package_selection.basePlan.name' => ['nullable', 'string', 'max:160'],
            'package_selection.basePlan.price' => ['nullable', 'integer', 'min:0', 'max:100000000'],
            'package_selection.addons' => ['nullable', 'array', 'max:10'],
            'package_selection.addons.*' => ['array'],
            'package_selection.addons.*.id' => ['required', 'string', 'max:80'],
            'package_selection.addons.*.name' => ['required', 'string', 'max:160'],
            'package_selection.addons.*.price' => ['required', 'integer', 'min:0', 'max:100000000'],
            'package_selection.addons.*.type' => ['required', 'string', 'in:monthly,one_time'],
            'package_selection.monthlyTotal' => ['nullable', 'integer', 'min:0', 'max:100000000'],
            'package_selection.oneTimeTotal' => ['nullable', 'integer', 'min:0', 'max:100000000'],
            'message' => ['nullable', 'string', 'max:5000'],
            'locale' => ['nullable', 'string', 'in:ar,en'],
            'source' => ['nullable', 'string', 'max:80'],
            'consent' => ['nullable', 'boolean'],
            'website' => ['nullable', 'string', 'max:0'],
        ];
    }
}
