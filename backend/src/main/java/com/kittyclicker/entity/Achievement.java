package com.kittyclicker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private long requiredClicks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reward_item_id")
    private Item rewardItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reward_skin_id")
    private CatSkin rewardSkin;

    public Achievement() {}

    public Achievement(String code, String name, long requiredClicks,
                       Item rewardItem, CatSkin rewardSkin) {
        this.code = code;
        this.name = name;
        this.requiredClicks = requiredClicks;
        this.rewardItem = rewardItem;
        this.rewardSkin = rewardSkin;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public long getRequiredClicks() {
        return requiredClicks;
    }

    public Item getRewardItem() {
        return rewardItem;
    }

    public CatSkin getRewardSkin() {
        return rewardSkin;
    }
}