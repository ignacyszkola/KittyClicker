package com.kittyclicker.service;

import com.kittyclicker.dto.ClickResponse;
import com.kittyclicker.entity.*;
import com.kittyclicker.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ClickService {

    private final UserRepository userRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final AchievementRepository achievementRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final UserCatSkinRepository userCatSkinRepository;

    private final Map<Long, Deque<Long>> userClicks =
            new ConcurrentHashMap<>();

    private static final int MAX_CPS = 15;
    private static final long ONE_SECOND_NANOS = 1_000_000_000L;

    public ClickService(
            UserRepository userRepository,
            UserAchievementRepository userAchievementRepository,
            AchievementRepository achievementRepository,
            InventoryItemRepository inventoryItemRepository,
            UserCatSkinRepository userCatSkinRepository) {

        this.userRepository = userRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.achievementRepository = achievementRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.userCatSkinRepository = userCatSkinRepository;
    }

    private record AchievementResult(
            boolean achievementUnlocked,
            String itemReceivedName
    ) {}

    private AchievementResult checkAchievements(User user) {

        boolean achievementUnlocked = false;
        String itemReceivedName = null;

        List<Achievement> achievements = achievementRepository.findAll();

        for (Achievement achievement : achievements) {

            if (user.getClicks() < achievement.getRequiredClicks()) {
                continue;
            }

            if (userAchievementRepository.existsByUserIdAndAchievementId(user.getId(), achievement.getId())) {
                continue;
            }

            userAchievementRepository.save(
                    new UserAchievement(user, achievement)
            );

            achievementUnlocked = true;

            Item rewardItem = achievement.getRewardItem();

            if (rewardItem != null) {
                InventoryItem inventoryItem = inventoryItemRepository.findByUserIdAndItemId
                        (user.getId(), rewardItem.getId()).orElse(null);

                if (inventoryItem == null) {
                    inventoryItemRepository.save(new InventoryItem(user, rewardItem, 1));
                } else {
                    inventoryItem.setQuantity(inventoryItem.getQuantity() + 1);
                }

                itemReceivedName = rewardItem.getName();
            }

            CatSkin rewardSkin = achievement.getRewardSkin();

            if (rewardSkin != null && !userCatSkinRepository.existsByUserIdAndCatSkinId(user.getId(), rewardSkin.getId())) {
                userCatSkinRepository.save(new UserCatSkin(user, rewardSkin));
            }
        }

        return new AchievementResult(achievementUnlocked, itemReceivedName);
    }

    private void generatePassiveClicks(User user, Instant now) {
        PassiveCat cat = user.getPassiveCat();

        if (cat == null) {
            return;
        }

        Instant last = cat.getLastGenerationAt();

        if (last == null) {
            cat.setLastGenerationAt(now);
            return;
        }

        long elapsedNanos = java.time.Duration.between(last, now).toNanos();
        long generatedClicks = (long) (cat.getCps() * elapsedNanos / 1_000_000_000.0);

        if (generatedClicks <= 0) {
            return;
        }

        long drop = 0;
        long chance = 1;

        for (long i = 0; i < generatedClicks; i++) {
            if (cat.getMoneyChanceDrop().isAvailable()) {
                chance += cat.getMoneyChanceDrop().getBoost();
            }

            if ((int) (Math.random() * 101) < chance) {
                if (cat.getMoneyMultiplierDrop().isAvailable()) {
                    drop += cat.getMoneyMultiplierDrop().getBoost();
                }
                user.setMoney(user.getMoney() + drop);
            }

            drop = 0;
            chance = 1;

            if (cat.getCritChanceDrop().isAvailable()) {
                chance += cat.getCritChanceDrop().getBoost();
            }

            if ((int) (Math.random() * 101) < chance) {
                if (cat.getCritMultiplierDrop().isAvailable()) {
                    drop += cat.getCritMultiplierDrop().getBoost();
                }
            }

            if (cat.getPointsPerClick().isAvailable()) {
                drop += cat.getPointsPerClick().getBoost();
            }

            user.setClicks(user.getClicks() + drop);

            drop = 1;
        }

        long processedNanos = (long) (generatedClicks * 1_000_000_000.0 / cat.getCps());
        cat.setLastGenerationAt(last.plusNanos(processedNanos));
    }


    @Transactional
    public ClickResponse click(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Deque<Long> timestamps = userClicks.computeIfAbsent(userId, key -> new ArrayDeque<>());

        synchronized (timestamps) {

            long now = System.nanoTime();

            while (!timestamps.isEmpty() && now - timestamps.peekFirst() >= ONE_SECOND_NANOS) {
                timestamps.removeFirst();
            }

            if (timestamps.size() >= MAX_CPS) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Maximum of " + MAX_CPS + " clicks per second exceeded");
            }

            timestamps.addLast(now);
        }

        long chance = 1;
        long drop = 1;

        boolean moneyDrop = false;
        boolean critDrop = false;

        if (user.getMoneyChanceDrop().isAvailable()) {
            chance += user.getMoneyChanceDrop().getBoost();
        }

        if ((int) (Math.random() * 101) < chance) {
            if (user.getMoneyMultiplierDrop().isAvailable()) {
                drop += user.getMoneyMultiplierDrop().getBoost();
            }

            user.setMoney(user.getMoney() + drop);
            moneyDrop = true;
        }

        chance = 1;
        drop = 1;

        if (user.getCritChanceDrop().isAvailable()) {
            chance += user.getCritChanceDrop().getBoost();
        }

        if ((int) (Math.random() * 101) < chance) {
            if (user.getCritMultiplierDrop().isAvailable()) {
                drop += user.getCritMultiplierDrop().getBoost();
            }

            critDrop = true;
        }

        if (user.getPointsPerClick().isAvailable()) {
            drop += user.getPointsPerClick().getBoost();
        }

        if(user.getActiveItem() != null && user.getActiveItemExpiresAt().isAfter(Instant.now())){
            drop *= user.getActiveItem().getBoostMultiplier();
        }

        user.setClicks(user.getClicks() + drop);

        AchievementResult achievementResult = checkAchievements(user);
        generatePassiveClicks(user, Instant.now());

        return new ClickResponse(
                user.getClicks(),
                user.getMoney(),
                moneyDrop,
                critDrop,
                achievementResult.achievementUnlocked(),
                achievementResult.itemReceivedName()
        );
    }
}
