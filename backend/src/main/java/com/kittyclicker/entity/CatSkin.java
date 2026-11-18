package com.kittyclicker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cat_skins")
public class CatSkin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String imagePath;

    public CatSkin() {}

    public CatSkin(String code, String imagePath) {
        this.code = code;
        this.imagePath = imagePath;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getImagePath() {
        return imagePath;
    }
}