package com.kittyclicker.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "user_cats",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"user_id", "cat_type_id"}
                )
        }
)
public class UserCat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_type_id", nullable = false)
    private CatType catType;

    @Column(nullable = false)
    private long level = 1;

    private long pointMultiplierValue = 1;

    private long moneyDropMultiplierValue = 1;

    private long criticalClickMultiplierValue = 1;

    private int criticalClickChancePercentage = 1;

    private int moneyDropChancePercentage = 1;

    private double cps = 1;

    public UserCat() {}

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public CatType getCatType() {
        return catType;
    }

    public long getLevel() {
        return level;
    }

    public long getPointMultiplierValue() {
        return pointMultiplierValue;
    }

    public long getMoneyDropMultiplierValue() {
        return moneyDropMultiplierValue;
    }

    public long getCriticalClickMultiplierValue() {
        return criticalClickMultiplierValue;
    }

    public int getCriticalClickChancePercentage() {
        return criticalClickChancePercentage;
    }

    public int getMoneyDropChancePercentage() {
        return moneyDropChancePercentage;
    }

    public double getCps() {
        return cps;
    }
}