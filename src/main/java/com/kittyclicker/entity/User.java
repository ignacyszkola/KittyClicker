package com.kittyclicker.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class User {

    @Id
    @GeneratedValue
    private Long id;

    private String username;
    private String password;
    private long money;

    public User(){}
    public User(String username){
        this.username = username;
    }

    public String getUsername(){
        return username;
    }
    public Long getId(){
        return id;
    }
    public long getMoney(){
        return money;
    }
}
