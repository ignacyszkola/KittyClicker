package com.kittyclicker.dto;

public record AchievementRewardResult(
        boolean achievementUnlocked,
        String itemReceivedName,
        String skinReceivedCode
) {}