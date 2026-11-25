package com.kittyclicker.entity;

import com.kittyclicker.exception.InvalidCredentialsException;
import com.kittyclicker.exception.TooHighLevelException;
import jakarta.persistence.Embeddable;

@Embeddable
public class Upgrade {

    private int level = 1;
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

        if ((type == UpgradeType.CRIT_CHANCE || type == UpgradeType.MONEY_CHANCE) && level >= 100) {
            throw new TooHighLevelException("This upgrade can't exceed level 100");
        }

        this.level++;

        switch (type) {
            case POINTS_PER_CLICK, MONEY_MULTIPLIER, CRIT_MULTIPLIER -> this.boost+=level;
            case MONEY_CHANCE, CRIT_CHANCE -> this.boost=level;
        }
    }

}