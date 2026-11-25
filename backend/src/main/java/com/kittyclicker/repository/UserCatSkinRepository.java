package com.kittyclicker.repository;

import com.kittyclicker.entity.UserCatSkin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCatSkinRepository extends JpaRepository<UserCatSkin, Long> {

    boolean existsByUserIdAndCatSkinId(Long userId, Long catSkinId);

}
