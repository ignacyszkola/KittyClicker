package com.kittyclicker.entity;

import com.kittyclicker.converter.InstantStringConverter;
import jakarta.persistence.*;
import java.time.Instant;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    private long money = 0;
    private long clicks = 0;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "level", column = @Column(name = "points_per_click_level")),
            @AttributeOverride(name = "boost", column = @Column(name = "points_per_click_boost")),
            @AttributeOverride(name = "available", column = @Column(name = "points_per_click_available"))
    })
    private Upgrade pointsPerClick = new Upgrade();

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "level", column = @Column(name = "money_chance_level")),
            @AttributeOverride(name = "boost", column = @Column(name = "money_chance_boost")),
            @AttributeOverride(name = "available", column = @Column(name = "money_chance_available"))
    })
    private Upgrade moneyChanceDrop = new Upgrade();

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "level", column = @Column(name = "crit_chance_level")),
            @AttributeOverride(name = "boost", column = @Column(name = "crit_chance_boost")),
            @AttributeOverride(name = "available", column = @Column(name = "crit_chance_available"))
    })
    private Upgrade critChanceDrop = new Upgrade();

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "level", column = @Column(name = "money_multiplier_level")),
            @AttributeOverride(name = "boost", column = @Column(name = "money_multiplier_boost")),
            @AttributeOverride(name = "available", column = @Column(name = "money_multiplier_available"))
    })
    private Upgrade moneyMultiplierDrop = new Upgrade();

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "level", column = @Column(name = "crit_multiplier_level")),
            @AttributeOverride(name = "boost", column = @Column(name = "crit_multiplier_boost")),
            @AttributeOverride(name = "available", column = @Column(name = "crit_multiplier_available"))
    })
    private Upgrade critMultiplierDrop = new Upgrade();

    // Passive Cat

    @OneToOne(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true
    )
    private PassiveCat passiveCat;

    // Inventory

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InventoryItem> inventoryItems = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "active_item_id")
    private Item activeItem;

    @Convert(converter = InstantStringConverter.class)
    private Instant activeItemExpiresAt;

    // Achievements

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserAchievement> achievements = new ArrayList<>();

    // Skins

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserCatSkin> unlockedSkins = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_skin_id")
    private CatSkin selectedSkin;

    public User() {
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public long getMoney() {
        return money;
    }

    public void setMoney(long money) {
        this.money = money;
    }

    public long getClicks() {
        return clicks;
    }

    public void setClicks(long clicks) {
        this.clicks = clicks;
    }

    public Upgrade getPointsPerClick() {
        return pointsPerClick;
    }

    public Upgrade getMoneyChanceDrop() {
        return moneyChanceDrop;
    }

    public Upgrade getCritChanceDrop() {
        return critChanceDrop;
    }

    public Upgrade getMoneyMultiplierDrop() {
        return moneyMultiplierDrop;
    }

    public Upgrade getCritMultiplierDrop() {
        return critMultiplierDrop;
    }

    public PassiveCat getPassiveCat() {
        return passiveCat;
    }

    public String getHashedPassword() {
        return password;
    }

    public void setPassiveCat(PassiveCat passiveCat) {
        this.passiveCat = passiveCat;

        if (passiveCat != null) {
            passiveCat.setUser(this);
        }
    }

    public List<InventoryItem> getInventoryItems() {
        return inventoryItems;
    }

    public Item getActiveItem(){
        return activeItem;
    }

    public Instant getActiveItemExpiresAt(){
        return activeItemExpiresAt;
    }

    public void setActiveItem(Item activeItem) {
        this.activeItem = activeItem;
    }

    public void setActiveItemExpiresAt(Instant activeItemExpiresAt) {
        this.activeItemExpiresAt = activeItemExpiresAt;
    }

    public List<UserAchievement> getAchievements() {
        return achievements;
    }

    public List<UserCatSkin> getUnlockedSkins() {
        return unlockedSkins;
    }

    public CatSkin getSelectedSkin() {
        return selectedSkin;
    }

    public void setSelectedSkin(CatSkin selectedSkin) {
        this.selectedSkin = selectedSkin;
    }

    public Upgrade getUpgrade(UpgradeType type) {
        return switch (type) {
            case POINTS_PER_CLICK -> pointsPerClick;
            case MONEY_CHANCE -> moneyChanceDrop;
            case CRIT_CHANCE -> critChanceDrop;
            case MONEY_MULTIPLIER -> moneyMultiplierDrop;
            case CRIT_MULTIPLIER -> critMultiplierDrop;
        };
    }

    public void setAchievement(UserAchievement userAchievement){
        achievements.add(userAchievement);
    }

}