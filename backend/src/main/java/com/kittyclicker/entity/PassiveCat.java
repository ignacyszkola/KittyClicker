package com.kittyclicker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "passive_cats")
public class PassiveCat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private int level = 1;

    private double cps = 1.0;

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

    public PassiveCat() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public double getCps() {
        return cps;
    }

    public void setCps(double cps) {
        this.cps = cps;
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

    public void upgrade(){
        level++;
        cps += 0.125;

        boolean upgraded = false;

        if(level % 2 == 0){
            moneyMultiplierDrop.setBoost(moneyMultiplierDrop.getBoost() + 1);
            critMultiplierDrop.setBoost(critMultiplierDrop.getBoost() + 1);
            moneyMultiplierDrop.setLevel(moneyMultiplierDrop.getLevel() + 1);
            critMultiplierDrop.setLevel(critMultiplierDrop.getLevel() + 1);
            upgraded = true;
        }

        if(level % 3 == 0 && moneyChanceDrop.getLevel() < 100){
            moneyChanceDrop.setBoost(moneyChanceDrop.getBoost() + 1);
            critChanceDrop.setBoost(critChanceDrop.getBoost() + 1);
            moneyChanceDrop.setLevel(moneyChanceDrop.getLevel() + 1);
            critChanceDrop.setLevel(critChanceDrop.getLevel() + 1);
            upgraded = true;
        }

        if(!upgraded){
            pointsPerClick.setBoost(pointsPerClick.getBoost() + 1);
            pointsPerClick.setLevel(pointsPerClick.getLevel() + 1);
        }
    }
}