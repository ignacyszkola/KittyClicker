package com.kittyclicker.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "image_path", nullable = false)
    private String imagePath;

    @Column(name = "boost_multiplier", nullable = false)
    private long boostMultiplier;

    @Column(name = "duration_seconds", nullable = false)
    private int durationSeconds;

    @OneToMany(mappedBy = "item")
    private List<InventoryItem> inventoryItems = new ArrayList<>();

    @OneToMany(mappedBy = "rewardItem")
    private List<Achievement> rewardAchievements = new ArrayList<>();

    protected Item() {}

    public Item(String code, String name, String imagePath,
                long boostMultiplier, int durationSeconds) {
        this.code = code;
        this.name = name;
        this.imagePath = imagePath;
        this.boostMultiplier = boostMultiplier;
        this.durationSeconds = durationSeconds;
    }

    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
    public String getImagePath() { return imagePath; }
    public long getBoostMultiplier() { return boostMultiplier; }
    public int getDurationSeconds() { return durationSeconds; }
    public List<InventoryItem> getInventoryItems() { return inventoryItems; }
    public List<Achievement> getRewardAchievements() { return rewardAchievements; }
}