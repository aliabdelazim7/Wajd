<?php

namespace App\Services;

class GrowthEngineCatalog
{
    private const BASE_PLANS = [
        'starter' => ['name' => 'Starter Plan', 'price' => 350],
        'growth' => ['name' => 'Growth Plan', 'price' => 950],
        'partner' => ['name' => 'Partner Plan', 'price' => 2200],
    ];

    private const ADDONS = [
        'store-launch' => ['name' => 'Professional store launch', 'price' => 1800, 'type' => 'one_time'],
        'market-pos' => ['name' => 'Market POS system', 'price' => 2500, 'type' => 'one_time'],
        'liftdesk-automation' => ['name' => 'LiftDesk AI automation', 'price' => 750, 'type' => 'monthly'],
        'custom-system' => ['name' => 'Custom system for your business', 'price' => 4500, 'type' => 'one_time'],
        'tracking-dashboard' => ['name' => 'Performance dashboard', 'price' => 600, 'type' => 'one_time'],
    ];

    public static function normalize(?array $selection): ?array
    {
        if (!$selection || empty($selection['basePlan']['id']) || !isset(self::BASE_PLANS[$selection['basePlan']['id']])) {
            return null;
        }

        $baseId = $selection['basePlan']['id'];
        $base = self::BASE_PLANS[$baseId];
        $addons = [];
        $monthlyAddons = 0;
        $oneTimeAddons = 0;

        foreach (($selection['addons'] ?? []) as $addon) {
            $addonId = $addon['id'] ?? null;
            if (!$addonId || !isset(self::ADDONS[$addonId])) {
                continue;
            }

            $approved = self::ADDONS[$addonId];
            $addons[] = [
                'id' => $addonId,
                'name' => $approved['name'],
                'price' => $approved['price'],
                'type' => $approved['type'],
            ];

            if ($approved['type'] === 'monthly') {
                $monthlyAddons += $approved['price'];
            } else {
                $oneTimeAddons += $approved['price'];
            }
        }

        return [
            'basePlan' => [
                'id' => $baseId,
                'name' => $base['name'],
                'price' => $base['price'],
                'type' => 'monthly',
            ],
            'addons' => $addons,
            'monthlyTotal' => $base['price'] + $monthlyAddons,
            'oneTimeTotal' => $oneTimeAddons,
        ];
    }
}
