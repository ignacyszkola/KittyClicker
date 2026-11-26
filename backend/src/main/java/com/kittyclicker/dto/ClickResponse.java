
package com.kittyclicker.dto;

public record ClickResponse(
        long clicks,
        long totalMoney,
        boolean didMoneyDrop,
        boolean didCritDrop,
        boolean isAchievementUnlocked,
        String itemReceivedName
) {
}
