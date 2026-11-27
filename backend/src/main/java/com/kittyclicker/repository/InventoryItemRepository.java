package com.kittyclicker.repository;

import com.kittyclicker.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {

    Optional<InventoryItem> findByUserIdAndItemId(Long userId, Long itemId);

}
