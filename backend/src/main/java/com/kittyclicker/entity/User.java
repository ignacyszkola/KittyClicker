package com.kittyclicker.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private long money;
    private long clicks;

    @OneToMany(mappedBy = "user")
    private List<UserCat> cats = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<UserCatSkin> unlockedSkins = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<InventoryItem> inventory = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<UserAchievement> achievements = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_skin_id")
    private UserCatSkin selectedSkin;

    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }
    public Long getId() {
        return id;
    }
    public long getMoney() {
        return money;
    }
    public long getClicks() {
        return clicks;
    }
    public List<UserCat> getCats() {
        return cats;
    }
    public List<UserCatSkin> getUnlockedSkins() {
        return unlockedSkins;
    }
    public List<InventoryItem> getInventory() {
        return inventory;
    }
    public List<UserAchievement> getAchievements() {
        return achievements;
    }
    public UserCatSkin getSelectedSkin() {
        return selectedSkin;
    }
    public String getHashedPassword(){
        return password;
    }

    public void setMoney(long money) {
        this.money = money;
    }
    public void setClicks(int click){
        this.clicks += click;
    }
}