
package com.kittyclicker.service;

import com.kittyclicker.dto.GameStatusResponse;
import com.kittyclicker.entity.*;
import com.kittyclicker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class MichalekService {

    private final UserRepository userRepository;

    public MichalekService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private Map<UpgradeType, Boolean> getOwnedCats(User user) {
        Map<UpgradeType, Boolean> map = new HashMap<>();

        map.put(UpgradeType.POINTS_PER_CLICK, user.getPointsPerClick().isAvailable());
        map.put(UpgradeType.MONEY_CHANCE, user.getMoneyChanceDrop().isAvailable());
        map.put(UpgradeType.CRIT_CHANCE, user.getCritChanceDrop().isAvailable());
        map.put(UpgradeType.MONEY_MULTIPLIER, user.getMoneyMultiplierDrop().isAvailable());
        map.put(UpgradeType.CRIT_MULTIPLIER, user.getCritMultiplierDrop().isAvailable());
        map.put(UpgradeType.PASSIVE_CAT, user.getPassiveCat() != null);

        return map;
    }

    private Map<UpgradeType, Integer> getOwnedUpgrades(User user) {
        Map<UpgradeType, Integer> map = new HashMap<>();

        map.put(UpgradeType.POINTS_PER_CLICK, user.getPointsPerClick().getLevel());
        map.put(UpgradeType.MONEY_CHANCE, user.getMoneyChanceDrop().getLevel());
        map.put(UpgradeType.CRIT_CHANCE, user.getCritChanceDrop().getLevel());
        map.put(UpgradeType.MONEY_MULTIPLIER, user.getMoneyMultiplierDrop().getLevel());
        map.put(UpgradeType.CRIT_MULTIPLIER, user.getCritMultiplierDrop().getLevel());

        if (user.getPassiveCat() != null) {
            map.put(UpgradeType.PASSIVE_CAT, user.getPassiveCat().getLevel());
        }

        return map;
    }

    private Map<String, Integer> getOwnedItems(User user) {
        Map<String, Integer> map = new HashMap<>();

        for (InventoryItem item : user.getInventoryItems()) {
            map.put(item.getItem().getName(), item.getQuantity());
        }

        return map;
    }

    private Map<String, Boolean> getClaimedAchievements(User user) {
        Map<String, Boolean> map = new HashMap<>();

        for (UserAchievement achievement : user.getAchievements()) {
            map.put(achievement.getAchievement().getName(), true);
        }

        return map;
    }

    public GameStatusResponse getGame(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));

        String selectedCat = user.getSelectedSkin() == null ? null : user.getSelectedSkin().getImagePath();

        return new GameStatusResponse(
                Map.of("points", user.getClicks()),
                Map.of("money", user.getMoney()),
                Map.of("ownedCats", getOwnedCats(user)),
                Map.of("ownedUpgrades", getOwnedUpgrades(user)),
                Map.of("ownedItems", getOwnedItems(user)),
                Map.of("claimedAchievements", getClaimedAchievements(user)),
                Map.of("selectedCat", selectedCat)
        );
    }
}
