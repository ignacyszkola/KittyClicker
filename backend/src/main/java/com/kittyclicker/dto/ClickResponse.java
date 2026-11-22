
package com.kittyclicker.dto;

public record ClickResponse(
        long clicks,
        long moneyEarned,
        long totalMoney
) {
}
