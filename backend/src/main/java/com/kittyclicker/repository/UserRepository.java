package com.kittyclicker.repository;

import com.kittyclicker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    long countByMoneyGreaterThan(long money);
    List<User> findByMoneyGreaterThan(long money);

}
