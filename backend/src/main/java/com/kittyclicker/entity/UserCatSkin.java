package com.kittyclicker.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "user_cat_skins",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"user_id", "cat_skin_id"}
                )
        }
)
public class UserCatSkin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_skin_id", nullable = false)
    private CatSkin catSkin;

    public UserCatSkin() {}

    public UserCatSkin(User user, CatSkin catSkin) {
        this.user = user;
        this.catSkin = catSkin;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public CatSkin getCatSkin() {
        return catSkin;
    }
}