package com.kittyclicker.repository;

import com.kittyclicker.entity.CatSkin;
import com.kittyclicker.entity.User;
import com.kittyclicker.entity.UserCatSkin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserCatSkinRepository extends JpaRepository<UserCatSkin, Long> {

    boolean existsByUserIdAndCatSkinId(Long userId, Long catSkinId);

}
