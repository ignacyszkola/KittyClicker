package com.kittyclicker.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class Upgrade {

    private int level = 0;
    private long boost = 1;
    private boolean available = false;

    public Upgrade() {
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public long getBoost() {
        return boost;
    }

    public void setBoost(long boost) {
        this.boost = boost;
    }

    public boolean isAvailable() {
        return available;
    }

    public void purchase() {
        if (this.available) {
            throw new IllegalStateException("Upgrade already purchased");
        }

        this.level = 1;
        this.available = true;
    }

    public void levelUp(UpgradeType type) {
        if (!this.available) {
            throw new IllegalStateException("Upgrade hasn't been purchased");
        }

        this.level++;

        switch (type) {
            case POINTS_PER_CLICK, MONEY_MULTIPLIER, CRIT_MULTIPLIER -> this.boost+=level;
            case MONEY_CHANCE, CRIT_CHANCE -> this.boost=level;
        }
    }

}