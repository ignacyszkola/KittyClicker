package com.kittyclicker.dto;

import com.kittyclicker.entity.UpgradeType;

import java.util.Map;

public record GameStatusResponse(
        Map<String, Long> points,
        Map<String, Long> money,
        Map<String, Map<UpgradeType, Boolean>> ownedCats,
        Map<String, Map<UpgradeType, Integer>> ownedUpgrades,
        Map<String, Map<String, Integer>> ownedItems,
        Map<String, Map<String, Boolean>> claimedAchievements,
        Map<String, String> selectedCat
) {}
